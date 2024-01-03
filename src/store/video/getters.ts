import type { State } from '@/store/video/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  videoPlayUrl: state => state.videoPlayUrl,
  videoPlayProgress: state => state.videoPlayProgress,
  videoVolume: state => state.videoVolume
};

export default getters;
