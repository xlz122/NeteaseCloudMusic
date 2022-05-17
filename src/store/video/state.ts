export type State = {
  video: {
    id: number;
    url: string;
  };
  videoPlayProgress: unknown;
  videoVolume: number;
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  video: faultTolerant('video') || {}, // 视频/mv 数据
  videoPlayProgress: {}, // 当前播放视频进度数据
  videoVolume: Number(localStorage.getItem('videoVolume')) || 1 // 播放器 - 音量
};

export default state;
