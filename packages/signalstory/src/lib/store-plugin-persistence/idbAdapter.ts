/* eslint-disable @typescript-eslint/no-explicit-any */

import { ObjectStorage } from './persistence-object-storage';
import { StorePersistencePluginOptions } from './plugin-persistence';

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

export function useIndexedDb(
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

class IndexedDbAdapter implements ObjectStorage<unknown> {
  private static dbPool = new Map<string, IDBDatabase>();
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

  private static getDbFromPool(
    dbName: string,
    dbVersion: number
  ): IDBDatabase | undefined {
    const db = IndexedDbAdapter.dbPool.get(dbName);
    if (db && db.version == dbVersion) {
      throw new Error(
        `Attempted to open a connection to IndexedDb ${dbName} with the version ${dbVersion}. But another connection with the version ${dbVersion} is already open. Please use only one version for a specific db.`
      );
    }

    return db;
  }

  private static computeKey(dbName: string, objectStoreName: string): number {
    const storeKey = `${dbName}▷${objectStoreName}`;
    const storeCount = IndexedDbAdapter.objectStoreCounter.get(storeKey) ?? 0;
    IndexedDbAdapter.objectStoreCounter.set(storeKey, storeCount + 1);
    return storeCount + 1;
  }

  init(storeName: string, callback?: () => void) {
    const cachedDb = IndexedDbAdapter.getDbFromPool(
      this.dbName,
      this.dbVersion
    );

    if (cachedDb) {
      this.db = cachedDb;
      this._objectStoreName ??= storeName;
      this._key ??= IndexedDbAdapter.computeKey(
        this.dbName,
        this.objectStoreName
      );
      this.handlers?.onSuccess?.();
      callback?.();
    } else {
      this._objectStoreName ??= storeName;
      this._key ??= 1;

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = event => {
        this.db = (event.target as IDBRequest)?.result;

        if (this.db) {
          this.handlers?.onUpgradeNeeded?.(this.db);
          if (!this.db.objectStoreNames.contains(this.objectStoreName)) {
            this.db.createObjectStore(this.objectStoreName);
          }
        }
      };

      request.onsuccess = event => {
        this.db = (event.target as IDBRequest).result;
        this.handlers?.onSuccess?.();
        callback?.();
      };

      if (this.handlers?.onBlocked) {
        request.onblocked = this.handlers.onBlocked;
      }

      if (this.handlers?.onInitializationError) {
        request.onerror = this.handlers.onInitializationError;
      }
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
