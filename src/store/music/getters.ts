import { State } from '@store/music/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  songSheetDetail: state => state.songSheetDetail,
  collectSong: state => state.collectSong,
  playMusicId: state => state.playMusicId,
  playMusicItem: state => state.playMusicItem,
  playMusicList: state => state.playMusicList,
  musicPlayProgress: state => state.musicPlayProgress,
  musicPlayStatus: state => state.musicPlayStatus,
  musicAudioLock: state => state.musicAudioLock,
  musicModeType: state => state.musicModeType,
  musicVolume: state => state.musicVolume,
  playLyrics: state => state.playLyrics
};

export default getters;
