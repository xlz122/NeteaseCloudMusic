import type { State, VideoPlayProgress } from '@store/video/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 视频/mv 数据
  setVideo(state, video: State['video']) {
    state.video = video;
    localStorage.setItem('video', JSON.stringify(video));
  },
  // 当前播放视频进度数据
  setVideoPlayProgress(state, playProgress: VideoPlayProgress) {
    const videoPlayProgress = JSON.parse(
      JSON.stringify(state.videoPlayProgress)
    );
    const progress = Object.assign(videoPlayProgress, playProgress);
    state.videoPlayProgress = progress;
  },
  // 音量控制
  setVideoVolume(state, videoVolume: number) {
    state.videoVolume = videoVolume;
    localStorage.setItem('videoVolume', JSON.stringify(videoVolume));
  }
};

export default mutations;
