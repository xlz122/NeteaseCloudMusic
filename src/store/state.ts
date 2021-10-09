export type State = {
  heaerActiveIndex: number;
  subActiveIndex: number;
  loginDialog: boolean;
  userInfo: unknown;
  isLogin: boolean;
  message: unknown;
  searchText: string;
  searchDetailText: string;
  userId: number;
  songId: number;
  singerId: number;
  djprogramId: number;
  albumId: number;
  singerTabIndex: number;
  searchIndex: number;
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  heaerActiveIndex: Number(localStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  subActiveIndex: Number(localStorage.getItem('subActiveIndex')) || 0, // 二级导航选中
  loginDialog: false, // 登录对话框显隐
  userInfo: faultTolerant('userInfo') || {}, // 用户信息
  isLogin: faultTolerant('isLogin') || false, // 是否登录
  message: {}, // 消息提示
  searchText: '', // 搜索关键字
  searchDetailText: localStorage.getItem('searchDetailText') || '', // 搜索关键字
  userId: Number(localStorage.getItem('userId')) || 0, // 用户uid(自己或其他人)
  songId: Number(localStorage.getItem('songId')) || 0, // 歌曲id
  singerId: Number(localStorage.getItem('singerId')) || 0, // 歌手id
  djprogramId: Number(localStorage.getItem('djprogramId')) || 0, // 电台节目id
  albumId: Number(localStorage.getItem('albumId')) || 0, // 专辑id
  singerTabIndex: Number(localStorage.getItem('singerTabIndex')) || 0, // 歌手详情导航
  searchIndex: Number(localStorage.getItem('searchIndex')) || 0 // 搜索详情导航
};

export default state;
