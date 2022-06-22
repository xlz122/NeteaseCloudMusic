import type { State } from '@store/video/state';

export type Getters<T> = {
  [key: string]: (state: T) => void;
};

const getters: Getters<State> = {
  video: state => state.video,
  videoPlayProgress: state => state.videoPlayProgress,
  videoVolume: state => state.videoVolume
};

export default getters;
