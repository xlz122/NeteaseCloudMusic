export type State = {
  musicDetailOptions: MusicDetailOptions;
  songSheetId: number;
  songSheetDetail: unknown;
  playMusicId: number;
  playMusicList: unknown;
  playMusicItem: PlayMusicItem;
  musicPlayProgress: unknown;
  musicPlayStatus: unknown;
  musicAudioLock: boolean;
  musicModeType: number;
  musicVolume: number;
  playLyrics: unknown;
};

export type MusicDetailOptions = {
  subPlayList: boolean;
  myMv: boolean;
  playListDetail: boolean;
};

export type PlayMusicItem = {
  id: number;
  name: string;
  picUrl: string;
  time: number;
  mv: number;
  singerList: {
    id: string;
    name: string;
  }[];
};

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  musicDetailOptions: {
    subPlayList: false,
    myMv: false,
    playListDetail: false
  }, // 我的音乐 - 详情显示
  songSheetId: Number(localStorage.getItem('songSheetId')) || 0, // 歌单id
  songSheetDetail: faultTolerant('songSheetDetail') || {}, // 歌单详情数据
  playMusicId: Number(localStorage.getItem('playMusicId')) || 0, // 当前播放音乐id
  playMusicItem: faultTolerant('playMusicItem') || {}, // 当前播放音乐数据
  playMusicList: faultTolerant('playMusicList') || [], // 播放列表数据
  musicPlayProgress: {}, // 当前播放音乐进度数据
  musicPlayStatus: {
    look: false,
    loading: false,
    refresh: false
  }, // 我的音乐 - 播放状态
  musicAudioLock: faultTolerant('musicAudioLock') || false, // 播放器锁定在底部
  musicModeType: Number(localStorage.getItem('musicModeType')) || 0, // 播放器 - 播放模式
  musicVolume: Number(localStorage.getItem('musicVolume')) || 1, // 播放器 - 音量
  playLyrics: faultTolerant('playLyrics') || [] // 播放器 - 播放歌词
};

export default state;
