export type State = {
  heaerActiveIndex: number;
  subActiveIndex: number;
  loginDialog: boolean;
  userInfo: unknown;
  isLogin: boolean;
  message: unknown;
  searchText: string;
  userId: number;
  singerId: number;
  singerTabIndex: number;
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
  searchText: localStorage.getItem('searchText') || '', // 搜索关键字
  userId: Number(localStorage.getItem('userId')) || 0, // 用户uid(自己或其他人)
  singerId: Number(localStorage.getItem('singerId')) || 0, // 歌手id
  singerTabIndex: Number(localStorage.getItem('singerTabIndex')) || 0 // 歌手详情导航
};

export default state;
