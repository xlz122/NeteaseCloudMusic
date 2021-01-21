import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex,
  loginDialog: state => state.loginDialog,
  accountInfo: state => state.accountInfo,
  userInfo: state => state.userInfo,
  isLogin: state =>
    Object.keys(
      JSON.parse(localStorage.getItem('userInfo') as string) ||
        state.userInfo ||
        {}
    ).length > 0
      ? true
      : false, // 是否登录
  myMusicDetail: state => state.myMusicDetail,
  playDetailData: state => state.playDetailData,
  playMusicId: state => state.playMusicId,
  playMusicList: state => state.playMusicList
};

export default getters;
