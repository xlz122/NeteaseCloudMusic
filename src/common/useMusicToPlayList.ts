import { computed } from 'vue';
import store from '@store/index';
import lodash from 'lodash';
import { handleAudioSong } from '@/common/audio';
import { toRawType } from '@utils/tool';
import type { SongType } from '@/common/audio';
import type { PlayMusicItem } from '@store/music/state';

type UseMusicToPlayList = {
  music:
    | Partial<SongType>
    | Partial<SongType>[]
    | PlayMusicItem
    | PlayMusicItem[];
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

  // 处理成播放器所需数据
  if (toRawType(music) === 'Object') {
    const song =
      'singerList' in music
        ? music
        : handleAudioSong(music as Partial<SongType>);

    list.push(song);
  }
  if (toRawType(music) === 'Array') {
    (music as SongType[] | PlayMusicItem[]).forEach(item => {
      const song = 'singerList' in item ? item : handleAudioSong(item);

      list.push(song);
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
