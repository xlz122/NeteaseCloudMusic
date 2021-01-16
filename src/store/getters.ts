import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex,
  loginDialog: state => state.loginDialog,
  accountInfo: state => {
    const { accountInfo } = state;
    if (Object.prototype.toString.call(accountInfo) === '[object Object]') {
      return accountInfo;
    }
    const aInfo = JSON.parse(state.accountInfo as string);
    return Object.keys(aInfo).length > 0 ? JSON.parse(aInfo) : {};
  },
  userInfo: state => {
    const { userInfo } = state;
    if (Object.prototype.toString.call(userInfo) === '[object Object]') {
      return userInfo;
    }
    const uInfo = JSON.parse(state.userInfo as string);
    return Object.keys(uInfo).length > 0 ? uInfo : {};
  },
  isLogin: state => {
    let { userInfo } = state;
    if (Object.prototype.toString.call(userInfo) !== '[object Object]') {
      userInfo = JSON.parse(userInfo as string);
    }
    return Object.keys(userInfo as object).length > 0 ? true : false; // 是否登录
  }
};

export default getters;
