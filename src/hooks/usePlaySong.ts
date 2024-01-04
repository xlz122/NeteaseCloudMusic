import { ref, computed } from 'vue';
import store from '@/store/index';
import { toRawType } from '@/utils/tool';
import useSongFormat from '@/hooks/songFormat';
import type { SongType, MusicItemType } from '@/hooks/songFormat';

/**
 * @description 播放歌曲
 * @param { Object } song - 歌曲数据
 */
function usePlaySong(song: SongType): void {
  if (toRawType(song) !== 'Object') {
    throw new Error('播放歌曲数据类型错误!');
  }

  const musicItem: MusicItemType = useSongFormat(song);

  const playSongItem = computed<MusicItemType>(
    () => store.getters['music/playSongItem']
  );

  const songPlayStatus = ref({
    look: true,
    loading: true,
    refresh: true
  });

  if (playSongItem?.value?.id === musicItem?.id) {
    songPlayStatus.value.loading = false;
    songPlayStatus.value.refresh = false;
  }

  store.commit('music/setPlaySongItem', musicItem);
  store.commit('music/setSongPlayStatus', songPlayStatus.value);
}

export default usePlaySong;
