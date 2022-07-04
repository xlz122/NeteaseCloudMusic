import type { State } from '@store/radio/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  setRadioDetailId(state, radioDetailsId: number) {
    state.radioDetailId = radioDetailsId;
    localStorage.setItem('radioDetailsId', JSON.stringify(radioDetailsId));
  }
};

export default mutations;
