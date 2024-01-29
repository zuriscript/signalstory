/* eslint-disable @typescript-eslint/no-explicit-any */
import { HistoryTracker, trackHistory } from '../lib/store-history';
import { ImmutableStore } from '../lib/store-immutability/immutable-store';

describe('addToHistory', () => {
  let initialState: { value: number };
  let store: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    initialState = { value: 10 };
    store = new ImmutableStore<{ value: number }>({
      initialState,
    });
  });

  it('should add an item to history if history is enabled without cloning', () => {
    // arrange
    const commandName = 'Command';
    const tracker = trackHistory(10, store);

    // act
    store.set({ value: 20 }, commandName);

    // assert
    expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
      commandName,
    ]);
  });

  it('should not add an item to history if store is not tracked', () => {
    // arrange
    const store2 = new ImmutableStore<{ value: number }>({
      initialState,
    });
    const tracker = trackHistory(10, store);

    // act
    store2.set({ value: 20 }, 'dummy');

    // act & assert
    expect(tracker.getHistory().map(x => x.command)).toHaveLength(0);
  });

  it('should not add undo or redo commands to history', () => {
    // arrange
    const tracker = trackHistory(10, store);

    // act
    store.set({ value: 20 }, '_UNDO_');
    store.set({ value: 30 }, '_REDO_');

    // assert
    expect(tracker.getHistory().map(x => x.command)).toHaveLength(0);
  });

  it('should prune if maxLength is exceeded', () => {
    // arrange
    jest.useFakeTimers();
    const numberOfCommands = 20;
    const maxLength = 5;
    const tracker = trackHistory(maxLength, store);

    // act & assert
    for (let i = 0; i < numberOfCommands; i++) {
      store.set({ value: i }, i.toString());
      jest.runAllTimers();

      const history = tracker.getHistory().map(x => x.command);
      if (i < maxLength) {
        expect(history).toHaveLength(i + 1);
      } else {
        expect(history.length).toBeGreaterThanOrEqual(maxLength);
        expect(history.length).toBeLessThanOrEqual(maxLength * 1.25);
      }
    }

    jest.useRealTimers();
  });

  it('should adjust redoneCommandIndex and undoneCommandIndex after pruning', () => {
    // arrange
    jest.useFakeTimers();
    const tracker = trackHistory(3, store);

    // act
    store.set({ value: 10 }, 'Command1');
    store.set({ value: 20 }, 'Command2');
    tracker.undo();
    tracker.redo();
    store.set({ value: 30 }, 'Command3');
    jest.runAllTimers();

    // assert
    expect((tracker as any)['_history']).toStrictEqual([
      {
        command: '_UNDO_',
        before: { value: 20 },
        store: expect.any(WeakRef),
        undoneCommandIndex: -1,
      },
      {
        command: '_REDO_',
        before: { value: 10 },
        store: expect.any(WeakRef),
        redoneCommandIndex: 0,
      },
      {
        command: 'Command3',
        before: { value: 20 },
        store: expect.any(WeakRef),
      },
    ]);
    jest.useRealTimers();
  });
});

