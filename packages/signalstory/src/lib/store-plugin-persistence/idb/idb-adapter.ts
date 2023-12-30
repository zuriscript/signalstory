import { BehaviorSubject, filter, first } from 'rxjs';
import { AsyncStorage } from '../persistence-async-storage';
import { StorePersistencePluginOptions } from '../plugin-persistence';

export interface IndexedDbSetupHandlers {
  onUpgradeNeeded?: (event: IDBVersionChangeEvent) => void;
  onSuccess?: () => void;
  onBlocked?: () => void;
  onInitializationError?: () => void;
}

export interface IndexedDbOptions {
  dbName: string;
  dbVersion?: number;
  objectStoreName?: string;
  handlers?: IndexedDbSetupHandlers;
}

export function connectToIndexedDb(
  options: IndexedDbOptions
): StorePersistencePluginOptions {
  return {
    persistenceStorage: new IndexedDbAdapter(
      options.dbName,
      options.dbVersion,
      options.objectStoreName,
      options.handlers
    ),
  };
}

type IdbPoolEntry = undefined | 'InitError' | 'Blocked' | IDBDatabase;
function isIdbDataBase(entry: IdbPoolEntry): entry is IDBDatabase {
  return !!entry && typeof entry === 'object' && 'name' in entry;
}

export class IndexedDbAdapter implements AsyncStorage {
  private static dbPool = new Map<string, BehaviorSubject<IdbPoolEntry>>();
  private static objectStoreCounter = new Map<string, number>();
  private db: IDBDatabase | undefined;
  private _key: number | undefined;

  constructor(
    private dbName: string,
    private dbVersion?: number,
    private _objectStoreName?: string,
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

  initAsync(storeName: string, callback?: () => void) {
    const cachedDb = IndexedDbAdapter.dbPool.get(this.dbName);
    this._objectStoreName = storeName;
    this._key = IndexedDbAdapter.incrementKey(
      this.dbName,
      this.objectStoreName
    );

    if (cachedDb) {
      if (isIdbDataBase(cachedDb.value)) {
        this.db = cachedDb.value;
        this.dbVersion ??= this.db.version;

        if (this.db.version !== this.dbVersion) {
          throw new Error(
            `Attempted to open a connection to IndexedDb ${this.dbName} with the version ${this.dbVersion}, but another connection to the same db with the version ${this.db.version} is already open. Please use only one version for a specific db.`
          );
        }

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
            this.initAsync(storeName, callback);
          });
      }
    } else {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      IndexedDbAdapter.dbPool.set(
        this.dbName,
        new BehaviorSubject<IdbPoolEntry>(undefined)
      );

      request.onupgradeneeded = event => {
        this.db ??= (event.target as IDBRequest)?.result;

        if (this.db) {
          this.handlers?.onUpgradeNeeded?.(event);
          if (!this.db.objectStoreNames.contains(this.objectStoreName)) {
            this.db.createObjectStore(this.objectStoreName);
          }
        }
      };

      request.onsuccess = event => {
        this.db ??= (event.target as IDBRequest)?.result;

        if (this.db) {
          IndexedDbAdapter.dbPool.get(this.dbName)?.next(this.db);
          this.handlers?.onSuccess?.();
          callback?.();
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
