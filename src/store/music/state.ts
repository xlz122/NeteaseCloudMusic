export interface State {
  activeSongListId: number;
  musicDetailOptions: MusicDetailOptions;
  songListDetailData: unknown;
  musicAudioLock: boolean;
  playMusicId: number;
  playMusicList: unknown;
  playMusicItem: unknown;
  musicPlayProgress: unknown;
  musicPlayStatus: unknown;
  musicModeType: number;
  musicVolume: number;
  playLyrics: unknown;
}

export interface MusicDetailOptions {
  subPlayList: boolean;
  myMv: boolean;
  playListDetail: boolean;
}

// 本地存储容错处理
function faultTolerant(name: string) {
  if (localStorage.getItem(name) as string) {
    return JSON.parse(localStorage.getItem(name) as string);
  }
}

const state: State = {
  activeSongListId: faultTolerant('activeSongListId') || 0, // 我的音乐 - 侧边歌单列表选中项id
  musicDetailOptions: {
    subPlayList: false,
    myMv: false,
    playListDetail: false
  }, // 我的音乐 - 详情显示
  songListDetailData: faultTolerant('songListDetailData') || {}, // 我的音乐 - 歌单详情数据
  musicAudioLock: faultTolerant('musicAudioLock') || false, // 播放器锁定在底部
  playMusicId: Number(localStorage.getItem('playMusicId')) || 0, // 当前播放音乐id
  playMusicItem: faultTolerant('playMusicItem') || {}, // 当前播放音乐数据
  playMusicList: faultTolerant('playMusicList') || [], // 播放列表数据
  musicPlayProgress: {}, // 当前播放音乐进度数据
  musicPlayStatus: {
    look: false,
    loading: false,
    refresh: false
  }, // 我的音乐 - 播放状态
  musicModeType: Number(localStorage.getItem('musicModeType')) || 0, // 我的音乐 - 播放模式
  musicVolume: Number(localStorage.getItem('musicVolume')) || 1, // 我的音乐 - 音量
  playLyrics: faultTolerant('playLyrics') || [] // 我的音乐 - 播放歌词
};

export default state;
