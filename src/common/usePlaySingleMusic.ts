import { reactive, computed } from 'vue';
import store from '@store/index';
import { handleAudioSong } from '@/common/audio';
import { toRawType } from '@utils/tool';
import useMusicToPlayList from '@/common/useMusicToPlayList';
import type { SongType } from '@/common/audio';
import type { PlayMusicItem, MusicPlayStatus } from '@store/music/state';

/**
 * @description 播放单个歌曲
 * @param { Object } music 歌曲数据
 */
function usePlaySingleMusic<T extends PlayMusicItem | Partial<SongType>>(
  music: T
): void {
  if (toRawType(music) !== 'Object') {
    throw new Error('播放所需数据类型错误');
  }

  const musicItem: PlayMusicItem =
    'singerList' in music ? music : handleAudioSong(music);

  const playMusicItem = computed<PlayMusicItem>(
    () => store.getters['music/playMusicItem']
  );

  const playStatus: MusicPlayStatus = reactive({
    look: true,
    loading: true,
    refresh: true
  });

  if (playMusicItem?.value?.id === musicItem?.id) {
    playStatus.loading = false;
    playStatus.refresh = false;
  }

  store.commit('music/setPlayMusicItem', musicItem);
  store.commit('music/setMusicPlayStatus', playStatus);
  useMusicToPlayList({ music: musicItem });
}

export default usePlaySingleMusic;
