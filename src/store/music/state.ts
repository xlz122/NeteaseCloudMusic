import type { MusicItemType } from '@/hooks/methods/songFormat';

export type State = {
  playSongId: number;
  playSongItem: MusicItemType;
  songPlaylist: MusicItemType[];
  playSongRefresh: boolean;
  audioPlayerLock: boolean;
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name) || '');
  }
}

const state: State = {
  playSongId: Number(localStorage.getItem('playSongId')) || 0, // 当前播放歌曲id
  playSongItem: faultTolerant('playSongItem') || {}, // 当前播放歌曲
  playSongRefresh: false, // 播放歌曲刷新
  songPlaylist: faultTolerant('songPlaylist') || [], // 播放列表
  audioPlayerLock: faultTolerant('audioPlayerLock') || false // 播放器锁定
};

export default state;
