/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '../lib/store';
import { ImmutableStore } from '../lib/store-immutability/immutable-store';
import { useDeepFreeze } from '../lib/store-plugin-deep-freeze/plugin-deep-freeze';
import {
  RedoCommand,
  UndoCommand,
  prune,
} from '../lib/store-plugin-history/history';
import {
  addToHistory,
  getHistory,
  redo,
  registerStateHistory,
  undo,
  useStoreHistory,
} from '../lib/store-plugin-history/plugin-history';
import { useStorePersistence } from '../lib/store-plugin-persistence/plugin-persistence';
import { registerAndGetStore } from './helper';

describe('addToHistory', () => {
  describe('with mutable store', () => {
    let initialState: { value: number };
    let store: Store<{ value: number }>;

    beforeEach(() => {
      initialState = { value: 10 };
      store = new Store<{ value: number }>({
        initialState,
        plugins: [useStoreHistory()],
      });
    });

    it('should clone and add an item to history if history is enabled', () => {
      // arrange
      const commandName = 'Command';
      registerStateHistory(store);

      // act
      addToHistory(store, commandName);

      // assert
      const history = getHistory(store);
      expect(history).toStrictEqual([
        {
          command: commandName,
          before: initialState,
        },
      ]);
      expect(history[0].before).not.toBe(initialState);
    });

    it('should not add an item to history if history is disabled', () => {
      // arrange
      store = new Store<{ value: number }>({
        initialState,
      });
      const act = () => addToHistory(store, 'Command');

      // act & assert
      expect(act).toThrow();
    });

    it('should not add undo or redo commands to history', () => {
      // arrange
      registerStateHistory(store);

      // act
      addToHistory(store, UndoCommand);
      addToHistory(store, RedoCommand);

      // assert
      expect(getHistory(store)).toHaveLength(0);
    });

    it('should never prune if no maxLength is set', () => {
      // arrange
      const numberOfCommands = 1000;
      registerStateHistory(store);

      // act
      for (let i = 0; i < numberOfCommands; i++) {
        addToHistory(store, i.toString());
      }

      // assert
      expect(getHistory(store)).toHaveLength(numberOfCommands);
    });

    it('should prune if maxLength is set', () => {
      // arrange
      const numberOfCommands = 20;
      const maxLength = 5;
      registerStateHistory(store, maxLength);

      // act & assert
      for (let i = 0; i < numberOfCommands; i++) {
        addToHistory(store, i.toString());
        const history = getHistory(store);
        if (i < maxLength) {
          expect(history).toHaveLength(i + 1);
        } else {
          expect(history.length).toBeGreaterThanOrEqual(maxLength);
          expect(history.length).toBeLessThanOrEqual(maxLength * 1.25);
        }
      }
    });
  });

  describe('with immutable store', () => {
    let initialState: { value: number };
    let store: ImmutableStore<{ value: number }>;

    beforeEach(() => {
      initialState = { value: 10 };
      store = new ImmutableStore<{ value: number }>({
        initialState,
        plugins: [useStoreHistory()],
      });
    });

    it('should add an item to history if history is enabled without cloning', () => {
      // arrange
      const commandName = 'Command';
      registerStateHistory(store);

      // act
      addToHistory(store, commandName);

      // assert
      const history = getHistory(store);
      expect(history).toStrictEqual([
        {
          command: commandName,
          before: initialState,
        },
      ]);
      expect(history[0].before).toBe(initialState);
    });

    it('should not add an item to history if history is disabled', () => {
      // arrange
      store = new ImmutableStore<{ value: number }>({
        initialState,
      });

      const act = () => addToHistory(store, 'Command');

      // act & assert
      expect(act).toThrow();
    });

    it('should not add undo or redo commands to history', () => {
      // arrange
      registerStateHistory(store);

      // act
      addToHistory(store, UndoCommand);
      addToHistory(store, RedoCommand);

      // assert
      expect(getHistory(store)).toHaveLength(0);
    });

    it('should never prune if no maxLength is set', () => {
      // arrange
      const numberOfCommands = 1000;
      registerStateHistory(store);

      // act
      for (let i = 0; i < numberOfCommands; i++) {
        addToHistory(store, i.toString());
      }

      // assert
      expect(getHistory(store)).toHaveLength(numberOfCommands);
    });

    it('should prune if maxLength is set', () => {
      // arrange
      const numberOfCommands = 20;
      const maxLength = 5;
      registerStateHistory(store, maxLength);

      // act & assert
      for (let i = 0; i < numberOfCommands; i++) {
        addToHistory(store, i.toString());
        const history = getHistory(store);
        if (i < maxLength) {
          expect(history).toHaveLength(i + 1);
        } else {
          expect(history.length).toBeGreaterThanOrEqual(maxLength);
          expect(history.length).toBeLessThanOrEqual(maxLength * 1.25);
        }
      }
    });
  });
});

