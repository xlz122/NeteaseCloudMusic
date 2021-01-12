import { State } from '@store/state';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  setHeaderNavIndex(state, msg) {
    state.msg = msg as string;
  }
};

export default mutations;
