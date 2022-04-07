import { AxiosPromise, AxiosRequestConfig } from 'axios';

// axios接口方法返回类型
export type AxiosRequest = AxiosPromise<AxiosRequestConfig>;

// 接口返回值类型
export type ResponseType<T = any> = {
  msg?: string;
  message?: string;
  code?: number;
  count?: T;
  data: T;
  cookie?: string;
  token?: string;
  account?: T;
  result?: T;
  [index: string]: any;
};

// 循环类型，forEach map...
export type LoopType = Record<string, any>;

// 歌单选项列表数据
export type SongList = {
  createSongList: unknown[];
  collectionSongList: unknown[];
};

// 播放器数据
export type AudioData = {
  src: string;
  autoplay: boolean;
  loop: boolean;
};

// 音乐进度条数据
export type ProgressData = {
  progress: number;
  currentTime: number;
  duration: number;
  cacheProgress: number;
};

// 评论
export type CommentParams = {
  type: number;
  id: number;
  offset: number;
  limit: number;
  total: number;
  hotList: List[];
  list: List[];
};

type List = {
  replyShow: boolean;
  liked: boolean;
  likedCount: number;
};
