import { filter, first } from 'rxjs';
import { AsyncStorage } from '../persistence-async-storage';
import { StorePersistencePluginOptions } from '../plugin-persistence';
import { getOrOpenDb } from './idb-pool';

/**
 * Represents the configuration options for IndexedDB setup handlers.
 */
export interface IndexedDbSetupHandlers {
  onUpgradeNeeded?: (event: IDBVersionChangeEvent) => void;
  onSuccess?: () => void;
  onBlocked?: () => void;
  onInitializationError?: () => void;
}

/**
 * Represents the options for connecting to an IndexedDB.
 */
export interface IndexedDbOptions {
  dbName: string;
  dbVersion?: number;
  objectStoreName?: string;
  key?: number;
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
 * Represents possible states of an IndexedDB pool entry.
 */
type IdbPoolEntry = undefined | 'InitError' | 'Blocked' | IDBDatabase;

/**
 * Checks if an entry is an instance of IDBDatabase.
 * @param entry - The IndexedDB pool entry.
 * @returns True if the entry is an IDBDatabase; otherwise, false.
 */
function isIdbDataBase(entry: IdbPoolEntry): entry is IDBDatabase {
  return !!entry && typeof entry === 'object' && 'name' in entry;
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
      if (isIdbDataBase(entry)) {
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
    const request = this.db
      ?.transaction([this.objectStoreName], 'readwrite')
      ?.objectStore(this.objectStoreName)
      ?.clear();

    if (request && callback) {
      request.onsuccess = callback;
    }
  }
}
