import { State } from '@store/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  heaerActiveIndex: state => state.heaerActiveIndex,
  subActiveIndex: state => state.subActiveIndex,
  loginDialog: state => state.loginDialog,
  userInfo: state => state.userInfo,
  isLogin: state => state.isLogin,
  message: state => state.message,
  searchText: state => state.searchText,
  searchDetailText: state => state.searchDetailText,
  userId: state => state.userId,
  songId: state => state.songId,
  singerId: state => state.singerId,
  albumId: state => state.albumId,
  singerTabIndex: state => state.singerTabIndex,
  searchIndex: state => state.searchIndex
};

export default getters;
