export interface State {
  activeSongListId: number;
  musicDetailOptions: MusicDetailOptions;
  songListDetailData: unknown;
  curPlayMusicId: number;
  curPlayMusicData: unknown;
  musicPlayTime: number;
  musicVolume: number;
  isMysicAudioLock: boolean;
  playMusicList: unknown;
}

export interface MusicDetailOptions {
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
    myMv: false,
    playListDetail: false
  }, // 我的音乐 - 详情显示
  songListDetailData: faultTolerant('songListDetailData') || {}, // 我的音乐 - 歌单详情数据
  curPlayMusicId: faultTolerant('curPlayMusicId') || 0, // 我的音乐 - 当前播放音乐id
  curPlayMusicData: faultTolerant('curPlayMusicData') || 0, // 我的音乐 - 当前播放音乐详细数据
  musicPlayTime: faultTolerant('musicPlayTime') || 0, // 我的音乐 - 当前播放音乐时间
  musicVolume: faultTolerant('musicVolume') || 0.5, // 我的音乐 - 音量
  isMysicAudioLock: faultTolerant('isMysicAudioLock') || false, // 我的音乐 - 音乐播放器锁定在底部
  playMusicList: faultTolerant('playMusicData') || [] // 我的音乐 - 播放列表数据
};

export default state;
