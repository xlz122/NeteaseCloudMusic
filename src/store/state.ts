export interface State {
  heaerActiveIndex: number;
  loginDialog: boolean;
  accountInfo: unknown;
  userInfo: unknown;
}

const state: State = {
  heaerActiveIndex: Number(localStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  loginDialog: false, // 登录对话框显隐
  accountInfo: JSON.parse(localStorage.getItem('accountInfo') as string) || {}, // 账户信息
  userInfo: JSON.parse(localStorage.getItem('userInfo') as string) || {} // 用户信息
};

export default state;
