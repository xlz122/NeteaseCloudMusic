import { State, PlayMusicItem } from '@store/music/state';
import { LoopType } from '@/types/types';

type Mutations<T, U> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State, unknown> = {
  // 歌单详情数据
  setSongSheetDetail(state, songSheetDetail) {
    state.songSheetDetail = songSheetDetail as unknown;
    localStorage.setItem('songSheetDetail', JSON.stringify(songSheetDetail));
  },
  // 收藏歌曲
  collectPlayMusic(state, song) {
    state.collectSong = song as { visible: boolean; songIds: string };
  },
  // 当前播放音乐id
  setPlayMusicId(state, playMusicId) {
    state.playMusicId = playMusicId as number;
    localStorage.setItem('playMusicId', JSON.stringify(playMusicId));
  },
  // 当前播放音乐数据
  setPlayMusicItem(state, musicItem) {
    state.playMusicItem = musicItem as PlayMusicItem;
    localStorage.setItem('playMusicItem', JSON.stringify(musicItem));
  },
  // 播放列表数据
  setPlayMusicList(state, musicItem) {
    // 数据去重
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex(
      (item: PlayMusicItem) => item.id === (musicItem as PlayMusicItem).id
    );
    // 数据替换
    if (index !== -1) {
      list.splice(index, 1, musicItem);
    }
    // 新数据添加
    if (index === -1) {
      list.push(musicItem);
    }
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicList', JSON.stringify(list));
  },
  // 当前播放音乐进度数据
  setMusicPlayProgress(state, playProgress) {
    const musicPlayProgress = JSON.parse(
      JSON.stringify(state.musicPlayProgress)
    );
    const progress = Object.assign(musicPlayProgress, playProgress);
    state.musicPlayProgress = progress as unknown;
  },
  // 音乐播放状态
  setMusicPlayStatus(state, playStatus) {
    const musicPlayStatus = JSON.parse(JSON.stringify(state.musicPlayStatus));
    const status = Object.assign(musicPlayStatus, playStatus);
    state.musicPlayStatus = status as unknown;
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
  // 播放器 - 清空播放列表数据
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
    const index = list.findIndex((item: LoopType) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicList', JSON.stringify(list));
  }
};

export default mutations;
