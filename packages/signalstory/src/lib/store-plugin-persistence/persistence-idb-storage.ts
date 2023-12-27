/* eslint-disable @typescript-eslint/no-explicit-any */

import { BehaviorSubject, filter, first } from 'rxjs';
import { StorePersistencePluginOptions } from './plugin-persistence';

/**
 * Represents the interface for store persistence methods with asynchronous operations.
 */
export interface IndexedDbStorage<TValue = unknown> {
  /**
   * Retrieves the value associated with the specified key and processes it asynchronously.
   * @param key - The key to retrieve the value for.
   * @param callback - A callback function to handle the retrieved value asynchronously.
   */
  init(storeName: string, callback?: () => void): void;
  getAndProcessState(callback: (value: TValue | null) => void): void;
  setState(value: TValue): void;
  clearState(): void;
}

/**
 * Type guard to check if an object implements the `PersistenceStorageAsynchronous` interface.
 * @param obj - The object to check.
 * @returns True if the object implements the `PersistenceStorageAsynchronous` interface, false otherwise.
 */
export function isIndexedDbStorage(obj: any): obj is IndexedDbStorage {
  return (
    typeof obj === 'object' &&
    typeof obj.getAndProcessState === 'function' &&
    typeof obj.setState === 'function' &&
    typeof obj.clearState === 'function'
  );
}

export interface IndexedDbSetupHandlers {
  onUpgradeNeeded?: (db: IDBDatabase) => void;
  onSuccess?: () => void;
  onBlocked?: () => void;
  onInitializationError?: () => void;
}

export interface IndexedDbOptions {
  dbName: string;
  dbVersion: number;
  objectStoreName?: string;
  key?: number;
  handlers?: IndexedDbSetupHandlers;
}

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

type IdbPoolEntry = undefined | 'InitError' | 'Blocked' | IDBDatabase;
function isIdbDataBase(entry: IdbPoolEntry): entry is IDBDatabase {
  return !!entry && typeof entry === 'object' && 'name' in entry;
}

class IndexedDbAdapter implements IndexedDbStorage<unknown> {
  private static dbPool = new Map<string, BehaviorSubject<IdbPoolEntry>>();
  private static objectStoreCounter = new Map<string, number>();
  private db: IDBDatabase | undefined;

  constructor(
    private dbName: string,
    private dbVersion: number,
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

  private static incrementKey(dbName: string, objectStoreName: string): number {
    const storeKey = `${dbName}▷${objectStoreName}`;
    const storeCount = IndexedDbAdapter.objectStoreCounter.get(storeKey) ?? 0;
    IndexedDbAdapter.objectStoreCounter.set(storeKey, storeCount + 1);
    return storeCount + 1;
  }

  init(storeName: string, callback?: () => void) {
    const cachedDb = IndexedDbAdapter.dbPool.get(this.dbName);

    if (cachedDb) {
      if (isIdbDataBase(cachedDb.value)) {
        this.db = cachedDb.value;

        if (this.db.version !== this.dbVersion) {
          throw new Error(
            `Attempted to open a connection to IndexedDb ${this.dbName} with the version ${this.dbVersion}, but another connection to the same db with the version ${this.db.version} is already open. Please use only one version for a specific db.`
          );
        }

        this._objectStoreName ??= storeName;
        this._key ??= IndexedDbAdapter.incrementKey(
          this.dbName,
          this.objectStoreName
        );

        this.handlers?.onSuccess?.();
        callback?.();
      } else if (cachedDb.value === 'Blocked') {
        this.handlers?.onBlocked?.();
      } else if (cachedDb.value === 'InitError') {
        this.handlers?.onInitializationError?.();
      } else {
        cachedDb
          .pipe(
            filter(db => !!db),
            first()
          )
          .subscribe(() => {
            this.init(storeName, callback);
          });
      }
    } else {
      this._objectStoreName ??= storeName;
      this._key ??= IndexedDbAdapter.incrementKey(
        this.dbName,
        this.objectStoreName
      );

      const request = indexedDB.open(this.dbName, this.dbVersion);

      IndexedDbAdapter.dbPool.set(
        this.dbName,
        new BehaviorSubject<IdbPoolEntry>(undefined)
      );

      request.onupgradeneeded = event => {
        this.db ??= (event.target as IDBRequest)?.result;

        if (this.db) {
          this.handlers?.onUpgradeNeeded?.(this.db);
          if (!this.db.objectStoreNames.contains(this.objectStoreName)) {
            this.db.createObjectStore(this.objectStoreName);
          }
        }
      };

      request.onsuccess = event => {
        this.db ??= (event.target as IDBRequest)?.result;

        if (this.db) {
          IndexedDbAdapter.dbPool.get(this.dbName)?.next(this.db);
          setTimeout(() => {
            this.handlers?.onSuccess?.();
            callback?.();
          }, 0);
        }
      };

      request.onblocked = () => {
        IndexedDbAdapter.dbPool.get(this.dbName)?.next('Blocked');
        this.handlers?.onBlocked?.();
      };

      request.onerror = () => {
        IndexedDbAdapter.dbPool.get(this.dbName)?.next('InitError');
        this.handlers?.onInitializationError?.();
      };
    }
  }

  getAndProcessState(
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

  setState(value: unknown): void {
    this.db
      ?.transaction([this.objectStoreName], 'readwrite')
      ?.objectStore(this.objectStoreName)
      ?.put(value, this.key);
  }

  clearState(): void {
    this.db
      ?.transaction([this.objectStoreName], 'readwrite')
      ?.objectStore(this.objectStoreName)
      ?.clear();
  }
}
