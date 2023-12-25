export type State = {
  menuIndex: number;
  subMenuIndex: number;
  loginDialog: boolean;
  userInfo: unknown;
  cookie: string;
  isLogin: boolean;
  searchText: string;
  searchDetailText: string;
  singerTabIndex: number;
  searchIndex: number;
  songSheetId: number;
  collectSong: {
    visible: boolean;
    songIds: string;
  };
  copyright: {
    visible: boolean;
    message: string;
  };
  abnormal: {
    visible: boolean;
    url: string;
  };
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name) || '');
  }
}

const state: State = {
  menuIndex: Number(localStorage.getItem('menuIndex')) || 0, // 头部导航
  subMenuIndex: Number(localStorage.getItem('subMenuIndex')) || 0, // 二级导航
  loginDialog: false, // 登录对话框
  userInfo: faultTolerant('userInfo') || {},
  cookie: localStorage.getItem('cookie') || '',
  isLogin: faultTolerant('isLogin') || false,
  searchText: '', // 搜索关键字
  searchDetailText: localStorage.getItem('searchDetailText') || '', // 搜索关键字
  singerTabIndex: Number(localStorage.getItem('singerTabIndex')) || 0, // 歌手详情导航
  searchIndex: Number(localStorage.getItem('searchIndex')) || 0, // 搜索详情导航
  songSheetId: Number(localStorage.getItem('songSheetId')) || 0, // 我的音乐 - 歌单id
  collectSong: {
    visible: false,
    songIds: ''
  }, // 收藏歌曲
  copyright: {
    visible: false,
    message: ''
  }, // 版权提示
  abnormal: {
    visible: false,
    url: ''
  } // 异常提示
};

export default state;
