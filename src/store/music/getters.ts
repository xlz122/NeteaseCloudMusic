import { State } from '@store/music/state';
import { LoopType } from '@/types/types';

export interface Getters<T> {
  [key: string]: (state: T) => void;
}

const getters: Getters<State> = {
  activeSongListId: state => state.activeSongListId,
  musicDetailOptions: state => state.musicDetailOptions,
  songListDetailData: state => state.songListDetailData,
  curPlayMusicId: state => state.curPlayMusicId,
  // 当前播放数据不进行本地存储,直接根据id列表数据获取
  curPlayMusicData: state => {
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    return (
      list.find((item: LoopType) => item.id === state.curPlayMusicId) || {}
    );
  },
  musicPlayTime: state => state.musicPlayTime,
  musicVolume: state => state.musicVolume,
  isMysicAudioLock: state => state.isMysicAudioLock,
  playMusicList: state => state.playMusicList,
  playLyrics: state => state.playLyrics
};

export default getters;
