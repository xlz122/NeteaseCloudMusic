import type {
  State,
  PlayMusicItem,
  MusicPlayProgress,
  MusicPlayStatus,
  PlayLyrics
} from '@store/music/state';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 当前播放音乐
  setPlayMusicItem(state, musicItem: PlayMusicItem) {
    state.playMusicId = musicItem.id;
    localStorage.setItem('playMusicId', JSON.stringify(musicItem.id));

    state.playMusicItem = musicItem;
    localStorage.setItem('playMusicItem', JSON.stringify(musicItem));
  },
  // 播放列表(新数据往最后面添加)
  setPlayMusicList(state, music) {
    state.playMusicList = music;
    localStorage.setItem('playMusicList', JSON.stringify(music));
  },
  // 当前播放音乐进度数据
  setMusicPlayProgress(state, playProgress: MusicPlayProgress) {
    const musicPlayProgress = JSON.parse(
      JSON.stringify(state.musicPlayProgress)
    );
    const progress = Object.assign(musicPlayProgress, playProgress);
    state.musicPlayProgress = progress;
  },
  // 音乐播放状态
  setMusicPlayStatus(state, playStatus: MusicPlayStatus) {
    const keys = Object.keys(playStatus);

    for (const key of keys) {
      state.musicPlayStatus[key] = playStatus[key];
    }
  },
  // 播放器锁定在底部
  setMsicAudioLock(state, musicAudioLock: boolean) {
    state.musicAudioLock = musicAudioLock;
    localStorage.setItem('musicAudioLock', JSON.stringify(musicAudioLock));
  },
  // 播放模式
  setMusicModeType(state, modeType: number) {
    state.musicModeType = modeType;
    localStorage.setItem('musicModeType', JSON.stringify(modeType));
  },
  // 音量控制
  setMusicVolume(state, musicVolume: number) {
    state.musicVolume = musicVolume;
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
  },
  // 播放器 - 歌词
  setLyrics(state, playLyrics: PlayLyrics[]) {
    state.playLyrics = playLyrics;
    localStorage.setItem('playLyrics', JSON.stringify(playLyrics));
  },
  // 播放器 - 清空播放列表
  emptyPlayMusicList(state) {
    state.playMusicList = [];
    localStorage.setItem('playMusicList', '[]');
    // 清除歌词
    state.playLyrics = [];
    localStorage.setItem('playLyrics', '[]');
    // 清除本地当前播放数据(清除后刷新)
    localStorage.setItem('playMusicId', '');
    localStorage.setItem('playMusicItem', '');
  },
  // 播放器 - 删除播放列表单项数据
  deletePlayMusicList(state, id: number) {
    // 查找索引
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex((item: PlayMusicItem) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 保存数据
    state.playMusicList = list;
    localStorage.setItem('playMusicList', JSON.stringify(list));
  }
};

export default mutations;
