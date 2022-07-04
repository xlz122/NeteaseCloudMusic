import { computed } from 'vue';
import store from '@store/index';
import lodash from 'lodash';
import { handleAudioSong } from '@/common/audio';
import { toRawType } from '@utils/tool';
import type { SongType } from '@/common/audio';
import type { PlayMusicItem } from '@store/music/state';

type UseMusicToPlayList = {
  music: Partial<SongType> | Partial<SongType>[];
  clear?: boolean;
};

/**
 * @description 音乐添加到播放列表(新数据往最后面添加)
 * @param { Object } - music: 音乐数据
 *                     clear 是否清空原播放列表
 */
function useMusicToPlayList({
  music,
  clear = false
}: UseMusicToPlayList): void {
  if (toRawType(music) !== 'Object' && toRawType(music) !== 'Array') {
    throw new Error('添加的播放数据类型错误');
  }

  const list: PlayMusicItem[] = [];

  if (toRawType(music) === 'Object') {
    list.push(handleAudioSong(music as SongType));
  }

  if (toRawType(music) === 'Array') {
    (music as SongType[]).forEach((item: SongType) => {
      list.push(handleAudioSong(item));
    });
  }

  const playMusicList = computed<PlayMusicItem[]>(
    () => store.getters['music/playMusicList']
  );

  const musicList = lodash.cloneDeep(playMusicList.value);

  list.forEach((item: PlayMusicItem) => {
    const index = musicList?.findIndex((f: PlayMusicItem) => f.id === item.id);

    if (index === -1) {
      musicList.push(item);
    }
  });

  if (clear) {
    store.commit('music/setPlayMusicList', list);
  } else {
    store.commit('music/setPlayMusicList', musicList);
  }
}

export default useMusicToPlayList;
