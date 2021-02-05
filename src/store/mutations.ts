import { State } from '@store/state';
import { clearAllCookie } from '@utils/cookie';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  // 头部选中导航
  setHeaderActiveIndex(state, index) {
    state.heaerActiveIndex = index as number;
    localStorage.setItem('heaerActiveIndex', (index as number).toString());
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
  },
  // 退出登录
  setLogout(state) {
    // 清除账户信息
    state.accountInfo = {};
    // 清除用户信息
    state.userInfo = {};
    // 清除所有本地存储
    localStorage.clear();
    // 清除所有cookie
    clearAllCookie();
  }
};

export default mutations;
