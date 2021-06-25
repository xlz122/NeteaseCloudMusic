import { State } from '@store/state';
import { clearAllCookie } from '@utils/cookie';

interface Mutations<T, U = any> {
  [key: string]: (state: T, payload: U) => void;
}

interface Message {
  type: string;
  title: string;
  time?: number;
}

const mutations: Mutations<State> = {
  // 头部选中导航
  setHeaderActiveIndex(state, index: number) {
    state.heaerActiveIndex = index;
    localStorage.setItem('heaerActiveIndex', index.toString());
  },
  // 登录对话框
  setLoginDialog(state, bool: boolean) {
    state.loginDialog = bool;
  },
  // 账户信息
  setAccountInfo(state, accountInfo) {
    state.accountInfo = accountInfo as unknown;
    localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
  },
  // 用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo as unknown;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // 是否登录
    state.isLogin = true;
    localStorage.setItem('isLogin', JSON.stringify(true));
  },
  // 签到
  setSignIn(state, signIn: boolean) {
    const userInfo = JSON.parse(JSON.stringify(state.userInfo));
    userInfo.pcSign = signIn;
    state.userInfo = userInfo as unknown;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },
  setSearchKeywordText(state, searchKeywordText: string) {
    state.searchKeywordText = searchKeywordText;
    localStorage.setItem(
      'searchKeywordText',
      JSON.stringify(searchKeywordText)
    );
  },
  // 退出登录
  setLogout(state) {
    state.isLogin = false;
    // 清除账户信息
    state.accountInfo = {};
    // 清除用户信息
    state.userInfo = {};
    // 清除所有本地存储
    localStorage.clear();
    // 清除所有cookie
    clearAllCookie();
  },
  // 消息提示
  setMessage(state, message: Message) {
    return new Promise(resolve => {
      const params = Object.assign({ time: 1000 }, message);
      state.message = params;
      localStorage.setItem('message', JSON.stringify(params));
      resolve('');
    });
  }
};

export default mutations;
