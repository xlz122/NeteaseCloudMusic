import type { State } from '@/store/music/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  playSongId: (state) => state.playSongId,
  playSongItem: (state) => state.playSongItem,
  playSongRefresh: (state) => state.playSongRefresh,
  songPlaylist: (state) => state.songPlaylist,
  audioPlayerLock: (state) => state.audioPlayerLock
};

export default getters;
