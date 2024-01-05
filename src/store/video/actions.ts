import type { State } from '@/store/video/state';
import type { Getters } from '@/store/video/getters';

export type Store = {
  state: State;
  getters: Getters<State>;
  commit: (type: string, payload: unknown) => void;
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
