export type State = {
  video: Video;
  videoPlayProgress: VideoPlayProgress;
  videoVolume: number;
};

export type Video = {
  id: number;
  url: string;
};

export type VideoPlayProgress = {
  progress?: number;
  currentTime?: number;
  duration?: number;
  cacheProgress?: number;
  timeChange?: boolean;
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  video: faultTolerant('video') || {}, // 视频/mv 数据
  videoPlayProgress: {
    progress: 0,
    currentTime: 0,
    duration: 0,
    cacheProgress: 0
  }, // 当前播放视频进度数据
  videoVolume: Number(localStorage.getItem('videoVolume')) || 1 // 播放器 - 音量
};

export default state;
