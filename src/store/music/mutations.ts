import type {
  State,
  SongPlayProgress,
  MusicPlayStatus
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
  // 播放器锁定
  setMsicAudioLock(state, musicAudioLock: boolean) {
    state.musicAudioLock = musicAudioLock;
    localStorage.setItem('musicAudioLock', JSON.stringify(musicAudioLock));
  },
  // 播放模式
  setMusicModeType(state, modeType: number) {
    state.musicModeType = modeType;
    localStorage.setItem('musicModeType', JSON.stringify(modeType));
  },
  // 音量
  setMusicVolume(state, musicVolume: number) {
    state.musicVolume = musicVolume;
    localStorage.setItem('musicVolume', JSON.stringify(musicVolume));
  },
  // 清空播放列表
  emptySongPlaylist(state) {
    state.songPlaylist = [];
    localStorage.setItem('songPlaylist', '[]');
    // 清除本地播放数据(清除后刷新)
    localStorage.setItem('playSongId', '');
    localStorage.setItem('playSongItem', '');
  }
};

export default mutations;
