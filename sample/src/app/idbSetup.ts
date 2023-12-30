import { initIndexDb } from 'signalstory';

export const idpSetup = () => {
  initIndexDb('NewDB', 8, registration =>
    registration
      .addStore('Store1', (oldVersion, state) => {
        return { oldVersion, state };
      })
      .addStore('Store2', (oldVersion, state) => {
        return { buz: 'sdfadjalksdjalskdj', oldVersion, state };
      })
      .addStore('BookStore')
      .addStore('TemporaryStore')
  );
};