describe('undo', () => {
  let store: Store<{ value: number }>;
  const initialState = { value: 10 };

  beforeEach(() => {
    store = new Store<{ value: number }>({
      initialState,
      plugins: [useStoreHistory()],
    });
  });

  it('should do nothing if history is disabled', () => {
    // act
    undo(store);

    // assert
    expect(store.state()).toBe(initialState);
    expect(getHistory(store)).toHaveLength(0);
  });

  it('should do nothing if there are no commands in history', () => {
    // arrange
    registerStateHistory(store);

    // act
    undo(store);

    // assert
    expect(store.state()).toBe(initialState);
    expect(getHistory(store)).toHaveLength(0);
  });

  it('should undo the last command and revert to inital state', () => {
    // arrange
    const command = 'Command';
    const newState = { value: 22 };
    registerStateHistory(store);
    store.set(newState, command);

    // act
    undo(store);

    // assert
    expect(store.state()).toStrictEqual(initialState);
    expect(getHistory(store)).toMatchObject([
      {
        command: command,
        before: initialState,
      },
      {
        command: UndoCommand,
        before: newState,
      },
    ]);
  });
  it('should undo the last command', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = { value: 22 };
    const newState2 = { value: 33 };
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);

    // act
    undo(store);

    // assert
    expect(store.state()).toStrictEqual(newState1);
    expect(getHistory(store)).toMatchObject([
      {
        command: command1,
        before: initialState,
      },
      {
        command: command2,
        before: newState1,
      },
      {
        command: UndoCommand,
        before: newState2,
      },
    ]);
  });

  it('should undo the last two commands when called twice', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = { value: 22 };
    const newState2 = { value: 33 };
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);

    // act
    undo(store);
    undo(store);

    // assert
    expect(store.state()).toStrictEqual(initialState);
    expect(getHistory(store)).toMatchObject([
      {
        command: command1,
        before: initialState,
      },
      {
        command: command2,
        before: newState1,
      },
      {
        command: UndoCommand,
        before: newState2,
      },
      {
        command: UndoCommand,
        before: newState1,
      },
    ]);
  });
});

describe('redo', () => {
  let store: Store<{ value: number }>;
  const initialState = { value: 10 };

  beforeEach(() => {
    store = new Store<{ value: number }>({
      initialState,
      plugins: [useStoreHistory()],
    });
  });

  it('should do nothing if history is disabled', () => {
    // act
    redo(store);

    // assert
    expect(store.state()).toStrictEqual(initialState);
    expect(getHistory(store)).toHaveLength(0);
  });

  it('should do nothing if there are no commands in history', () => {
    // arrange
    registerStateHistory(store);

    // act
    redo(store);

    // assert
    expect(store.state()).toBe(initialState);
    expect(getHistory(store)).toHaveLength(0);
  });

  it('should do nothing if the last command was not an undo command', () => {
    // arrange
    registerStateHistory(store);
    const command = 'Command';
    const newState = { value: 22 };
    registerStateHistory(store);
    store.set(newState, command);

    // act
    redo(store);

    // assert
    expect(store.state()).toStrictEqual(newState);
    expect(getHistory(store)).toHaveLength(1);
  });

  it('should redo the last undone command', () => {
    // arrange
    const command = 'Command';
    const newState = { value: 22 };
    registerStateHistory(store);
    store.set(newState, command);
    undo(store);

    // act
    redo(store);

    // assert
    expect(store.state()).toStrictEqual(newState);
    expect(getHistory(store)).toMatchObject([
      {
        command: command,
        before: initialState,
      },
      {
        command: UndoCommand,
        before: newState,
      },
      {
        command: RedoCommand,
        before: initialState,
      },
    ]);
  });

  it('should redo the last undone command with multiple commands in history', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = { value: 22 };
    const newState2 = { value: 33 };
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);
    undo(store);

    // act
    redo(store);

    // assert
    expect(store.state()).toStrictEqual(newState2);
    expect(getHistory(store)).toMatchObject([
      {
        command: command1,
        before: initialState,
      },
      {
        command: command2,
        before: newState1,
      },
      {
        command: UndoCommand,
        before: newState2,
      },
      {
        command: RedoCommand,
        before: newState1,
      },
    ]);
  });

  it('should redo the last two undone commands when called twice', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = { value: 22 };
    const newState2 = { value: 33 };
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);
    undo(store);
    undo(store);

    // act
    redo(store);
    redo(store);

    // assert
    expect(store.state()).toStrictEqual(newState2);
    expect(getHistory(store)).toMatchObject([
      {
        command: command1,
        before: initialState,
      },
      {
        command: command2,
        before: newState1,
      },
      {
        command: UndoCommand,
        before: newState2,
      },
      {
        command: UndoCommand,
        before: newState1,
      },
      {
        command: RedoCommand,
        before: initialState,
      },
      {
        command: RedoCommand,
        before: newState1,
      },
    ]);
  });
});

