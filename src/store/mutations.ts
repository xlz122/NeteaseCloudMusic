import type { State } from '@/store/state';
import { clearAllCookie } from '@/utils/cookie';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 一级导航
  setMenuIndex(state, payload: number) {
    state.menuIndex = payload;
    localStorage.setItem('menuIndex', String(payload));
  },
  // 二级导航
  setSubMenuIndex(state, payload: number) {
    state.subMenuIndex = payload;
    localStorage.setItem('subMenuIndex', String(payload));
  },
  // 登录对话框
  setLoginDialog(state, payload: boolean) {
    state.loginDialog = payload;
  },
  setUserInfo(state, payload: State['userInfo']) {
    state.userInfo = payload;
    localStorage.setItem('userInfo', JSON.stringify(payload));
    state.isLogin = true;
    localStorage.setItem('isLogin', JSON.stringify(true));
  },
  setCookie(state, payload: string) {
    state.cookie = payload;
    localStorage.setItem('cookie', JSON.stringify(payload));
  },
  // 我的音乐 - 歌单id
  setSongSheetId(state, payload: number) {
    state.songSheetId = payload;
    localStorage.setItem('songSheetId', JSON.stringify(payload));
  },
  // 歌手详情tab
  setSingerTabIndex(state, payload: number) {
    state.singerTabIndex = payload;
    localStorage.setItem('singerTabIndex', JSON.stringify(payload));
  },
  // 签到
  setSignIn(state, payload: boolean) {
    state.userInfo.pcSign = payload;
    localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
  },
  // 歌曲收藏
  setSongCollect(state, payload: State['songCollect']) {
    state.songCollect = payload;
  },
  // 版权对话框
  setCopyrightDialog(state, payload: State['copyrightDialog']) {
    state.copyrightDialog = payload;
  },
  // 验证对话框
  setVerifyDialog(state, payload: State['verifyDialog']) {
    state.verifyDialog = payload;
  },
  // 退出登录
  setLogout(state) {
    state.isLogin = false;
    state.userInfo = {};
    localStorage.clear();
    clearAllCookie();
  }
};

export default mutations;
