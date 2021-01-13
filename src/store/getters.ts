import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex
};

export default getters;
