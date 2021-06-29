export type State = {
  heaerActiveIndex: number;
  loginDialog: boolean;
  accountInfo: unknown;
  userInfo: unknown;
  searchKeywordText: string;
  isLogin: boolean;
  message: unknown;
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  heaerActiveIndex: Number(localStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  loginDialog: false, // 登录对话框显隐
  accountInfo: faultTolerant('accountInfo') || {}, // 账户信息
  userInfo: faultTolerant('userInfo') || {}, // 用户信息
  searchKeywordText: localStorage.getItem('searchKeywordText') || '', // 搜索关键字
  isLogin: faultTolerant('isLogin') || false, // 是否登录
  message: faultTolerant('message') || {} // 消息提示
};

export default state;
