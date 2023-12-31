import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Represents possible states of an IndexedDB pool entry.
 */
type IndexedDbPoolEntryState =
  | undefined
  | 'InitError'
  | 'Blocked'
  | IDBDatabase;

const dbPool = new Map<string, IndexedDbPoolEntry>();

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

export function getOrOpenDb(
  dbName: string,
  dbVersion?: number,
  migration?: (event: IDBVersionChangeEvent) => void
): Observable<IndexedDbPoolEntryState> {
  const cachedDbEntry = dbPool.get(dbName);

  if (cachedDbEntry) {
    if (dbVersion && cachedDbEntry.dbVersion !== dbVersion) {
      throw new Error(
        `Attempted to open a connection to IndexedDb ${dbName} with the version ${dbVersion}, but another connection to the same db with the version ${cachedDbEntry.dbVersion} is already open. Please use only one version for a specific db.`
      );
    }

    return cachedDbEntry.db;
  } else {
    if (!dbVersion) {
      throw new Error(
        `No db version specified. If you want to use auto versioning, than you have to setup db migration first`
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
