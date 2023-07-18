import { StoreHistory } from '../lib/store-history';

describe('StoreHistory', () => {
  let storeHistory: StoreHistory<string>;

  beforeEach(() => {
    storeHistory = new StoreHistory<string>();
  });

  describe('add', () => {
    it('should add a new history item with the provided state and command', () => {
      const initialState = 'Initial state';
      const command = 'Command 1';

      storeHistory.add(initialState, command);

      expect(storeHistory.entries).toEqual([{ command, before: initialState }]);
    });
  });

  describe('undo', () => {
    it('should return the previous state from the history and add an undo command', () => {
      const initialState = 'Initial state';
      const command1 = 'Command 1';
      const prevState = 'Prev state';
      const command2 = 'Command 2';
      const currentState = 'currentState';

      storeHistory.add(initialState, command1);
      storeHistory.add(prevState, command2);

      const result = storeHistory.undo(currentState);

      expect(result).toBe(prevState);
      expect(storeHistory.entries).toEqual([
        { command: command1, before: initialState },
        { command: command2, before: prevState },
        { command: '_UNDO_', before: currentState },
      ]);
    });

    it('should return undefined if no undo action is available', () => {
      const initialState = 'Initial state';

      const result = storeHistory.undo(initialState);

      expect(result).toBeUndefined();
      expect(storeHistory.entries).toEqual([]);
    });
  });

  describe('redo', () => {
    it('should return the state before the last undo action from the history and add a redo command', () => {
      const initialState = 'Initial state';
      const command1 = 'Command 1';
      const prevState = 'Prev state';
      const command2 = 'Command 2';
      const currentState = 'currentState';

      storeHistory.add(initialState, command1);
      storeHistory.add(prevState, command2);
      storeHistory.undo(currentState);

      const result = storeHistory.redo(prevState);

      expect(result).toBe(currentState);
      expect(storeHistory.entries).toEqual([
        { command: command1, before: initialState },
        { command: command2, before: prevState },
        { command: '_UNDO_', before: currentState },
        { command: '_REDO_', before: prevState },
      ]);
    });

    it('should return undefined if no redo action is available', () => {
      const initialState = 'Initial state';

      const result = storeHistory.redo(initialState);

      expect(result).toBeUndefined();
      expect(storeHistory.entries).toEqual([]);
    });

    it('should return undefined if no undo action was dispatched priorly', () => {
      const initialState = 'Initial state';
      const command = 'Command 1';
      const currentState = 'Current state';

      storeHistory.add(initialState, command);

      const result = storeHistory.redo(currentState);

      expect(result).toBe(undefined);
      expect(storeHistory.entries).toEqual([{ command, before: initialState }]);
    });
  });
});
