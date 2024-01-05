import type { MusicItemType } from '@/hooks/songFormat';

export type State = {
  playSongId: number;
  playSongItem: MusicItemType;
  songPlaylist: MusicItemType[];
  songPlayProgress: SongPlayProgress;
  songPlayStatus: MusicPlayStatus;
  musicAudioLock: boolean;
  musicModeType: number;
  musicVolume: number;
};

export type SongPlayProgress = {
  progress?: number;
  currentTime?: number;
  duration?: number;
  cacheProgress?: number;
  timeChange?: boolean;
};

export type MusicPlayStatus = {
  look?: boolean;
  loading?: boolean;
  refresh?: boolean;
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
  songPlaylist: faultTolerant('songPlaylist') || [], // 播放列表
  songPlayProgress: {
    progress: 0,
    currentTime: 0,
    duration: 0,
    cacheProgress: 0
  }, // 播放进度
  songPlayStatus: {
    look: false,
    loading: false,
    refresh: false
  }, // 播放状态
  musicAudioLock: faultTolerant('musicAudioLock') || false, // 播放器锁定
  musicModeType: Number(localStorage.getItem('musicModeType')) || 0, // 播放模式
  musicVolume: Number(localStorage.getItem('musicVolume')) || 1 // 音量
};

export default state;
