import type { PlayMusicItem } from '@store/music/state';

export type SongType = {
  id: number;
  name: string;
  al: {
    picUrl: string;
  };
  album: {
    picUrl: string;
  };
  radio: {
    picUrl: string;
  };
  img80x80: string;
  dt: number;
  duration: number;
  mv: number;
  ar: {
    id: number;
    name: string;
  }[];
  artists: {
    id: number;
    name: string;
  }[];
};

/**
 * @description 歌曲数据处理成音乐播放器所需数据
 * @param { Object } song 歌曲数据
 */
export function handleAudioSong<T extends Partial<SongType>>(
  song: T
): PlayMusicItem {
  const musicItem: PlayMusicItem = {
    id: song?.id || 0,
    name: song?.name || '',
    picUrl:
      song?.al?.picUrl ||
      song?.album?.picUrl ||
      song?.img80x80 ||
      song?.radio?.picUrl ||
      '',
    time: song?.dt || song?.duration || 0,
    mv: song?.mv || 0,
    singerList: []
  };

  const artists = song?.ar || song?.artists || [];

  artists.forEach((item: { id: number; name: string }) => {
    musicItem.singerList.push({
      id: item.id,
      name: item.name
    });
  });

  return musicItem;
}
