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
  // 播放列表
  setSongPlaylist(state, payload: State['songPlaylist']) {
    state.songPlaylist = payload;
    localStorage.setItem('songPlaylist', JSON.stringify(payload));
  },
  // 播放进度
  setSongPlayProgress(state, payload: State['songPlayProgress']) {
    state.songPlayProgress = { ...state.songPlayProgress, ...payload };
  },
  // 播放状态
  setSongPlayStatus(state, payload: State['songPlayStatus']) {
    state.songPlayStatus = { ...state.songPlayStatus, ...payload };
  },
  // 播放器锁定
  setMsicAudioLock(state, payload: boolean) {
    state.musicAudioLock = payload;
    localStorage.setItem('musicAudioLock', JSON.stringify(payload));
  },
  // 播放模式
  setMusicModeType(state, payload: number) {
    state.musicModeType = payload;
    localStorage.setItem('musicModeType', JSON.stringify(payload));
  },
  // 音量
  setMusicVolume(state, payload: number) {
    state.musicVolume = payload;
    localStorage.setItem('musicVolume', JSON.stringify(payload));
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
