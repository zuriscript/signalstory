import { migrateIndexedDb } from 'signalstory';

export const idbMigration = () => {
  migrateIndexedDb('Sample', 1, model => model.createStore('BookStore'));
};
