export type State = {
  menuIndex: number;
  subMenuIndex: number;
  loginDialog: boolean;
  userInfo: unknown;
  cookie: string;
  isLogin: boolean;
  searchText: string;
  searchDetailText: string;
  userId: number;
  songId: number;
  songSheetId: number;
  singerId: number;
  programId: number;
  albumId: number;
  singerTabIndex: number;
  searchIndex: number;
  songSheetDetail: unknown;
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
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  menuIndex: Number(localStorage.getItem('menuIndex')) || 0, // 头部导航
  subMenuIndex: Number(localStorage.getItem('subMenuIndex')) || 0, // 二级导航
  loginDialog: false, // 登录对话框显隐
  userInfo: faultTolerant('userInfo') || {}, // 用户信息
  cookie: localStorage.getItem('cookie') || '', // 用户cookie
  isLogin: faultTolerant('isLogin') || false, // 是否登录
  searchText: '', // 搜索关键字
  searchDetailText: localStorage.getItem('searchDetailText') || '', // 搜索关键字
  userId: Number(localStorage.getItem('userId')) || 0, // 用户uid(自己或其他人)
  songId: Number(localStorage.getItem('songId')) || 0, // 歌曲id
  songSheetId: Number(localStorage.getItem('songSheetId')) || 0, // 歌单id
  singerId: Number(localStorage.getItem('singerId')) || 0, // 歌手id
  programId: Number(localStorage.getItem('programId')) || 0, // 电台节目id
  albumId: Number(localStorage.getItem('albumId')) || 0, // 专辑id
  singerTabIndex: Number(localStorage.getItem('singerTabIndex')) || 0, // 歌手详情导航
  searchIndex: Number(localStorage.getItem('searchIndex')) || 0, // 搜索详情导航
  songSheetDetail: faultTolerant('songSheetDetail') || {}, // 歌单详情数据
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
