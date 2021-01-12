import { State } from '@store/state';
import { Getters } from '@store/getters';

export interface Store {
  state: State;
  getters: Getters<State>;
  // 箭头函数定义
  commit: (type: string, payload: unknown) => void;
  // 普通函数定义
  dispatch(type: string, payload: unknown): void;
}

interface Actions<T, U> {
  [key: string]: (store: T, payload: U) => void;
}

const actions: Actions<Store, unknown> = {
  setMsg({ commit }, msg) {
    commit('setMsg', msg as string);
  }
};

export default actions;
