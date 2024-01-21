import type { State } from '@/store/video/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 播放进度
  setVideoPlayProgress(state, payload: State['videoPlayProgress']) {
    state.videoPlayProgress = { ...state.videoPlayProgress, ...payload };
  },
  // 音量
  setVideoVolume(state, payload: number) {
    state.videoVolume = payload;
    localStorage.setItem('videoVolume', JSON.stringify(payload));
  }
};

export default mutations;
