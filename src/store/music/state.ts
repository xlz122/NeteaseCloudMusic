export interface State {
  activeSongListId: number;
  musicDetailOptions: MusicDetailOptions;
  songListDetailData: unknown;
  curPlayMusicId: number;
  musicPlayProgress: number;
  musicVolume: number;
  isMysicAudioLock: boolean;
  playMusicList: unknown[];
}

export interface MusicDetailOptions {
  myMv: boolean;
  playListDetail: boolean;
}

const state: State = {
  activeSongListId:
    JSON.parse(localStorage.getItem('activeSongListId') as string) || 0, // 我的音乐 - 侧边歌单列表选中项id
  musicDetailOptions: {
    myMv: false,
    playListDetail: false
  }, // 我的音乐 - 详情显示
  songListDetailData:
    JSON.parse(localStorage.getItem('songListDetailData') as string) || {}, // 我的音乐 - 歌单详情数据
  curPlayMusicId:
    JSON.parse(localStorage.getItem('curPlayMusicId') as string) || 0, // 我的音乐 - 当前播放音乐id
  musicPlayProgress:
    JSON.parse(localStorage.getItem('musicPlayProgress') as string) || 0, // 我的音乐 - 当前播放音乐进度
  musicVolume: JSON.parse(localStorage.getItem('musicVolume') as string) || 0.5, // 我的音乐 - 音量
  isMysicAudioLock:
    JSON.parse(localStorage.getItem('isMysicAudioLock') as string) || false, // 我的音乐 - 音乐播放器锁定在底部
  playMusicList:
    JSON.parse(localStorage.getItem('playMusicData') as string) || [] // 我的音乐 - 播放列表数据
};

export default state;
