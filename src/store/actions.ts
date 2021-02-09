import { State } from '@store/state';
import { Getters } from '@store/getters';
import router from '@/router';
import { logout } from '@api/login';
import { ResponseDataType } from '@/types/types';

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
  setLogout({ commit }) {
    return new Promise(resolve => {
      logout().then((res: ResponseDataType) => {
        if (res?.code === 200) {
          commit('setLogout', '');
          // 跳转首页
          router.push('/');
          resolve(res);
        }
      });
    });
  }
};

export default actions;
