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

const state: State = {
  menuIndex: getLocalStorage('menuIndex', 0), // 一级导航
  subMenuIndex: getLocalStorage('subMenuIndex', 0), // 二级导航
  loginDialog: false, // 登录对话框
  userInfo: getLocalStorage('userInfo', {}),
  cookie: getLocalStorage('cookie', ''),
  isLogin: getLocalStorage('isLogin', false),
  songSheetId: getLocalStorage('songSheetId', 0), // 我的音乐 - 歌单id
  singerTabIndex: getLocalStorage('singerTabIndex', 0), // 歌手详情导航
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

function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '') ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export default state;
