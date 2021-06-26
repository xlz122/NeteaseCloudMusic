import { State } from '@store/music/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  activeSongListId: state => state.activeSongListId,
  musicDetailOptions: state => state.musicDetailOptions,
  songListDetailData: state => state.songListDetailData,
  musicAudioLock: state => state.musicAudioLock,
  playMusicId: state => state.playMusicId,
  playMusicItem: state => state.playMusicItem,
  playMusicList: state => state.playMusicList,
  musicPlayProgress: state => state.musicPlayProgress,
  musicPlayStatus: state => state.musicPlayStatus,
  musicModeType: state => state.musicModeType,
  musicVolume: state => state.musicVolume,
  playLyrics: state => state.playLyrics
};

export default getters;
