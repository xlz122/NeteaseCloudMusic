import { State, MyMusicDetail } from '@store/state';

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
  },
  // 我的音乐显示详情
  setMyMusicDetail(state, myMusicDetail) {
    state.myMusicDetail = myMusicDetail as MyMusicDetail;
    sessionStorage.setItem('myMusicDetail', JSON.stringify(myMusicDetail));
  },
  // 我的音乐 - 创建歌单详情数据
  setPlayDetailData(state, playDetailData) {
    state.playDetailData = playDetailData as unknown;
    sessionStorage.setItem('playDetailData', JSON.stringify(playDetailData));
  }
};

export default mutations;
