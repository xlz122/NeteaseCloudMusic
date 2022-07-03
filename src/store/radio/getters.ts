import type { State } from '@store/radio/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  radioDetailId: state => state.radioDetailId
};

export default getters;
