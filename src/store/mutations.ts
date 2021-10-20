import { State } from '@store/state';

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
  // 用户cookie
  setCookie(state, cookie) {
    state.cookie = cookie as string;
    localStorage.setItem('cookie', JSON.stringify(cookie));
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
  },
  // 搜索详情关键字
  setSearchDetailText(state, searchDetailText: string) {
    state.searchDetailText = searchDetailText;
    localStorage.setItem('searchDetailText', JSON.stringify(searchDetailText));
  },
  // 用户uid(自己或其他人)
  setUserId(state, userId: number) {
    state.userId = userId;
    localStorage.setItem('userId', JSON.stringify(userId));
  },
  // 歌曲id
  setSongId(state, songId: number) {
    state.songId = songId;
    localStorage.setItem('songId', JSON.stringify(songId));
  },
  // 歌手id
  setSingerId(state, singerId: number) {
    state.singerId = singerId;
    localStorage.setItem('singerId', JSON.stringify(singerId));
    // 重置歌手详情tab
    state.singerTabIndex = 0;
    localStorage.setItem('singerTabIndex', JSON.stringify(0));
  },
  // 专辑id
  setAlbumId(state, albumId: number) {
    state.albumId = albumId;
    localStorage.setItem('albumId', JSON.stringify(albumId));
  },
  // 电台节目id
  setDjprogramId(state, djprogramId: number) {
    state.djprogramId = djprogramId;
    localStorage.setItem('djprogramId', JSON.stringify(djprogramId));
  },
  // 歌手详情tab
  setSingerTabIndex(state, singerTabIndex: number) {
    state.singerTabIndex = singerTabIndex;
    localStorage.setItem('singerTabIndex', JSON.stringify(singerTabIndex));
  },
  // 搜索详情tab
  setSearchIndex(state, searchIndex: number) {
    state.searchIndex = searchIndex;
    localStorage.setItem('searchIndex', JSON.stringify(searchIndex));
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
  }
};

export default mutations;
