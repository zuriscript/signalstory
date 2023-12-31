import { migrateIndexedDb } from 'signalstory';

export const idbMigration = () => {
  migrateIndexedDb('NewDB2', 10, model =>
    model
      .createStoreOrTransform('Store1', (oldVersion, state) => {
        return { oldVersion, state };
      })
      .createStoreOrTransform('Store2', (oldVersion, state) => {
        return { buz: 'sdfadjalksdjalskdj', oldVersion, state };
      })
      .createStore('BookStore')
      .dropStore('TemporaryStore')
  );
};
