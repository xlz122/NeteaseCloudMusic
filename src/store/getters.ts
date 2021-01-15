import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex,
  loginDialog: state => state.loginDialog,
  accountInfo: state =>
    Object.keys(state.accountInfo as string).length > 0
      ? JSON.parse(state.accountInfo as string)
      : {},
  userInfo: state =>
    Object.keys(state.userInfo as string).length > 0
      ? JSON.parse(state.userInfo as string)
      : {},
  isLogin: state =>
    Object.keys(state.userInfo as string).length > 0 ? true : false // 是否登录
};

export default getters;
