import { filter, first } from 'rxjs';
import { AsyncStorage } from '../persistence-async-storage';
import { StorePersistencePluginOptions } from '../plugin-persistence';
import { getOrOpenDb, isIDBDatabase } from './idb-pool';

/**
 * Represents the configuration options for IndexedDB setup handlers.
 */
export interface IndexedDbSetupHandlers {
  /**
   * Callback for handling the 'upgradeneeded' event during database initialization.
   * @param event - The 'upgradeneeded' event.
   * @remarks
   * ATTENTION: This method is triggered only when opening a fresh database connection.
   * If a cached database instance is used, such as with `migrateIndexedDb`, this function will not be called.
   */
  onUpgradeNeeded?: (event: IDBVersionChangeEvent) => void;

  /**
   * Callback for handling the 'success' event after successfully connecting to the database.
   */
  onSuccess?: () => void;

  /**
   * Callback for handling the 'blocked' event when a connection request is blocked.
   */
  onBlocked?: () => void;

  /**
   * Callback for handling errors during database initialization.
   */
  onInitializationError?: () => void;
}

/**
 * Represents the options for connecting to an IndexedDB.
 */
export interface IndexedDbOptions {
  /**
   * The name of the IndexedDB database.
   */
  dbName: string;

  /**
   * The version of the IndexedDB database. If not provided,
   * the adapter will attempt to deduce the version by inspecting the pool.
   * This relies on prior configuration of IDB migration.
   */
  dbVersion?: number;

  /**
   * The name of the object store to connect to within the database.
   * If not provided, it will use the stores name
   */
  objectStoreName?: string;

  /**
   * The key to use when connecting to a specific record within the object store. Default is 1.
   */
  key?: number;

  /**
   * Configuration options for IndexedDB setup handlers.
   */
  handlers?: IndexedDbSetupHandlers;
}

/**
 * configures connection to an IndexedDb
 * @param options - The configuration options for IndexedDB.
 * @returns Store persistence plugin options.
 */
export function configureIndexedDb(
  options: IndexedDbOptions
): StorePersistencePluginOptions {
  return {
    persistenceStorage: new IndexedDbAdapter(
      options.dbName,
      options.dbVersion,
      options.objectStoreName,
      options.key,
      options.handlers
    ),
  };
}

/**
 * Represents an adapter for interacting with IndexedDB, implementing AsyncStorage.
 */
export class IndexedDbAdapter implements AsyncStorage {
  private db: IDBDatabase | undefined;

  constructor(
    private dbName: string,
    private dbVersion?: number,
    private _objectStoreName?: string,
    private _key?: number,
    private handlers?: IndexedDbSetupHandlers
  ) {}

  private get objectStoreName() {
    return this._objectStoreName!;
  }

  private get key() {
    return this._key!;
  }

  initAsync(storeName: string, callback?: () => void) {
    const db = getOrOpenDb(this.dbName, this.dbVersion, event => {
      const db = (event.target as IDBRequest)?.result;

      if (db) {
        this.handlers?.onUpgradeNeeded?.(event);
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      }
    });

    db.pipe(
      filter(entry => !!entry),
      first()
    ).subscribe(entry => {
      if (isIDBDatabase(entry)) {
        this.db = entry;
        this.dbVersion = entry.version;
        this._objectStoreName ??= storeName;
        this._key ??= 1;
        this.handlers?.onSuccess?.();
        callback?.();
      } else if (entry === 'Blocked') {
        this.handlers?.onBlocked?.();
      } else if (entry === 'InitError') {
        this.handlers?.onInitializationError?.();
      }
    });
  }

  getItemAsync(
    _: string,
    callback: (value: unknown | null | undefined) => void
  ): void {
    const request = this.db
      ?.transaction([this.objectStoreName])
      ?.objectStore(this.objectStoreName)
      ?.get(this.key);

    if (request) {
      request.onsuccess = (event: Event) => {
        callback((event.target as IDBRequest).result);
      };
    }
  }

  setItemAsync(_: string, value: unknown, callback?: () => void): void {
    const request = this.db
      ?.transaction([this.objectStoreName], 'readwrite')
      ?.objectStore(this.objectStoreName)
      ?.put(value, this.key);

    if (request && callback) {
      request.onsuccess = callback;
    }
  }

  removeItemAsync(_: string, callback?: () => void): void {
    console.log('removeItemAsync', this.db, this.objectStoreName);
    const request = this.db
      ?.transaction([this.objectStoreName], 'readwrite')
      ?.objectStore(this.objectStoreName)
      ?.clear();

    console.log(
      'removeItemAsync AFTER',
      this.db,
      this.objectStoreName,
      request
    );

    if (request && callback) {
      request.onsuccess = callback;
    }
  }
}
