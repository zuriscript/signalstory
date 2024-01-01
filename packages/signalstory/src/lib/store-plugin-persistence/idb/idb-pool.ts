import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Represents possible states of an IndexedDB pool entry.
 */
type IndexedDbPoolEntryState =
  | undefined
  | 'InitError'
  | 'Blocked'
  | IDBDatabase;

/**
 * Type guard for IDBDatabase based on IndexedDbPoolEntryState.
 * @param entry The IndexedDB pool entry to be checked.
 * @returns True if the entry is an IDBDatabase, false otherwise.
 */
export function isIDBDatabase(
  entry: IndexedDbPoolEntryState
): entry is IDBDatabase {
  return typeof entry === 'object' && 'name' in IDBDatabase;
}

/**
 * Represents a mapping of database names to their corresponding cached IndexedDB pool entries.
 */
const dbPool = new Map<string, IndexedDbPoolEntry>();

/**
 * Represents an entry in the IndexedDB pool.
 */
class IndexedDbPoolEntry {
  private readonly _db = new BehaviorSubject<IndexedDbPoolEntryState>(
    undefined
  );

  public constructor(
    public readonly dbName: string,
    public readonly dbVersion: number
  ) {}

  get db() {
    return this._db.asObservable();
  }

  updateEntryState(dbState: IndexedDbPoolEntryState) {
    this._db.next(dbState);
  }
}

/**
 * Retrieves an existing or opens a new connection to an IndexedDB.
 * @param dbName - The name of the database.
 * @param dbVersion - The version of the database.
 * @param migration - A callback function to perform database migration during upgrade.
 * @returns An observable stream representing the state of the IndexedDB entry.
 * @throws Throws an error if attempting to open a connection to a database with conflicting versions.
 */
export function getOrOpenDb(
  dbName: string,
  dbVersion?: number,
  migration?: (event: IDBVersionChangeEvent) => void
): Observable<IndexedDbPoolEntryState> {
  const cachedDbEntry = dbPool.get(dbName);

  if (cachedDbEntry) {
    if (dbVersion && cachedDbEntry.dbVersion !== dbVersion) {
      throw new Error(
        `getOrOpenDb: Attempted to open a connection to IndexedDb ${dbName} with the version ${dbVersion}, but another connection to the same db with the version ${cachedDbEntry.dbVersion} is already open. Please use only one version for a specific db.`
      );
    }

    return cachedDbEntry.db;
  } else {
    if (!dbVersion) {
      throw new Error(
        `getOrOpenDb: No db version specified. If you want to use auto versioning, than you have to setup db migration first using a specific version`
      );
    }

    const dbPoolEntry = new IndexedDbPoolEntry(dbName, dbVersion);
    dbPool.set(dbName, dbPoolEntry);

    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBRequest)?.result as IDBDatabase;

      if (db) {
        migration?.(event);
      }
    };

    request.onsuccess = event => {
      dbPoolEntry.updateEntryState((event.target as IDBRequest)?.result);
    };

    request.onblocked = () => {
      dbPoolEntry.updateEntryState('Blocked');
    };

    request.onerror = () => {
      dbPoolEntry.updateEntryState('InitError');
    };

    return dbPoolEntry.db;
  }
}
