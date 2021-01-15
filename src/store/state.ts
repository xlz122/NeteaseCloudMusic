export interface State {
  heaerActiveIndex: number;
  loginDialog: boolean;
}

const state: State = {
  heaerActiveIndex: Number(sessionStorage.getItem('heaerActiveIndex')) || 0, // 头部导航选中
  loginDialog: false // 登录对话框显隐
};

export default state;
