import type { ResponseType } from '@/types/types';
import type { PlayMusicItem } from '@store/music/state';
import { toRawType } from '@utils/tool';

/**
 * @description 歌曲数据处理成音乐播放器所需数据
 * @param { Object } song 歌曲数据
 */
export function handleAudioSong(song: ResponseType): PlayMusicItem {
  if (toRawType(song) !== 'Object') {
    throw new Error('添加的歌曲数据类型错误');
  }

  const musicItem: PlayMusicItem = {
    id: song?.id,
    name: song?.name,
    picUrl: song?.al?.picUrl || song?.album?.picUrl || song?.img80x80,
    time: song?.dt || song?.duration,
    mv: song?.mv,
    singerList: []
  };

  const artists = song?.ar || song?.artists;

  artists.forEach((item: { id: number; name: string }) => {
    musicItem.singerList.push({
      id: item.id,
      name: item.name
    });
  });

  return musicItem;
}
