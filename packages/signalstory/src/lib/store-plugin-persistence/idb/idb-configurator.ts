/* eslint-disable @typescript-eslint/no-explicit-any */
import { Immutable } from '../../store-immutability/immutable-type';
import { IndexedDbAdapter } from './idb-adapter';

type DbUpdateOperation =
  | ((oldVersion: number, oldState: unknown) => unknown)
  | 'CLEAR'
  | 'DELETE'
  | undefined;

export class IndexedDbStoreRegistrator {
  private readonly _registrations: [string, DbUpdateOperation][] = [];

  addStore(objectStoreName: string) {
    this._registrations.push([objectStoreName, undefined]);
  }

  addStoreWithCleanState(objectStoreName: string) {
    this._registrations.push([objectStoreName, 'CLEAR']);
  }

  addStoreWithTransformation(
    objectStoreName: string,
    transformation: (oldVersion: number, oldState: any) => any
  ) {
    this._registrations.push([objectStoreName, transformation]);
    return this;
  }

  removeStore(objectStoreName: string) {
    this._registrations.push([objectStoreName, 'DELETE']);
  }

  get registrations(): Immutable<[string, DbUpdateOperation][]> {
    return this.registrations;
  }
}

export function configureIndexDb(
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
    throw new Error('configureIndexDb: Please register at least one Store');
  }
  const adapter = new IndexedDbAdapter(dbName, dbVersion, undefined, {
    onUpgradeNeeded: event => {
      const target = event.target as IDBRequest;
      const db = target.result;
      const transaction = target.transaction!;
      const oldVersion = event.oldVersion;
      registrations.forEach(x => {
        if (!db.objectStoreNames.contains(x[0])) {
          db.createObjectStore(x[0]);
        } else if (x[1] === 'DELETE') {
          db.deleteObjectStore();
        } else if (x[1]) {
          const objectStore = transaction.objectStore(x[0]);
          const currentValueRequest = objectStore.get(1);
          currentValueRequest.onsuccess = (event: any) => {
            if (x[1] === 'CLEAR') {
              objectStore.clear();
            } else if (typeof x[1] === 'function') {
              const existingData = event.target.result;
              const newData = x[1](oldVersion, existingData);
              objectStore.put(newData, 1);
            }
          };
        }
      });
    },
  });
  adapter.initAsync(registrations[0][0]);
}
