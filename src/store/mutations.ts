import { State, MyMusicDetail } from '@store/state';
import { LoopType } from '@/types/types';
import { clearAllCookie } from '@utils/cookie';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  // 头部选中导航z
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
      (item: LoopType) => item.id === (playMusicData as LoopType).id
    );
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 新数据添加到第一项
    list.push(playMusicData);
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicData', JSON.stringify(list));
  },
  // 播放器 - 清空播放列表数据
  emptyPlayMusicList(state) {
    state.playMusicList = [] as unknown[];
    localStorage.setItem('playMusicData', [] as never);
  },
  // 播放器 - 删除播放列表单项数据
  deletePlayMusicList(state, id) {
    // 查找索引
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex((item: LoopType) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicData', JSON.stringify(list));
  }
};

export default mutations;
