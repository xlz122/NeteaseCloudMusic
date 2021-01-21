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
  },
  // 我的音乐 - 创建歌单详情数据
  setPlayDetailData(state, playDetailData) {
    state.playDetailData = playDetailData as unknown;
    localStorage.setItem('playDetailData', JSON.stringify(playDetailData));
  },
  // 我的音乐 - 当前播放音乐id
  setPlayMusicId(state, playMusicId) {
    state.playMusicId = playMusicId as number;
    localStorage.setItem('playMusicId', JSON.stringify(playMusicId));
  },
  // 我的音乐 - 播放列表数据
  setPlayMusicList(state, playMusicData) {
    // 数据去重
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex(
      (item: { [key: string]: any }) =>
        item.id === (playMusicData as { [key: string]: any }).id
    );
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 新数据添加到第一项
    list.push(playMusicData);
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicData', JSON.stringify(list));
  }
};

export default mutations;
