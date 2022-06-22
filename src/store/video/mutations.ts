import type { State } from '@store/video/state';

type Mutations<T, U> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State, unknown> = {
  // 视频/mv 数据
  setVideo(state, video) {
    state.video = video as State['video'];
    localStorage.setItem('video', JSON.stringify(video));
  },
  // 当前播放视频进度数据
  setVideoPlayProgress(state, playProgress) {
    const videoPlayProgress = JSON.parse(
      JSON.stringify(state.videoPlayProgress)
    );
    const progress = Object.assign(videoPlayProgress, playProgress);
    state.videoPlayProgress = progress as unknown;
  },
  // 音量控制
  setVideoVolume(state, videoVolume) {
    state.videoVolume = videoVolume as number;
    localStorage.setItem('videoVolume', JSON.stringify(videoVolume));
  }
};

export default mutations;
