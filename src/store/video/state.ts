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
  }, // 当前播放视频进度数据
  videoVolume: Number(localStorage.getItem('videoVolume')) || 1 // 播放器 - 音量
};

export default state;
