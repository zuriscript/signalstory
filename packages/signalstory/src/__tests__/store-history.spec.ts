import { Store } from '../lib/store';
import {
  RedoCommand,
  UndoCommand,
  addToHistory,
  getHistory,
  redo,
  registerStateHistory,
  undo,
} from '../lib/store-history';

describe('addToHistory', () => {
  it('should add an item to history if history is enabled', () => {
    // arrange
    const store = new Store<number>({ initialState: 10 });
    const commandName = 'Command';
    registerStateHistory(store);

    // act
    addToHistory(store, commandName);

    // assert
    const history = getHistory(store);
    expect(history).toStrictEqual([
      {
        command: commandName,
        before: store.state(),
      },
    ]);
  });

  it('should not add an item to history if history is disabled', () => {
    // arrange
    const store = new Store<number>({ initialState: 10 });

    // act
    addToHistory(store, 'Command');

    // assert
    expect(getHistory(store)).toHaveLength(0);
  });

  it('should not add undo or redo commands to history', () => {
    const store = new Store<number>({ initialState: 10 });
    registerStateHistory(store);

    addToHistory(store, UndoCommand);
    addToHistory(store, RedoCommand);

    expect(getHistory(store)).toHaveLength(0);
  });
});

describe('undo', () => {
  let store: Store<number>;
  const initialState = 10;

  beforeEach(() => {
    store = new Store<number>({ initialState, enableStateHistory: true });
  });

  it('should do nothing if history is disabled', () => {
    // arrange & act
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

  it('should undo the last command starting with empty history', () => {
    // arrange
    const command = 'Command';
    const newState = 22;
    registerStateHistory(store);
    store.set(newState, command);

    // act
    undo(store);

    // assert
    expect(store.state()).toBe(initialState);
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
    const newState1 = 22;
    const newState2 = 33;
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);

    // act
    undo(store);

    // assert
    expect(store.state()).toBe(newState1);
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

  it('should undo the last command starting with empty history', () => {
    // arrange
    const command = 'Command';
    const newState = 22;
    registerStateHistory(store);
    store.set(newState, command);

    // act
    undo(store);

    // assert
    expect(store.state()).toBe(initialState);
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
  it('should undo the last two commands when called twice', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = 22;
    const newState2 = 33;
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);

    // act
    undo(store);
    undo(store);

    // assert
    expect(store.state()).toBe(initialState);
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
  let store: Store<number>;
  const initialState = 10;

  beforeEach(() => {
    store = new Store<number>({ initialState, enableStateHistory: true });
  });

  it('should do nothing if history is disabled', () => {
    // arrange & act
    redo(store);

    // assert
    expect(store.state()).toBe(initialState);
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
    const newState = 22;
    registerStateHistory(store);
    store.set(newState, command);

    // act
    redo(store);

    // assert
    expect(store.state()).toBe(newState);
    expect(getHistory(store)).toHaveLength(1);
  });

  it('should redo the last undone command starting with empty history', () => {
    // arrange
    const command = 'Command';
    const newState = 22;
    registerStateHistory(store);
    store.set(newState, command);
    undo(store);

    // act
    redo(store);

    // assert
    expect(store.state()).toBe(newState);
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

  it('should redo the last undone command', () => {
    // arrange
    const command1 = 'Command1';
    const command2 = 'Command2';
    const newState1 = 22;
    const newState2 = 33;
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);
    undo(store);

    // act
    redo(store);

    // assert
    expect(store.state()).toBe(newState2);
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
    const newState1 = 22;
    const newState2 = 33;
    registerStateHistory(store);
    store.set(newState1, command1);
    store.set(newState2, command2);
    undo(store);
    undo(store);

    // act
    redo(store);
    redo(store);

    // assert
    expect(store.state()).toBe(newState2);
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
