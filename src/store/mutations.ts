import { State } from '@store/state';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  // 头部选中导航
  setHeaderActiveIndex(state, index) {
    state.heaerActiveIndex = index as number;
    localStorage.setItem('heaerActiveIndex', (index as number).toString());
  }
};

export default mutations;
