export interface State {
  heaerActiveIndex: number;
  loginDialog: boolean;
  accountInfo: unknown;
  userInfo: unknown;
  myMusicDetail: MyMusicDetail;
  playDetailData: unknown;
  playMusicData: unknown;
  playMusicList: unknown[];
}

export interface MyMusicDetail {
  myMv: boolean;
  playListDetail: boolean;
}

const state: State = {
  heaerActiveIndex: Number(sessionStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  loginDialog: false, // 登录对话框显隐
  accountInfo: JSON.parse(localStorage.getItem('accountInfo') as string) || {}, // 账户信息
  userInfo: JSON.parse(localStorage.getItem('userInfo') as string) || {}, // 用户信息
  myMusicDetail: {
    myMv: false,
    playListDetail: false
  }, // 我的音乐详情显示
  playDetailData:
    JSON.parse(sessionStorage.getItem('playDetailData') as string) || {}, // 我的音乐 - 创建歌单详情数据
  playMusicData:
    JSON.parse(sessionStorage.getItem('playMusicData') as string) || {}, // 我的音乐 - 当前播放音乐数据
  playMusicList:
    JSON.parse(localStorage.getItem('playMusicData') as string) || [] // 我的音乐 - 播放列表数据
};

export default state;
