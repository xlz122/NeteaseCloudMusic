import { State } from '@store/music/state';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  activeSongListId: state => state.activeSongListId,
  musicDetailOptions: state => state.musicDetailOptions,
  songListDetailData: state => state.songListDetailData,
  curPlayMusicId: state => state.curPlayMusicId,
  musicPlayTime: state => state.musicPlayTime,
  musicVolume: state => state.musicVolume,
  isMysicAudioLock: state => state.isMysicAudioLock,
  playMusicList: state => state.playMusicList
};

export default getters;
