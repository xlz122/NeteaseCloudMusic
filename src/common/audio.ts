import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';

/**
 * @description 歌曲数据处理成音乐播放器所需数据
 * @param { Array | Object } songs 歌曲数据
 */

export function handleAudioSongs(songs: ResponseType): PlayMusicItem[] {
  const audioSongs: PlayMusicItem[] = [];

  songs.forEach((item: ResponseType) => {
    const musicItem: PlayMusicItem = {
      id: item.id,
      name: item.name,
      picUrl: item.al.picUrl,
      time: item.dt,
      mv: item.mv,
      singerList: []
    };

    item?.ar?.forEach((item: LoopType) => {
      musicItem.singerList.push({
        id: item.id,
        name: item.name
      });
    });

    audioSongs.push(musicItem);
  });

  return audioSongs;
}