describe('registration', () => {
  it('should come first in ordering', () => {
    // arrange
    const historyPlugin = useStoreHistory();

    // act
    const store = registerAndGetStore({
      initialState: { value: 10 },
      plugins: [useDeepFreeze(), useStorePersistence(), historyPlugin],
    });

    // assert
    expect(store['initPostprocessor']![0]).toBe(historyPlugin.init);
    expect(store['commandPreprocessor']![0]).toBe(
      historyPlugin.preprocessCommand
    );
  });
});

describe('prune', () => {
  it('should prune the history by the specified fraction', () => {
    // arrange
    const initialHistory = [
      { command: 'Command1', before: { value: 10 } },
      { command: 'Command2', before: { value: 20 } },
      { command: 'Command3', before: { value: 30 } },
    ];
    const fraction = 0.5;

    // act
    prune(initialHistory, fraction);

    // assert
    expect(initialHistory).toStrictEqual([
      { command: 'Command2', before: { value: 20 } },
      { command: 'Command3', before: { value: 30 } },
    ]);
  });

  it('should handle pruning when the history is empty', () => {
    // arrange
    const initialHistory: any[] = [];
    const fraction = 0.5;

    // act
    prune(initialHistory, fraction);

    // assert
    expect(initialHistory).toStrictEqual([]);
  });

  it('should not prune the history if the fraction is too small', () => {
    // arrange
    const initialHistory = [
      { command: 'Command1', before: { value: 10 } },
      { command: 'Command2', before: { value: 20 } },
      { command: 'Command3', before: { value: 30 } },
    ];
    const fraction = 0.1;

    // act
    prune(initialHistory, fraction);

    // assert
    expect(initialHistory).toHaveLength(3);
  });

  it('should adjust redoneCommandIndex and undoneCommandIndex after pruning', () => {
    // arrange
    const initialHistory = [
      { command: 'Command1', before: { value: 10 } },
      { command: 'Command2', before: { value: 20 }, undoneCommandIndex: 0 },
      { command: 'Command3', before: { value: 30 }, redoneCommandIndex: 1 },
      { command: 'Command4', before: { value: 55 } },
      { command: 'Command2', before: { value: 20 }, undoneCommandIndex: 3 },
    ];
    const fraction = 0.5;

    // act
    prune(initialHistory, fraction);

    // assert
    expect(initialHistory).toStrictEqual([
      { command: 'Command3', before: { value: 30 }, redoneCommandIndex: -1 },
      { command: 'Command4', before: { value: 55 } },
      { command: 'Command2', before: { value: 20 }, undoneCommandIndex: 1 },
    ]);
  });

  it('should handle pruning with negative redoneCommandIndex and undoneCommandIndex', () => {
    // arrange
    const initialHistory = [
      { command: 'Command1', before: { value: 10 }, undoneCommandIndex: -1 },
      { command: 'Command2', before: { value: 20 }, redoneCommandIndex: -2 },
      { command: 'Command3', before: { value: 30 }, redoneCommandIndex: -1 },
    ];
    const fraction = 0.5;

    // act
    prune(initialHistory, fraction);

    // assert
    expect(initialHistory).toStrictEqual([
      { command: 'Command2', before: { value: 20 }, redoneCommandIndex: -3 },
      { command: 'Command3', before: { value: 30 }, redoneCommandIndex: -2 },
    ]);
  });
});
