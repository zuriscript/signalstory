/* eslint-disable @typescript-eslint/no-explicit-any */
import { Immutable } from '../../store-immutability/immutable-type';

type ObjectStoreMigration = (oldVersion: number, oldState: unknown) => unknown;
type DbUpdateOperation = ObjectStoreMigration | 'CLEAR' | 'DROP' | undefined;
type DbMigration = [string, DbUpdateOperation | IndexedDbStoreMigrator][];
type DbMigrationRegistration = {
  dbVersion: number;
  migrations: DbMigration;
};

/**
 * Class for configuring indexedb object stores and their corresponding miggrations
 */
class IndexedDbStoreMigrator {
  private readonly migrations: DbMigration = [];

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
    transformation: (oldVersion: number, oldState: unknown) => any
  ) {
    this.migrations.push([objectStoreName, transformation]);
    return this;
  }

  /**
   * Creates an object store if it does not exist.
   * If it does exists, the current object store value can be transformed using the passed transformation function
   * @param objectStoreName - The name of the object store
   * @param transformation - Custom transformation function for update
   * @returns The IndexedDbStoreRegistrator instance for chaining
   */
  createStoreOrMigrateRecords(
    objectStoreName: string,
    migration: (records: IndexedDbStoreMigrator) => IndexedDbStoreMigrator
  ) {
    const recordMigration = migration(new IndexedDbStoreMigrator());
    this.migrations.push([objectStoreName, recordMigration]);
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
  getMigrations(): Immutable<DbMigration> {
    return this.migrations;
  }
}

/**
 * Registered indexedDB migrations per databasename
 */
const idbMigrations = new Map<string, Immutable<DbMigrationRegistration>>();

/**
 * Retrieves the registered migration for a specific IndexedDB database.
 * @param dbName - The name of the IndexedDB database.
 * @returns The registered migration or undefined if not found.
 */
export function getRegisteredMigration(dbName: string) {
  return idbMigrations.get(dbName);
}

/**
 * Redeems the migration for a specific IndexedDB database.
 * @param dbName - The name of the IndexedDB database.
 * @param dbVersion - Optional parameter specifying the database version.
 * @returns A function to handle the IDBVersionChangeEvent or undefined if the migration is not found.
 * @throws Error if attempting to open a connection with a version different from the registered migration.
 */
export function redeemMigration(dbName: string, dbVersion?: number) {
  const migration = idbMigrations.get(dbName);
  if (!migration) {
    return undefined;
  }

  if (dbVersion && dbVersion !== migration.dbVersion) {
    throw new Error(
      `getMigrationForDb: Attempted to open a connection to IndexedDb ${dbName} with the version ${dbVersion}, but a migration for the version ${migration.dbVersion} has been specified. Please use only one version for a specific db.`
    );
  }

  idbMigrations.delete(dbName);

  return (event: IDBVersionChangeEvent) => {
    const target = event.target as IDBRequest;
    const db = target.result;
    const transaction = target.transaction!;
    const oldVersion = event.oldVersion;

    migration.migrations.forEach(([store, op]) => {
      if (!db.objectStoreNames.contains(store)) {
        if (op !== 'DROP') {
          db.createObjectStore(store);
        }
      } else if (op) {
        if (op === 'DROP') {
          db.deleteObjectStore(store);
        } else {
          const objectStore = transaction.objectStore(store);
          if (op === 'CLEAR') {
            objectStore.clear();
          } else {
            if (op instanceof IndexedDbStoreMigrator) {
              // Migrate records of objectStore (one-objectstore-for-mulitple-stores approach)
              op.getMigrations().forEach(([recordName, recordOp]) => {
                objectStore.get(recordName).onsuccess = (event: any) => {
                  if (recordOp === 'DROP') {
                    objectStore.delete(recordName);
                  } else if (recordOp === 'CLEAR') {
                    objectStore.put(undefined, recordName);
                  } else if (typeof recordOp === 'function') {
                    const existingData = event.target.result;
                    if (existingData) {
                      const newData = recordOp(oldVersion, existingData);
                      objectStore.put(newData, recordName);
                    }
                  }
                };
              });
            } else if (typeof op === 'function') {
              // Migrate objectStore
              objectStore.openCursor().onsuccess = (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                  const existingData = cursor.value;
                  const newData = op(oldVersion, existingData);
                  objectStore.put(newData, cursor.primaryKey);
                }
              };
            }
          }
        }
      }
    });
  };
}

/**
 * Configures the IndexedDB with specified store registrations and database migration.
 * @param dbName - The name of the IndexedDB database.
 * @param dbVersion - The version of the IndexedDB database.
 * @param migration - A function defining store registrations and migration operations.
 * @remarks Migrations are registered lazily and applied upon the first use of the database.
 * @throws Throws an error if no stores are registered for migration.
 * @throws Throws an error if a migration for the specified database already exists.
 */
export function migrateIndexedDb(
  dbName: string,
  dbVersion: number,
  migration: (model: IndexedDbStoreMigrator) => IndexedDbStoreMigrator
) {
  const migrations = migration(new IndexedDbStoreMigrator()).getMigrations();

  if (!migrations || migrations.length === 0) {
    throw new Error('migrateIndexedDb: Please register at least one Store');
  }

  if (idbMigrations.has(dbName)) {
    throw new Error(
      `migrateIndexedDb: A migration for ${dbName} has already been specified`
    );
  }

  idbMigrations.set(dbName, {
    dbVersion,
    migrations,
  });
}