describe('transaction', () => {
  let store1: ImmutableStore<{ value: number }>;
  let store2: ImmutableStore<{ value: number }>;
  let store3: ImmutableStore<{ value: number }>;
  const initialState = { value: 10 };

  beforeEach(() => {
    store1 = new ImmutableStore<{ value: number }>({
      initialState,
    });
    store2 = new ImmutableStore<{ value: number }>({
      initialState,
    });
    store3 = new ImmutableStore<{ value: number }>({
      initialState,
    });
  });

  it('should handle multiple transactions with interleaved commands', () => {
    // arrange
    const tracker = trackHistory(10, store1, store2, store3);
    const store1NewValue = { value: 80 };
    const store2NewValue = { value: 90 };
    const store3NewValue = { value: 100 };
    const tag1 = 'TRANSACTION_1';
    const tag2 = 'TRANSACTION_2';

    // act
    tracker.beginTransaction(tag1);
    store1.set(store1NewValue, 'Command1');
    tracker.endTransaction();
    tracker.beginTransaction(tag2);
    store2.set(store2NewValue, 'Command2');
    tracker.endTransaction();
    tracker.beginTransaction(tag1);
    store3.set(store3NewValue, 'Command3');
    tracker.endTransaction();

    // assert
    expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
      tag1,
      tag2,
      tag1,
    ]);
  });

  it('should handle nested transactions', () => {
    // arrange
    const tracker = trackHistory(10, store1, store2, store3);
    const store1NewValue = { value: 50 };
    const store2NewValue = { value: 60 };
    const store3NewValue = { value: 70 };
    const tag1 = 'TRANSACTION_1';
    const tag2 = 'TRANSACTION_2';

    // act
    tracker.beginTransaction(tag1);
    store1.set(store1NewValue, 'Command1');
    store2.set(store2NewValue, 'Command2');
    tracker.beginTransaction(tag2);
    store3.set(store3NewValue, 'Command3');
    tracker.endTransaction();
    tracker.endTransaction();

    // assert
    expect(tracker.getHistory().map(x => x.command)).toStrictEqual([tag1]);
  });

  it('should cluster until last nested transaction ends', () => {
    // arrange
    const tracker = trackHistory(10, store1, store2, store3);
    const store1NewValue = { value: 50 };
    const store2NewValue = { value: 60 };
    const store3NewValue = { value: 70 };
    const tag1 = 'TRANSACTION_1';
    const tag2 = 'TRANSACTION_2';

    // act
    tracker.beginTransaction(tag1);
    store1.set(store1NewValue, 'Command1');
    tracker.beginTransaction(tag2);
    store2.set(store2NewValue, 'Command2');
    tracker.endTransaction();
    store3.set(store3NewValue, 'Command3');
    tracker.endTransaction();
    store1.set(store1NewValue, 'Command4');

    // assert
    expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
      tag1,
      'Command4',
    ]);
  });
});

