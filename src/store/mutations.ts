import { State } from '@store/state';
import { clearAllCookie } from '@utils/cookie';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

type Message = {
  type: string;
  title: string;
  time?: number;
};

const mutations: Mutations<State> = {
  // 头部导航选中
  setHeaderActiveIndex(state, index: number) {
    state.heaerActiveIndex = index;
    localStorage.setItem('heaerActiveIndex', index.toString());
  },
  // 二级导航选中
  setSubActiveIndex(state, index: number) {
    state.subActiveIndex = index;
    localStorage.setItem('subActiveIndex', index.toString());
  },
  // 登录对话框
  setLoginDialog(state, bool: boolean) {
    state.loginDialog = bool;
  },
  // 用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo as unknown;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // 是否登录
    state.isLogin = true;
    localStorage.setItem('isLogin', JSON.stringify(true));
  },
  // 消息提示
  setMessage(state, message: Message) {
    return new Promise(resolve => {
      const params = Object.assign({ time: 1000 }, message);
      state.message = params;
      resolve('');
    });
  },
  // 搜索关键字
  setSearchText(state, searchText: string) {
    state.searchText = searchText;
    localStorage.setItem('searchText', JSON.stringify(searchText));
  },
  // 用户uid(自己或其他人)
  setUserId(state, userId: number) {
    state.userId = userId;
    localStorage.setItem('userId', JSON.stringify(userId));
  },
  // 歌手id
  setSingerId(state, singerId: number) {
    state.singerId = singerId;
    localStorage.setItem('singerId', JSON.stringify(singerId));
  },
  // 歌手id
  setSingerTabIndex(state, singerTabIndex: number) {
    state.singerTabIndex = singerTabIndex;
    localStorage.setItem('singerTabIndex', JSON.stringify(singerTabIndex));
  },
  // 签到
  setSignIn(state, signIn: boolean) {
    const userInfo = JSON.parse(JSON.stringify(state.userInfo));
    userInfo.pcSign = signIn;
    state.userInfo = userInfo as unknown;
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },
  // 退出登录
  setLogout(state) {
    state.isLogin = false;
    // 清除用户信息
    state.userInfo = {};
    // 清除所有本地存储
    localStorage.clear();
    // 清除所有cookie
    clearAllCookie();
  }
};

export default mutations;
