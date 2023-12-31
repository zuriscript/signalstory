/* eslint-disable @typescript-eslint/no-explicit-any */
import { Immutable } from '../../store-immutability/immutable-type';
import { getOrOpenDb } from './idb-pool';

// Define the possible update operations for the database
type DbUpdateOperation =
  | ((oldVersion: number, oldState: unknown) => unknown)
  | 'CLEAR'
  | 'DROP'
  | undefined;

/**
 * Class for configuring indexedb object stores
 */
class IndexedDbStoreRegistrator {
  private readonly _registrations: [string, DbUpdateOperation][] = [];

  /**
   * Creates an object store if it does not exist
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStore(objectStoreName: string) {
    this._registrations.push([objectStoreName, undefined]);
    return this;
  }

  /**
   * Creates an object store if it does not exist.
   * If it does exists, the current object store value is cleared
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStoreOrClearState(objectStoreName: string) {
    this._registrations.push([objectStoreName, 'CLEAR']);
    return this;
  }

  /**
   * Creates an object store if it does not exist.
   * If it does exists, the current object store value can be transformed using the passed transformation function
   * @param objectStoreName - The name of the object store
   * @param transformation - Custom transformation function for update
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStoreOrTransform(
    objectStoreName: string,
    transformation: (oldVersion: number, oldState: any) => any
  ) {
    this._registrations.push([objectStoreName, transformation]);
    return this;
  }

  /**
   * Deletes the object store if it does exist.
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  dropStore(objectStoreName: string) {
    this._registrations.push([objectStoreName, 'DROP']);
    return this;
  }

  /**
   * Get all registrations
   */
  get registrations(): Immutable<[string, DbUpdateOperation][]> {
    return this._registrations;
  }
}

/**
 * Configure the indexed database with the specified registrations
 * @param dbName - The name of the database
 * @param dbVersion - The version of the database
 * @param registration - A function to perform store registrations
 */
export function migrateIndexedDb(
  dbName: string,
  dbVersion: number,
  registration: (
    registration: IndexedDbStoreRegistrator
  ) => IndexedDbStoreRegistrator
) {
  const registrations = registration(
    new IndexedDbStoreRegistrator()
  ).registrations;

  if (!registrations || registrations.length === 0) {
    throw new Error('configureIndexedDb: Please register at least one Store');
  }

  getOrOpenDb(dbName, dbVersion, event => {
    const target = event.target as IDBRequest;
    const db = target.result;
    const transaction = target.transaction!;
    const oldVersion = event.oldVersion;

    registrations.forEach(([store, op]) => {
      if (!db.objectStoreNames.contains(store)) {
        if (op !== 'DROP') {
          db.createObjectStore(store);
        }
      } else if (op) {
        if (op === 'DROP') {
          db.deleteObjectStore(store);
        } else {
          const objectStore = transaction.objectStore(store);
          const currentValueRequest = objectStore.get(1);

          currentValueRequest.onsuccess = (event: any) => {
            if (op === 'CLEAR') {
              objectStore.clear();
            } else if (typeof op === 'function') {
              const existingData = event.target.result;
              const newData = op(oldVersion, existingData);
              objectStore.put(newData, 1);
            }
          };
        }
      }
    });
  });
}