describe('undo', () => {
  describe('without transaction', () => {
    let store: ImmutableStore<{ value: number }>;
    const initialState = { value: 10 };

    beforeEach(() => {
      store = new ImmutableStore<{ value: number }>({
        initialState,
      });
    });

    it('should do nothing if there are no commands in history', () => {
      // arrange
      const tracker = trackHistory(10, store);

      // act
      tracker.undo();

      // assert
      expect(store.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toHaveLength(0);
    });

    it('should undo the last command and revert to inital state', () => {
      // arrange
      const tracker = trackHistory(10, store);
      const command = 'Command';
      const newState = { value: 22 };
      store.set(newState, command);

      // act
      tracker.undo();

      // assert
      expect(store.state()).toStrictEqual(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        command,
        '_UNDO_',
      ]);
    });
    it('should undo the last command', () => {
      // arrange
      const tracker = trackHistory(10, store);
      const command1 = 'Command1';
      const command2 = 'Command2';
      const newState1 = { value: 22 };
      const newState2 = { value: 33 };
      store.set(newState1, command1);
      store.set(newState2, command2);

      // act
      tracker.undo();

      // assert
      expect(store.state()).toStrictEqual(newState1);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        command1,
        command2,
        '_UNDO_',
      ]);
    });

    it('should undo the last two commands when called twice', () => {
      // arrange
      const tracker = trackHistory(10, store);
      const command1 = 'Command1';
      const command2 = 'Command2';
      const newState1 = { value: 22 };
      const newState2 = { value: 33 };
      store.set(newState1, command1);
      store.set(newState2, command2);

      // act
      tracker.undo();
      tracker.undo();

      // assert
      expect(store.state()).toStrictEqual(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        command1,
        command2,
        '_UNDO_',
        '_UNDO_',
      ]);
    });
  });

  describe('with transaction', () => {
    let store1: ImmutableStore<{ value: number }>;
    let store2: ImmutableStore<{ value: number }>;
    let store3: ImmutableStore<{ value: number }>;
    const initialState = { value: 10 };

    beforeEach(() => {
      store1 = new ImmutableStore<{ value: number }>({
        initialState,
      });
      store2 = new ImmutableStore<{ value: number }>({
        initialState,
      });
      store3 = new ImmutableStore<{ value: number }>({
        initialState,
      });
    });

    it('should do nothing if there are no commands in history', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);

      // act
      tracker.beginTransaction();
      tracker.undo();
      tracker.endTransaction();

      // assert
      expect(store1.state()).toBe(initialState);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory()).toHaveLength(0);
    });

    it('should rollback if transaction still active', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);

      // act
      tracker.beginTransaction();
      store1.set({ value: 45 }, 'Command');
      store2.set({ value: 45 }, 'Command');
      tracker.undo();

      // assert
      expect(store1.state()).toBe(initialState);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory()).toHaveLength(0);
    });

    it('should undo the last transaction and revert to inital state', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2);
      const store3NewValue = { value: 392 };
      const tag = 'TRANSACTION';

      // act
      tracker.beginTransaction(tag);
      store1.set({ value: 45 }, 'Command1');
      store2.set({ value: 45 }, 'Command2');
      store3.set(store3NewValue, 'Command3');
      tracker.endTransaction();
      tracker.undo();

      // assert
      expect(store1.state()).toBe(initialState);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(store3NewValue);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag,
        '_UNDO_',
      ]);
    });

    it('should handle UNDO after multiple transactions with interleaved commands', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);
      const store1NewValue1 = { value: 80 };
      const store2NewValue1 = { value: 90 };
      const store3NewValue1 = { value: 100 };
      const tag1 = 'TRANSACTION_1';
      const tag2 = 'TRANSACTION_2';

      // act
      tracker.beginTransaction(tag1);
      store1.set(store1NewValue1, 'Command1');
      tracker.endTransaction();
      tracker.beginTransaction(tag2);
      store2.set(store2NewValue1, 'Command2');
      tracker.endTransaction();
      tracker.beginTransaction(tag1);
      store3.set(store3NewValue1, 'Command3');
      tracker.endTransaction();
      tracker.undo();
      tracker.undo();

      // assert
      expect(store1.state()).toBe(store1NewValue1);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag1,
        tag2,
        tag1,
        '_UNDO_',
        '_UNDO_',
      ]);
    });

    it('should handle UNDO after nested transactions', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);
      const store1NewValue = { value: 150 };
      const store2NewValue = { value: 160 };
      const store3NewValue = { value: 170 };
      const tag1 = 'TRANSACTION_1';
      const tag2 = 'TRANSACTION_2';

      // act
      tracker.beginTransaction(tag1);
      store1.set(store1NewValue, 'Command1');
      tracker.beginTransaction(tag2);
      store2.set(store2NewValue, 'Command2');
      tracker.endTransaction(); // End tag2, still inside tag1
      store3.set(store3NewValue, 'Command3');
      tracker.endTransaction(); // End tag1

      tracker.undo(); // Undo last command in tag1

      // assert
      expect(store1.state()).toBe(initialState);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag1,
        '_UNDO_',
      ]);
    });
  });
});

describe('canUndo', () => {
  let tracker: HistoryTracker;
  let store: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    const initialState = { value: 10 };
    store = new ImmutableStore({ initialState });
    tracker = trackHistory(10, store);
  });

  it('should initially be false when no commands have been executed', () => {
    // assert
    expect(tracker.canUndo()).toBe(false);
  });

  it('should be true after executing a command', () => {
    // arrange
    store.set({ value: 20 }, 'Command');

    // assert
    expect(tracker.canUndo()).toBe(true);
  });

  it('should be false after executing a command and undoing it', () => {
    // arrange
    store.set({ value: 20 }, 'Command');

    // act
    tracker.undo();

    // assert
    expect(tracker.canUndo()).toBe(false);
  });

  it('should be true after undoing a command and then redoing it', () => {
    // arrange
    store.set({ value: 20 }, 'Command');
    tracker.undo();

    // act
    tracker.redo();

    // assert
    expect(tracker.canUndo()).toBe(true);
  });

  it('should be true after undoing multiple commands and redoing one of them', () => {
    // arrange
    store.set({ value: 20 }, 'Command1');
    store.set({ value: 30 }, 'Command2');
    tracker.undo();
    tracker.undo();

    // act
    tracker.redo();

    // assert
    expect(tracker.canUndo()).toBe(true);
  });

  it('should be true during transaction', () => {
    // act
    tracker.beginTransaction();

    // assert
    expect(tracker.canUndo()).toBe(true);
  });

  it('should be true after executing a command within a transaction', () => {
    // arrange
    tracker.beginTransaction();
    store.set({ value: 20 }, 'Command');
    tracker.endTransaction();

    // assert
    expect(tracker.canUndo()).toBe(true);
  });

  it('should be false after undoing a command within a transaction', () => {
    // arrange
    tracker.beginTransaction();
    store.set({ value: 20 }, 'Command');

    // act
    tracker.undo();

    // assert
    expect(tracker.canUndo()).toBe(false);
  });

  it('should be true after undoing a command within a transaction if there were commands before transaction', () => {
    // arrange
    store.set({ value: 20 }, 'Command1');
    tracker.beginTransaction();
    store.set({ value: 20 }, 'Command2');

    // act
    tracker.undo();

    // assert
    expect(tracker.canUndo()).toBe(true);
  });
});

