import { ref, computed } from 'vue';
import store from '@/store';
import useFormatSong from '@/hooks/useFormatSong';
import { toRawType } from '@/utils/tool';
import type { SongType, MusicItemType } from '@/hooks/useFormatSong';

/**
 * @description 歌曲添加到播放列表
 * @param { (Array | Object) } songs - 歌曲数据
 * @param { Object } options
 * @param { boolean } [options.clear] - 是否清空播放列表
 */
function useSongAddPlaylist(songs: Array<SongType> | SongType, options?: { clear: boolean }): void {
  if (toRawType(songs) !== 'Object' && toRawType(songs) !== 'Array') {
    throw new Error('添加的歌曲数据类型错误!');
  }

  const musicList = ref<MusicItemType[]>([]);

  if (toRawType(songs) === 'Object') {
    const musicItem: MusicItemType = useFormatSong(songs as SongType);
    musicList.value.push(musicItem);
  }
  if (toRawType(songs) === 'Array' && songs instanceof Array) {
    songs.forEach?.((item: SongType) => {
      const musicItem: MusicItemType = useFormatSong(item);
      musicList.value.push(musicItem);
    });
  }

  if (options?.clear) {
    store.commit('music/setSongPlaylist', musicList.value);
    return;
  }

  // 去重
  const songPlaylist = computed<MusicItemType[]>(() => store.getters['music/songPlaylist']);
  songPlaylist.value.forEach?.((item: MusicItemType) => {
    const index = musicList.value.findIndex?.((val: MusicItemType) => item.id === val.id);
    if (index !== -1) {
      return;
    }

    musicList.value.splice?.(index, 1);
  });

  store.commit('music/setSongPlaylist', [...songPlaylist.value, ...musicList.value]);
}

export default useSongAddPlaylist;
