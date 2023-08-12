import { Store } from '../store';

export type StorePlugin = {
  init?: (store: Store<any>) => void;
  preprocessCommand?: (store: Store<any>, command: string | undefined) => void;
  postprocessCommand?: (store: Store<any>, command: string | undefined) => void;
  [others: string]: any;
};
