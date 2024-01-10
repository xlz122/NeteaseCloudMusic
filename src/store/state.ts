export type State = {
  menuIndex: number;
  subMenuIndex: number;
  loginDialog: boolean;
  userInfo: {
    pcSign?: boolean;
  };
  cookie: string;
  isLogin: boolean;
  songSheetId: number;
  singerTabIndex: number;
  songCollect: {
    visible: boolean;
    songIds: string;
  };
  copyrightDialog: {
    visible: boolean;
    message: string;
  };
  verifyDialog: {
    visible: boolean;
    token: string;
    vid: number;
    type: number;
    evid: string;
    sign: string;
  };
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name) || '');
  }
}

const state: State = {
  menuIndex: Number(localStorage.getItem('menuIndex')) || 0, // 一级导航
  subMenuIndex: Number(localStorage.getItem('subMenuIndex')) || 0, // 二级导航
  loginDialog: false, // 登录对话框
  userInfo: faultTolerant('userInfo') || {},
  cookie: localStorage.getItem('cookie') || '',
  isLogin: faultTolerant('isLogin') || false,
  songSheetId: Number(localStorage.getItem('songSheetId')) || 0, // 我的音乐 - 歌单id
  singerTabIndex: Number(localStorage.getItem('singerTabIndex')) || 0, // 歌手详情导航
  songCollect: {
    visible: false,
    songIds: ''
  }, // 歌曲收藏
  copyrightDialog: {
    visible: false,
    message: ''
  }, // 版权对话框
  verifyDialog: {
    visible: false,
    token: '',
    vid: 0,
    type: 0,
    evid: '',
    sign: ''
  } // 验证对话框
};

export default state;
