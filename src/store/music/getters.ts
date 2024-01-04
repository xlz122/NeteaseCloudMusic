import type { State } from '@/store/music/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  playSongId: state => state.playSongId,
  playSongItem: state => state.playSongItem,
  songPlaylist: state => state.songPlaylist,
  songPlayProgress: state => state.songPlayProgress,
  songPlayStatus: state => state.songPlayStatus,
  musicAudioLock: state => state.musicAudioLock,
  musicModeType: state => state.musicModeType,
  musicVolume: state => state.musicVolume,
  playLyrics: state => state.playLyrics
};

export default getters;
