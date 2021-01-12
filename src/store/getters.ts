import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  msg: state => state.msg
};

export default getters;
