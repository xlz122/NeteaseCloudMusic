import type { MusicItemType } from '@/hooks/useFormatSong';

export type State = {
  playSongId: number | undefined;
  playSongItem: MusicItemType;
  songPlaylist: MusicItemType[];
  playSongRefresh: boolean;
  audioPlayerLock: boolean;
};

const state: State = {
  playSongId: getLocalStorage('playSongId', 0), // 当前播放歌曲id
  playSongItem: getLocalStorage('playSongItem', {}), // 当前播放歌曲
  playSongRefresh: false, // 播放歌曲刷新
  songPlaylist: getLocalStorage('songPlaylist', []), // 播放列表
  audioPlayerLock: getLocalStorage('audioPlayerLock', false) // 播放器锁定
};

function getLocalStorage(key: string, defaultValue: unknown) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '');
  } catch {
    return defaultValue;
  }
}

export default state;
