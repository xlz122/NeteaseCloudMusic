export interface State {
  heaerActiveIndex: number;
  loginDialog: boolean;
  accountInfo: unknown;
  userInfo: unknown;
}

const state: State = {
  heaerActiveIndex: Number(sessionStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  loginDialog: false, // 登录对话框显隐
  accountInfo: localStorage.getItem('accountInfo') || {}, // 账户信息
  userInfo: localStorage.getItem('userInfo') || {} // 用户信息
};

export default state;
