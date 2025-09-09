import store from '@/store';
import useFormatSong from '@/hooks/useFormatSong';
import { toRawType } from '@/utils/tool';
import type { SongType, MusicItemType } from '@/hooks/useFormatSong';

/**
 * @description 播放歌曲
 * @param { Object } song - 歌曲数据
 */
function usePlaySong(song: SongType): void {
  if (toRawType(song) !== 'Object') {
    throw new Error('播放歌曲数据类型错误!');
  }

  const musicItem: MusicItemType = useFormatSong(song);

  store.commit('music/setPlaySongItem', musicItem);
  store.commit('music/setPlaySongRefresh', true);
}

export default usePlaySong;
