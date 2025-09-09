import type { State } from '@/store/music/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 当前播放
  setPlaySongItem(state, payload: State['playSongItem']) {
    state.playSongId = payload.id;
    localStorage.setItem('playSongId', JSON.stringify(payload.id));

    state.playSongItem = payload;
    localStorage.setItem('playSongItem', JSON.stringify(payload));
  },
  // 播放歌曲刷新
  setPlaySongRefresh(state, payload: boolean) {
    state.playSongRefresh = payload;
  },
  // 播放列表
  setSongPlaylist(state, payload: State['songPlaylist']) {
    state.songPlaylist = payload;
    localStorage.setItem('songPlaylist', JSON.stringify(payload));
  },
  // 播放器锁定
  setAudioPlayerLock(state, payload: boolean) {
    state.audioPlayerLock = payload;
    localStorage.setItem('audioPlayerLock', JSON.stringify(payload));
  },
  // 清空播放列表
  emptySongPlaylist(state) {
    state.songPlaylist = [];
    localStorage.setItem('songPlaylist', '[]');
    localStorage.setItem('playSongId', '');
    localStorage.setItem('playSongItem', '');
  }
};

export default mutations;