describe('redo', () => {
  describe('without transaction', () => {
    let store: ImmutableStore<{ value: number }>;
    const initialState = { value: 10 };

    beforeEach(() => {
      store = new ImmutableStore<{ value: number }>({
        initialState,
      });
    });

    it('should do nothing if there are no commands in history', () => {
      // arrange
      const tracker = trackHistory(10, store);

      // act
      tracker.redo();

      // assert
      expect(store.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toHaveLength(0);
    });

    it('should do nothing if the last command is not an undo', () => {
      // arrange
      const tracker = trackHistory(10, store);
      store.set({ value: 10 }, 'Command1');
      tracker.undo();
      store.set(initialState, 'Command2');

      // act
      tracker.redo();

      // assert
      expect(store.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        'Command1',
        '_UNDO_',
        'Command2',
      ]);
    });

    it('should redo the last undone command', () => {
      // arrange
      const tracker = trackHistory(10, store);
      const command = 'Command';
      const newState = { value: 22 };
      store.set(newState, command);
      tracker.undo();

      // act
      tracker.redo();

      // assert
      expect(store.state()).toStrictEqual(newState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        command,
        '_UNDO_',
        '_REDO_',
      ]);
    });

    it('should redo the last two undone commands when called twice', () => {
      // arrange
      const tracker = trackHistory(10, store);
      const command1 = 'Command1';
      const command2 = 'Command2';
      const newState1 = { value: 22 };
      const newState2 = { value: 33 };
      store.set(newState1, command1);
      store.set(newState2, command2);
      tracker.undo();
      tracker.undo();

      // act
      tracker.redo();
      tracker.redo();

      // assert
      expect(store.state()).toStrictEqual(newState2);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        command1,
        command2,
        '_UNDO_',
        '_UNDO_',
        '_REDO_',
        '_REDO_',
      ]);
    });
  });

  describe('with transaction', () => {
    let store1: ImmutableStore<{ value: number }>;
    let store2: ImmutableStore<{ value: number }>;
    let store3: ImmutableStore<{ value: number }>;
    const initialState = { value: 10 };

    beforeEach(() => {
      store1 = new ImmutableStore<{ value: number }>({
        initialState,
      });
      store2 = new ImmutableStore<{ value: number }>({
        initialState,
      });
      store3 = new ImmutableStore<{ value: number }>({
        initialState,
      });
    });

    it('should do nothing if there are no undone commands in history', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);

      // act
      tracker.redo();

      // assert
      expect(store1.state()).toBe(initialState);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory()).toHaveLength(0);
    });

    it('should do nothing if redo is called without an undone command', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);
      const command = 'Command';
      const tag = 'Transaction';
      const newValue = { value: 45 };

      tracker.beginTransaction(tag);
      store1.set(newValue, command);
      tracker.endTransaction();

      // act
      tracker.redo();

      // assert
      expect(store1.state()).toBe(newValue);
      expect(store2.state()).toBe(initialState);
      expect(store3.state()).toBe(initialState);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([tag]);
    });

    it('should redo the last undone transaction', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2);
      const newValue = { value: 392 };
      const tag = 'TRANSACTION';

      // act
      tracker.beginTransaction(tag);
      store1.set(newValue, 'Command1');
      store2.set(newValue, 'Command2');
      store3.set(newValue, 'Command3');
      tracker.endTransaction();
      tracker.undo();
      tracker.redo();

      // assert
      expect(store1.state()).toBe(newValue);
      expect(store2.state()).toBe(newValue);
      expect(store3.state()).toBe(newValue);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag,
        '_UNDO_',
        '_REDO_',
      ]);
    });

    it('should handle REDO after multiple transactions with interleaved commands', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);
      const store1NewValue1 = { value: 80 };
      const store2NewValue1 = { value: 90 };
      const store3NewValue1 = { value: 100 };
      const tag1 = 'TRANSACTION_1';
      const tag2 = 'TRANSACTION_2';

      // act
      tracker.beginTransaction(tag1);
      store1.set(store1NewValue1, 'Command1');
      tracker.endTransaction();
      tracker.beginTransaction(tag2);
      store2.set(store2NewValue1, 'Command2');
      tracker.endTransaction();
      tracker.beginTransaction(tag1);
      store3.set(store3NewValue1, 'Command3');
      tracker.endTransaction();
      tracker.undo();
      tracker.undo();
      tracker.redo();
      tracker.redo();

      // assert
      expect(store1.state()).toBe(store1NewValue1);
      expect(store2.state()).toBe(store2NewValue1);
      expect(store3.state()).toBe(store3NewValue1);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag1,
        tag2,
        tag1,
        '_UNDO_',
        '_UNDO_',
        '_REDO_',
        '_REDO_',
      ]);
    });

    it('should handle REDO after nested transactions', () => {
      // arrange
      const tracker = trackHistory(10, store1, store2, store3);
      const store1NewValue = { value: 150 };
      const store2NewValue = { value: 160 };
      const store3NewValue = { value: 170 };
      const tag1 = 'TRANSACTION_1';
      const tag2 = 'TRANSACTION_2';

      // act
      tracker.beginTransaction(tag1);
      store1.set(store1NewValue, 'Command1');
      tracker.beginTransaction(tag2);
      store2.set(store2NewValue, 'Command2');
      tracker.endTransaction(); // End tag2, still inside tag1
      store3.set(store3NewValue, 'Command3');
      tracker.endTransaction(); // End tag1

      tracker.undo();
      tracker.redo();

      // assert
      expect(store1.state()).toBe(store1NewValue);
      expect(store2.state()).toBe(store2NewValue);
      expect(store3.state()).toBe(store3NewValue);
      expect(tracker.getHistory().map(x => x.command)).toStrictEqual([
        tag1,
        '_UNDO_',
        '_REDO_',
      ]);
    });
  });
});

