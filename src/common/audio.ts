import type { PlayMusicItem } from '@store/music/state';
import { toRawType } from '@utils/tool';

export type SongType = {
  id: number;
  name: string;
  al: {
    picUrl: string;
  };
  album: {
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
export function handleAudioSong(song: Partial<SongType>): PlayMusicItem {
  if (toRawType(song) !== 'Object') {
    throw new Error('添加的歌曲数据类型错误');
  }

  const musicItem: PlayMusicItem = {
    id: song?.id || 0,
    name: song?.name || '',
    picUrl: song?.al?.picUrl || song?.album?.picUrl || song?.img80x80 || '',
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

  // 播放器数据直接返回
  const keys1 = Object.keys(musicItem);
  const keys2 = Object.keys(song);

  const isCongruence = keys1.every(val => keys2.includes(val));

  if (isCongruence) {
    return song as PlayMusicItem;
  }

  return musicItem;
}
