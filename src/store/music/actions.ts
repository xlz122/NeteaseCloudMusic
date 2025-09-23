import type { State } from '@/store/music/state';
import type { Getters } from '@/store/music/getters';

export type Store = {
  state: State;
  getters: Getters<State>;
  // 箭头函数定义
  commit: (type: string, payload: unknown) => void;
  // 普通函数定义
  dispatch(type: string, payload: unknown): void;
};

type Actions<T, U = any> = {
  [key: string]: (store: T, payload: U) => void;
};

const actions: Actions<Store> = {
  setMsg({ commit }, msg: string) {
    commit('setMsg', msg);
  }
};

export default actions;
