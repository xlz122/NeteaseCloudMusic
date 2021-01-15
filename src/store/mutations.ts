import { State } from '@store/state';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  // 头部选中导航
  setHeaderActiveIndex(state, index) {
    state.heaerActiveIndex = index as number;
    sessionStorage.setItem('heaerActiveIndex', (index as number).toString());
  },
  // 登录对话框
  setLoginDialog(state, bool) {
    state.loginDialog = bool as boolean;
  },
  // 账户信息
  setAccountInfo(state, accountInfo) {
    state.accountInfo = accountInfo as unknown;
  },
  // 用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo as unknown;
  }
};

export default mutations;
