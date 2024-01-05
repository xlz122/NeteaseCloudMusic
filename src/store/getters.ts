import type { State } from '@/store/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  menuIndex: state => state.menuIndex,
  subMenuIndex: state => state.subMenuIndex,
  loginDialog: state => state.loginDialog,
  userInfo: state => state.userInfo,
  cookie: state => state.cookie,
  isLogin: state => state.isLogin,
  songSheetId: state => state.songSheetId,
  singerTabIndex: state => state.singerTabIndex,
  songCollect: state => state.songCollect,
  copyright: state => state.copyright,
  abnormal: state => state.abnormal
};

export default getters;