describe('canRedo', () => {
  let tracker: HistoryTracker;
  let store: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    const initialState = { value: 10 };
    store = new ImmutableStore({ initialState });
    tracker = trackHistory(10, store);
  });

  it('should initially be false when no commands have been executed', () => {
    // assert
    expect(tracker.canRedo()).toBe(false);
  });

  it('should be true after executing a command and undoing it', () => {
    // arrange
    store.set({ value: 20 }, 'Command');

    // act
    tracker.undo();

    // assert
    expect(tracker.canRedo()).toBe(true);
  });

  it('should be false after undoing a command and then redoing it', () => {
    // arrange
    store.set({ value: 20 }, 'Command');
    tracker.undo();

    // act
    tracker.redo();

    // assert
    expect(tracker.canRedo()).toBe(false);
  });

  it('should be false after a new command is executed', () => {
    // arrange
    store.set({ value: 20 }, 'Command');
    tracker.undo();
    tracker.redo();

    // act
    store.set({ value: 30 }, 'NewCommand');

    // assert
    expect(tracker.canRedo()).toBe(false);
  });

  it('should be true after undoing multiple commands and redoing one of them', () => {
    // arrange
    store.set({ value: 20 }, 'Command1');
    store.set({ value: 30 }, 'Command2');
    tracker.undo();
    tracker.undo();

    // act
    tracker.redo();

    // assert
    expect(tracker.canRedo()).toBe(true);
  });

  it('should be false after undoing multiple commands and redoing all of them', () => {
    // arrange
    store.set({ value: 20 }, 'Command1');
    store.set({ value: 30 }, 'Command2');
    tracker.undo();
    tracker.undo();

    // act
    tracker.redo();
    tracker.redo();

    // assert
    expect(tracker.canRedo()).toBe(false);
  });

  it('should be false after undoing multiple commands, executing a new command, and redoing the last undone command', () => {
    // arrange
    store.set({ value: 20 }, 'Command1');
    store.set({ value: 30 }, 'Command2');
    tracker.undo();
    tracker.undo();

    // act
    store.set({ value: 40 }, 'NewCommand');
    tracker.redo();

    // assert
    expect(tracker.canRedo()).toBe(false);
  });

  it('should be false during transaction', () => {
    // arrange
    store.set({ value: 20 }, 'Command');
    tracker.undo();

    // act
    tracker.beginTransaction();

    // assert
    expect(tracker.canRedo()).toBe(false);
  });
});

