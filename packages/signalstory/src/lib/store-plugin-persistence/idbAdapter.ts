/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceStorageAsynchronous } from './persistence-asynchronous';

//const idbPool = new Map<string, IDBDatabase>();

export function createIndexedDbAdapter(dbName: string, dbVersion: number) {
  return new IndexedDbAdapter(dbName, dbVersion);
}

export class IndexedDbAdapter
  implements PersistenceStorageAsynchronous<string, unknown>
{
  private db: IDBDatabase | undefined;

  constructor(
    private dbName: string,
    private dbVersion: number
  ) {}

  init(storeName: string, onSuccess: () => void) {
    const request = indexedDB.open(this.dbName, this.dbVersion);
    request.onupgradeneeded = event => {
      this.db = (event.target as IDBRequest)?.result;
      if (this.db && !this.db.objectStoreNames.contains(storeName)) {
        this.db.createObjectStore(storeName);
      }
    };
    request.onsuccess = event => {
      this.db = (event.target as IDBRequest).result;
      onSuccess();
    };
  }

  getAndProcessValue(
    storeName: string,
    callback: (value: unknown | null | undefined) => void
  ): void {
    const request = this.db
      ?.transaction([storeName])
      ?.objectStore(storeName)
      ?.get(1);

    if (request) {
      request.onsuccess = (event: Event) => {
        callback((event.target as IDBRequest).result);
      };
    }
  }

  setItem(storeName: string, value: unknown): void {
    this.db
      ?.transaction([storeName], 'readwrite')
      ?.objectStore(storeName)
      ?.put(value, 1);
  }

  removeItem(storeName: string): void {
    this.db
      ?.transaction([storeName], 'readwrite')
      ?.objectStore(storeName)
      ?.clear();
  }
}
