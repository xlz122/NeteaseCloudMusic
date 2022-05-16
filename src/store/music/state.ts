export type State = {
  playMusicId: number;
  playMusicList: unknown[];
  playMusicItem: PlayMusicItem;
  musicPlayProgress: unknown;
  musicPlayStatus: unknown;
  musicAudioLock: boolean;
  musicModeType: number;
  musicVolume: number;
  playLyrics: unknown;
};

export type PlayMusicItem = {
  id: number; // 歌曲id
  name: string; // 歌手name
  picUrl: string; // 头像
  time: number; // 时长
  mv: number; // mv数量
  singerList: {
    id: string; // 歌手id
    name: string; // 歌手name
  }[];
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  playMusicId: Number(localStorage.getItem('playMusicId')) || 0, // 当前播放音乐id
  playMusicItem: faultTolerant('playMusicItem') || {}, // 当前播放音乐
  playMusicList: faultTolerant('playMusicList') || [], // 播放列表
  musicPlayProgress: {}, // 当前播放音乐进度数据
  musicPlayStatus: {
    look: false,
    loading: false,
    refresh: false
  }, // 当前播放音乐播放状态
  musicAudioLock: faultTolerant('musicAudioLock') || false, // 播放器锁定在底部
  musicModeType: Number(localStorage.getItem('musicModeType')) || 0, // 播放器 - 播放模式
  musicVolume: Number(localStorage.getItem('musicVolume')) || 1, // 播放器 - 音量
  playLyrics: faultTolerant('playLyrics') || [] // 播放器 - 播放歌词
};

export default state;