describe('destroy', () => {
  let tracker: HistoryTracker;
  let store1: ImmutableStore<{ value: number }>;
  let store2: ImmutableStore<{ value: number }>;
  let store3: ImmutableStore<{ value: number }>;

  beforeEach(() => {
    const initialState = { value: 10 };
    store1 = new ImmutableStore({ initialState });
    store2 = new ImmutableStore({ initialState });
    store3 = new ImmutableStore({ initialState });
    tracker = trackHistory(10, store1, store2, store3);
  });

  it('should remove the tracker reference from the commandPreprocessor of all tracked stores', () => {
    // arrange
    const trackerRef = (tracker as any)['addToHistoryRef'];
    expect(store1['commandPreprocessor']).toContain(trackerRef); // sanity check
    expect(store2['commandPreprocessor']).toContain(trackerRef); // sanity check
    expect(store3['commandPreprocessor']).toContain(trackerRef); // sanity check

    // act
    tracker.destroy();

    // assert
    expect(store1['commandPreprocessor']).not.toContain(trackerRef);
    expect(store2['commandPreprocessor']).not.toContain(trackerRef);
    expect(store3['commandPreprocessor']).not.toContain(trackerRef);
  });

  it('should not affect other stores that are not tracked', () => {
    // arrange
    const otherStore = new ImmutableStore({ initialState: { value: 10 } });
    const otherTracker = trackHistory(10, otherStore);
    const otherTrackerRef = (otherTracker as any)['addToHistoryRef'];

    // act
    tracker.destroy();

    // assert
    expect(otherStore['commandPreprocessor']).toContain(otherTrackerRef);
  });

  it('should not throw an error if destroy is called multiple times', () => {
    // act & assert
    expect(() => {
      tracker.destroy();
      tracker.destroy();
    }).not.toThrow();
  });
});

describe('getHistory', () => {
  let tracker: HistoryTracker;
  let store1: ImmutableStore<{ value: number }>;
  let store2: ImmutableStore<{ data: string }>;
  const initialState1 = { value: 10 };
  const initialState2 = { data: 'initial' };

  beforeEach(() => {
    store1 = new ImmutableStore({ initialState: initialState1 });
    store2 = new ImmutableStore({ initialState: initialState2 });

    tracker = trackHistory(10, store1, store2);
  });

  it('should return an empty array when no commands have been executed', () => {
    // assert
    expect(tracker.getHistory()).toEqual([]);
  });

  it('should correctly map the history with one store', () => {
    // arrange
    store1.set({ value: 20 }, 'Command1');

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: 'Command1',
        before: [[store1, initialState1]],
      },
    ]);
  });

  it('should correctly map the history using undo', () => {
    // arrange
    const newValue = { value: 20 };
    store1.set(newValue, 'Command1');
    tracker.undo();

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: 'Command1',
        before: [[store1, initialState1]],
      },
      {
        command: '_UNDO_',
        before: [[store1, newValue]],
      },
    ]);
  });

  it('should correctly map the history using undo and redo', () => {
    // arrange
    const newValue = { value: 20 };
    store1.set(newValue, 'Command1');
    tracker.undo();
    tracker.redo();

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: 'Command1',
        before: [[store1, initialState1]],
      },
      {
        command: '_UNDO_',
        before: [[store1, newValue]],
      },
      {
        command: '_REDO_',
        before: [[store1, initialState1]],
      },
    ]);
  });

  it('should correctly map the history with multiple stores', () => {
    // arrange
    store1.set({ value: 20 }, 'Command1');
    store2.set({ data: 'modified' }, 'Command2');

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: 'Command1',
        before: [[store1, initialState1]],
      },
      {
        command: 'Command2',
        before: [[store2, initialState2]],
      },
    ]);
  });

  it('should correctly map the history with multiple stores and transaction', () => {
    // arrange
    const tag = 'Transaction';
    tracker.beginTransaction(tag);
    store1.set({ value: 20 }, 'Command1');
    store2.set({ data: 'modified' }, 'Command2');
    tracker.endTransaction();

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: tag,
        before: [
          [store2, initialState2],
          [store1, initialState1],
        ],
      },
    ]);
  });

  it('should correctly map the history with multiple stores and transaction and undo/redo', () => {
    // arrange
    const tag = 'Transaction';
    const newValue1 = { value: 20 };
    const newValue2 = { data: 'modified' };
    tracker.beginTransaction(tag);
    store1.set(newValue1, 'Command1');
    store2.set(newValue2, 'Command2');
    tracker.endTransaction();
    tracker.undo();
    tracker.redo();

    // assert
    expect(tracker.getHistory()).toEqual([
      {
        command: tag,
        before: [
          [store2, initialState2],
          [store1, initialState1],
        ],
      },
      {
        command: '_UNDO_',
        before: [
          [store2, newValue2],
          [store1, newValue1],
        ],
      },
      {
        command: '_REDO_',
        before: [
          [store2, initialState2],
          [store1, initialState1],
        ],
      },
    ]);
  });
});

