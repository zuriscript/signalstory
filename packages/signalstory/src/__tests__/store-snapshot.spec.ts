/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../lib/store';
import { clearRegistry, forEachStoreInScope } from '../lib/store-registry';
import { StateSnapshot, createSnapshot } from '../lib/store-snapshot';

class DummyStore1 extends Store<number> {
  constructor(initialState = 0) {
    super({ initialState });
  }
}

class DummyStore2 extends Store<number> {
  constructor(initialState = 0) {
    super({ initialState });
  }
}

function getStoresFromSnapshot(snapshot: StateSnapshot) {
  const stores: Store<unknown>[] = [];
  const storesCapturedBySnapshot = (snapshot as any)[
    'storesWithState'
  ] as WeakMap<Store<unknown>, unknown>;

  forEachStoreInScope(store => {
    if (storesCapturedBySnapshot.has(store)) {
      stores.push(store);
    }
  });

  return stores;
}

describe('createSnapshot', () => {
  beforeEach(() => {
    clearRegistry();
  });

  it('should create a correctly timestamped snapshot without any registered stores if no stores in scope', () => {
    // arrange & act
    const snapshot = createSnapshot();

    // assert
    expect(snapshot.timestamp).toBeGreaterThan(0);
    expect(getStoresFromSnapshot(snapshot)).toHaveLength(0);
  });

  it('Should create a snapshot with the correctly captured stores', () => {
    // arrange
    const storeDummy1 = new DummyStore1();
    const storeDummy2 = new DummyStore2();
    const store1 = new Store<string>({ initialState: '' });
    const store2 = new Store<string>({ initialState: '' });

    // act
    const snapshotNone = createSnapshot();
    const snapshotDummy1 = createSnapshot(DummyStore1);
    const snapshotStore1 = createSnapshot(store1);
    const snapshotDummy1And2 = createSnapshot(DummyStore1, DummyStore2);
    const snapshotDummy1AndStore1 = createSnapshot(DummyStore1, store1);
    const snapshotAll = createSnapshot(
      storeDummy1,
      storeDummy2,
      store1,
      store2
    );

    // assert
    expect(getStoresFromSnapshot(snapshotNone)).toStrictEqual([
      storeDummy1,
      storeDummy2,
      store1,
      store2,
    ]);
    expect(getStoresFromSnapshot(snapshotDummy1)).toStrictEqual([storeDummy1]);
    expect(getStoresFromSnapshot(snapshotStore1)).toStrictEqual([store1]);
    expect(getStoresFromSnapshot(snapshotDummy1And2)).toStrictEqual([
      storeDummy1,
      storeDummy2,
    ]);
    expect(getStoresFromSnapshot(snapshotDummy1AndStore1)).toStrictEqual([
      storeDummy1,
      store1,
    ]);
    expect(getStoresFromSnapshot(snapshotAll)).toStrictEqual([
      storeDummy1,
      storeDummy2,
      store1,
      store2,
    ]);
  });
});

describe('snapshot.restore', () => {
  beforeEach(() => {
    clearRegistry();
  });

  it('Should not throw if no stores in scope', () => {
    // arrange
    const snapshot = createSnapshot();

    // act
    const act = () => snapshot.restore();

    // assert
    expect(act).not.toThrow();
  });

  it('should restore only the captured store and not all stores in scope', () => {
    // arrange
    const initialState = 10;
    const store1 = new Store<number>({ initialState });
    const store2 = new DummyStore1(initialState);

    const snapshot = createSnapshot(store1);

    const newState = 45;
    store1.set(newState);
    store2.set(newState);

    // act
    snapshot.restore();

    // assert
    expect(store1.state()).toBe(initialState);
    expect(store2.state()).toBe(newState);
  });

  it('should restore only the captured stores and not all stores in scope', () => {
    // arrange
    const initialState = 10;
    const store1 = new Store<number>({ initialState });
    const store2 = new Store<number>({ initialState });
    const store3 = new DummyStore1(initialState);
    const store4 = new DummyStore2(initialState);

    const snapshot = createSnapshot(store1, DummyStore1);

    const newState = 45;
    store1.set(newState);
    store2.set(newState);
    store3.set(newState);
    store4.set(newState);

    // act
    snapshot.restore();

    // assert
    expect(store1.state()).toBe(initialState);
    expect(store2.state()).toBe(newState);
    expect(store3.state()).toBe(initialState);
    expect(store4.state()).toBe(newState);
  });

  it('should restore all stores in scope if no store is specified at snapshot creation', () => {
    // arrange
    const initialState = 10;
    const store1 = new Store<number>({ initialState });
    const store2 = new DummyStore1(initialState);

    const snapshot = createSnapshot();

    const newState = 45;
    store1.set(newState);
    store2.set(newState);

    // act
    snapshot.restore();

    // assert
    expect(store1.state()).toBe(initialState);
    expect(store2.state()).toBe(initialState);
  });
});
