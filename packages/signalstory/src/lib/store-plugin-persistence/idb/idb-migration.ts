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
 * Class for configuring indexedb object stores and their corresponding miggrations
 */
class IndexedDbStoreMigrator {
  private readonly migrations: [string, DbUpdateOperation][] = [];

  /**
   * Creates an object store if it does not exist
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStore(objectStoreName: string) {
    this.migrations.push([objectStoreName, undefined]);
    return this;
  }

  /**
   * Creates an object store if it does not exist.
   * If it does exists, the current object store value is cleared
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStoreOrClearState(objectStoreName: string) {
    this.migrations.push([objectStoreName, 'CLEAR']);
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
    this.migrations.push([objectStoreName, transformation]);
    return this;
  }

  /**
   * Deletes the object store if it does exist.
   * @param objectStoreName - The name of the object store
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  dropStore(objectStoreName: string) {
    this.migrations.push([objectStoreName, 'DROP']);
    return this;
  }

  /**
   * Get all registrations
   */
  getMigrations(): Immutable<[string, DbUpdateOperation][]> {
    return this.migrations;
  }
}

/**
 * Configure the IndexedDB with specified store registrations and database migration.
 * @param dbName - The name of the IndexedDB database.
 * @param dbVersion - The version of the IndexedDB database.
 * @param migration - A function to define store registrations and migration operations.
 * @remarks Ensure that the migration function registers at least one store to avoid errors.
 * @throws Throws an error if no stores are registered for migration.
 */
export function migrateIndexedDb(
  dbName: string,
  dbVersion: number,
  migration: (model: IndexedDbStoreMigrator) => IndexedDbStoreMigrator
) {
  const migrations = migration(new IndexedDbStoreMigrator()).getMigrations();

  if (!migrations || migrations.length === 0) {
    throw new Error('configureIndexedDb: Please register at least one Store');
  }

  getOrOpenDb(dbName, dbVersion, event => {
    const target = event.target as IDBRequest;
    const db = target.result;
    const transaction = target.transaction!;
    const oldVersion = event.oldVersion;

    migrations.forEach(([store, op]) => {
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