describe('Functional tests', () => {
  let store1: ImmutableStore<{ value: number }>;
  let store2: ImmutableStore<{ value: number }>;
  let tracker: HistoryTracker;
  const initialState = { value: 0 };

  beforeEach(() => {
    store1 = new ImmutableStore<{ value: number }>({
      initialState,
    });
    store2 = new ImmutableStore<{ value: number }>({
      initialState,
    });
    tracker = trackHistory(30, store1, store2);
  });

  const expectValues = (store1Value: number, store2Value: number) => {
    expect(store1.state()).toStrictEqual({ value: store1Value });
    expect(store2.state()).toStrictEqual({ value: store2Value });
  };

  it('should handle even more complex undo-redo scenario with interleaving and transactions', () => {
    tracker.beginTransaction('Initial Transaction');
    store1.set({ value: 10 }, 'Command1');
    store2.set({ value: 20 }, 'Command2');
    tracker.endTransaction();
    tracker.undo();
    expectValues(0, 0);

    tracker.beginTransaction('Nested Transaction');
    store1.set({ value: 15 }, 'Command3');
    store2.set({ value: 25 }, 'Command4');
    tracker.undo();
    expectValues(0, 0);

    const newValueStore1 = { value: 5 };
    store1.set(newValueStore1, 'Command5');
    tracker.beginTransaction('Transaction1');
    store1.set({ value: 10 }, 'Command6');
    store2.set({ value: 20 }, 'Command7');
    tracker.endTransaction();

    store1.set({ value: 30 }, 'Command8');
    store2.set({ value: 40 }, 'Command9');
    expectValues(30, 40);

    tracker.undo();
    expectValues(30, 20);

    tracker.undo();
    expectValues(10, 20);

    tracker.redo();
    expectValues(30, 20);

    tracker.undo();
    expectValues(10, 20);

    tracker.redo();
    expectValues(30, 20);

    tracker.undo();
    expectValues(10, 20);

    tracker.undo();
    expectValues(5, 0);

    tracker.beginTransaction('Transaction2');
    store1.set({ value: 15 }, 'Command10');
    store2.set({ value: 25 }, 'Command11');
    tracker.endTransaction();

    tracker.redo();
    expectValues(15, 25);

    tracker.undo();
    expectValues(5, 0);

    store1.set({ value: 15 }, 'Command10');
    store2.set({ value: 25 }, 'Command11');

    tracker.undo();
    tracker.undo();
    tracker.redo();
    tracker.redo();
    tracker.undo();
    tracker.redo();
    tracker.undo();
    tracker.redo();
    expectValues(15, 25);
  });
});
