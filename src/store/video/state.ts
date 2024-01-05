export type State = {
  videoPlayUrl: string;
  videoPlayProgress: VideoPlayProgress;
  videoVolume: number;
};

export type VideoPlayProgress = {
  progress?: number;
  currentTime?: number;
  duration?: number;
  cacheProgress?: number;
  timeChange?: boolean;
};

const state: State = {
  videoPlayUrl: localStorage.getItem('videoPlayUrl') || '',
  videoPlayProgress: {
    progress: 0,
    currentTime: 0,
    duration: 0,
    cacheProgress: 0
  }, // 播放进度
  videoVolume: Number(localStorage.getItem('videoVolume')) || 1 // 音量
};

export default state;
