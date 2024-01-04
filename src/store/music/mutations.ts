import type {
  State,
  SongPlayProgress,
  MusicPlayStatus,
  PlayLyrics
} from '@/store/music/state';
import type { MusicItemType } from '@/hooks/songFormat';

type Mutations<T, U = any> = {
  [key: string]: (state: T, payload: U) => void;
};

const mutations: Mutations<State> = {
  // 当前播放
  setPlaySongItem(state, song: MusicItemType) {
    state.playSongId = song.id;
    localStorage.setItem('playSongId', JSON.stringify(song.id));

    state.playSongItem = song;
    localStorage.setItem('playSongItem', JSON.stringify(song));
  },
  // 播放列表
  setSongPlaylist(state, songs) {
    state.songPlaylist = songs;
    localStorage.setItem('songPlaylist', JSON.stringify(songs));
  },
  // 播放进度
  setSongPlayProgress(state, playProgress: SongPlayProgress) {
    const songPlayProgress = JSON.parse(JSON.stringify(state.songPlayProgress));
    const progress = Object.assign(songPlayProgress, playProgress);
    state.songPlayProgress = progress;
  },
  // 播放状态
  setSongPlayStatus(state, playStatus: MusicPlayStatus) {
    const keys = Object.keys(playStatus);

    for (const key of keys) {
      // eslint-disable-next-line
      state.songPlayStatus[key as keyof typeof state.songPlayStatus] = playStatus[key as keyof typeof playStatus];
    }
  },
  // 播放器锁定在底部
  setMsicAudioLock(state, musicAudioLock: boolean) {
    state.musicAudioLock = musicAudioLock;
    localStorage.setItem('musicAudioLock', JSON.stringify(musicAudioLock));
  },
  // 播放模式
  setMusicModeType(state, modeType: number) {
    state.musicModeType = modeType;
    localStorage.setItem('musicModeType', JSON.stringify(modeType));
  },
  // 音量控制
  setMusicVolume(state, musicVolume: number) {
    state.musicVolume = musicVolume;
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
  },
  // 播放器 - 歌词
  setLyrics(state, playLyrics: PlayLyrics[]) {
    state.playLyrics = playLyrics;
    localStorage.setItem('playLyrics', JSON.stringify(playLyrics));
  },
  // 播放器 - 清空播放列表
  emptyPlayMusicList(state) {
    state.songPlaylist = [];
    localStorage.setItem('songPlaylist', '[]');
    // 清除歌词
    state.playLyrics = [];
    localStorage.setItem('playLyrics', '[]');
    // 清除本地当前播放数据(清除后刷新)
    localStorage.setItem('playSongId', '');
    localStorage.setItem('playSongItem', '');
  },
  // 播放器 - 删除播放列表单项数据
  deletePlayMusicList(state, id: number) {
    // 查找索引
    const list = JSON.parse(JSON.stringify(state.songPlaylist));
    const index = list.findIndex((item: MusicItemType) => item.id === id);
    if (index !== -1) {
      list.splice(index, 1);
    }
    // 保存数据
    state.songPlaylist = list;
    localStorage.setItem('songPlaylist', JSON.stringify(list));
  }
};

export default mutations;
