// 接口返回值类型
export interface ResponseDataType<T = any> {
  msg?: string;
  message?: string;
  code?: number;
  count?: T;
  data: T;
  cookie?: string;
  token?: string;
  account?: T;
}

// 不固定接口返回值类型
export type ResponseType = Record<string, any>;

// 循环类型，forEach map...
export type LoopType = Record<string, any>;

// 歌单选项列表统计数
export interface OptionsCount {
  subPlayListCount: number;
  myMvCount: number;
  createdPlayCount: number;
  collectionPlayCount: number;
}

// 歌单选项列表数据
export interface SongList {
  createSongList: unknown[];
  collectionSongList: unknown[];
}

// 播放器数据
export interface AudioData {
  src: string;
  autoplay: boolean;
  loop: boolean;
}

// 音乐进度条数据
export interface ProgressData {
  progress: number;
  currentTime: number;
  duration: number;
  cacheProgress: number;
}
