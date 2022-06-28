import { toRawType } from '@utils/tool';
import type {
  State,
  PlayMusicItem,
  MusicPlayProgress,
  MusicPlayStatus
} from '@store/music/state';

type Mutations<T, U> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State, unknown> = {
  // 当前播放音乐
  setPlayMusicItem(state, musicItem) {
    state.playMusicId = (musicItem as PlayMusicItem).id;
    localStorage.setItem(
      'playMusicId',
      JSON.stringify((musicItem as PlayMusicItem).id)
    );

    state.playMusicItem = musicItem as PlayMusicItem;
    localStorage.setItem('playMusicItem', JSON.stringify(musicItem));
  },
  // 播放列表(新数据往最后面添加)
  setPlayMusicList(state, music) {
    if (toRawType(music) !== 'Object' && toRawType(music) !== 'Array') {
      throw new Error('添加的播放数据类型错误');
    }

    if (toRawType(music) === 'Object') {
      music = [music];
    }

    const musicList = JSON.parse(JSON.stringify(state.playMusicList));

    (music as PlayMusicItem[]).forEach((item: PlayMusicItem) => {
      const index = musicList.findIndex((f: PlayMusicItem) => f.id === item.id);
      if (index === -1) {
        musicList.push(item);
      }
    });

    state.playMusicList = musicList;
    localStorage.setItem('playMusicList', JSON.stringify(musicList));
  },
  // 当前播放音乐进度数据
  setMusicPlayProgress(state, playProgress) {
    const musicPlayProgress = JSON.parse(
      JSON.stringify(state.musicPlayProgress)
    );
    const progress = Object.assign(musicPlayProgress, playProgress);
    state.musicPlayProgress = progress as MusicPlayProgress;
  },
  // 音乐播放状态
  setMusicPlayStatus(state, playStatus) {
    const keys = Object.keys(playStatus as MusicPlayStatus);

    for (const key of keys) {
      state.musicPlayStatus[key] = (playStatus as MusicPlayStatus)[key];
    }
  },
  // 播放器锁定在底部
  setMsicAudioLock(state, musicAudioLock) {
    state.musicAudioLock = musicAudioLock as boolean;
    localStorage.setItem('musicAudioLock', JSON.stringify(musicAudioLock));
  },
  // 播放类型
  setMusicModeType(state, modeType) {
    state.musicModeType = modeType as number;
    localStorage.setItem('musicModeType', JSON.stringify(modeType));
  },
  // 音量控制
  setMusicVolume(state, musicVolume) {
    state.musicVolume = musicVolume as number;
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
  },
  // 播放器 - 歌词
  setLyrics(state, playLyrics) {
    state.playLyrics = playLyrics as unknown[];
    localStorage.setItem('playLyrics', JSON.stringify(playLyrics));
  },
  // 播放器 - 清空播放列表
  emptyPlayMusicList(state) {
    state.playMusicList = [] as unknown[];
    localStorage.setItem('playMusicList', [] as never);
    // 清除歌词
    state.playLyrics = [] as unknown[];
    localStorage.setItem('playLyrics', [] as never);
    // 清除本地当前播放数据(清除后刷新)
    localStorage.setItem('playMusicId', '');
    localStorage.setItem('playMusicItem', '');
  },
  // 播放器 - 删除播放列表单项数据
  deletePlayMusicList(state, id) {
    // 查找索引
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex((item: PlayMusicItem) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicList', JSON.stringify(list));
  }
};

export default mutations;
