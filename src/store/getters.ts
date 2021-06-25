import { State } from '@store/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex,
  loginDialog: state => state.loginDialog,
  accountInfo: state => state.accountInfo,
  userInfo: state => state.userInfo,
  searchKeywordText: state => state.searchKeywordText,
  isLogin: state => state.isLogin,
  message: state => state.message
};

export default getters;
