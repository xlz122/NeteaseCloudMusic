import { State, MusicDetailOptions } from '@store/music/state';
import { LoopType } from '@/types/types';

interface Mutations<T, U> {
  [key: string]: (state: T, payload: U) => void;
}

const mutations: Mutations<State, unknown> = {
  // 我的音乐 - 侧边歌单列表选中项id
  setActiveSongListId(state, activeSongListId) {
    state.activeSongListId = activeSongListId as number;
    localStorage.setItem('activeSongListId', JSON.stringify(activeSongListId));
  },
  // 我的音乐显示详情
  setMusicDetailOptions(state, musicDetailOptions) {
    state.musicDetailOptions = musicDetailOptions as MusicDetailOptions;
  },
  // 我的音乐 - 歌单详情数据
  setSongListDetailData(state, songListDetailData) {
    state.songListDetailData = songListDetailData as unknown;
    localStorage.setItem(
      'songListDetailData',
      JSON.stringify(songListDetailData)
    );
  },
  // 我的音乐 - 当前播放音乐id
  setCurPlayMusicId(state, curPlayMusicId) {
    state.curPlayMusicId = curPlayMusicId as number;
    localStorage.setItem('curPlayMusicId', JSON.stringify(curPlayMusicId));
  },
  // 我的音乐 - 当前播放音乐时间
  setMusicPlayTime(state, musicPlayTime) {
    state.musicPlayTime = musicPlayTime as number;
    localStorage.setItem('musicPlayTime', JSON.stringify(musicPlayTime));
  },
  // 我的音乐 - 音量控制
  setMusicVolume(state, musicVolume) {
    state.musicVolume = musicVolume as number;
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
  },
  // 我的音乐 - 音乐播放器锁定在底部
  setIsMysicAudioLock(state, isMysicAudioLock) {
    state.isMysicAudioLock = isMysicAudioLock as boolean;
    localStorage.setItem('isMysicAudioLock', JSON.stringify(isMysicAudioLock));
  },
  // 我的音乐 - 播放列表数据
  setPlayMusicList(state, playMusicData) {
    // 数据去重
    const list = JSON.parse(JSON.stringify(state.playMusicList));
    const index = list.findIndex(
      (item: LoopType) => item.id === (playMusicData as LoopType).id
    );
    // 数据替换
    if (index !== -1) {
      list.splice(index, 1, playMusicData);
    }
    // 新数据添加
    if (index === -1) {
      list.push(playMusicData);
    }
    // 保存数据
    state.playMusicList = list as unknown[];
    localStorage.setItem('playMusicData', JSON.stringify(list));
  },
  // 播放器 - 歌词
  setLyrics(state, playLyrics) {
    state.playLyrics = playLyrics as unknown[];
    localStorage.setItem('playLyrics', JSON.stringify(playLyrics));
  },
  // 播放器 - 清空播放列表数据
  emptyPlayMusicList(state) {
    state.playMusicList = [] as unknown[];
    localStorage.setItem('playMusicData', [] as never);
    // 清除歌词
    state.playLyrics = [] as unknown[];
    localStorage.setItem('playLyrics', [] as never);
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
    localStorage.setItem('playMusicData', JSON.stringify(list));
  }
};

export default mutations;
