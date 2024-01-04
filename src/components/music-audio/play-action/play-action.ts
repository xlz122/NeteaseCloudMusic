import store from '@/store/index';
import type { MusicItemType } from '@/hooks/songFormat';

type AudioType = {
  timer: NodeJS.Timeout | null;
  storage: boolean;
  look: boolean;
};

const audio: AudioType = {
  timer: null,
  storage: false,
  look: false
};

/**
 * @description 播放上一首歌曲
 */
export async function playPrevSong(): Promise<boolean | undefined> {
  const playSongId = store.getters['music/playSongId'];
  const songPlaylist = store.getters['music/songPlaylist'];

  if (songPlaylist.length === 0) {
    return;
  }

  // 存储播放状态
  if (!audio.storage) {
    audio.storage = true;
    audio.look = store.getters['music/songPlayStatus'].look;
  }

  // 重置播放状态
  store.commit('music/setSongPlayStatus', {
    look: false,
    loading: true
  });
  // 重置播放进度
  store.commit('music/setSongPlayProgress', {
    progress: 0,
    currentTime: 0,
    duration: 0
  });

  // 获取当前id索引
  const index: number = songPlaylist.findIndex(
    (item: MusicItemType) => item.id === playSongId
  );

  let id = 0;
  // 播放数据不在播放列表（清空播放列表后，重新添加出现这种情况）,播放最后一项
  if (index === -1) {
    id = songPlaylist.at(-1).id;
  }

  // 播放数据在播放列表
  if (index !== -1) {
    // 不是第一项
    if (index > 0) {
      id = songPlaylist[index - 1].id;
    }
    // 列表回到最后一项
    if (index === 0) {
      id = songPlaylist.at(-1).id;
    }
  }

  // 随机播放
  const musicModeType = store.getters['music/musicModeType'];
  if (musicModeType === 2) {
    id = await getRandomPlayId(songPlaylist);
  }

  // 当前播放歌曲
  const musicItem = songPlaylist.find((item: MusicItemType) => item.id === id);
  store.commit('music/setPlaySongItem', musicItem);

  // 停止切换后开始播放
  if (audio.timer) {
    clearTimeout(audio.timer);
  }
  audio.timer = setTimeout(() => {
    audio.storage = false;

    store.commit('music/setSongPlayStatus', {
      look: audio.look,
      loading: false,
      refresh: true
    });
  }, 1000);
}

/**
 * @description 播放下一首歌曲
 */
export async function playNextSong(): Promise<boolean | undefined> {
  const playSongId = store.getters['music/playSongId'];
  const songPlaylist = store.getters['music/songPlaylist'];

  if (songPlaylist.length === 0) {
    return;
  }

  // 存储播放状态
  if (!audio.storage) {
    audio.storage = true;
    audio.look = store.getters['music/songPlayStatus'].look;
  }

  // 重置播放状态
  store.commit('music/setSongPlayStatus', {
    look: false,
    loading: true
  });
  // 重置播放进度
  store.commit('music/setSongPlayProgress', {
    progress: 0,
    currentTime: 0,
    duration: 0
  });

  // 获取当前id索引
  const index: number = songPlaylist.findIndex(
    (item: MusicItemType) => item.id === playSongId
  );

  let id = 0;
  // 播放数据不在播放列表（清空播放列表后，重新添加出现这种情况）,播放第一项
  if (index === -1) {
    id = songPlaylist[0].id;
  }

  // 播放数据在播放列表
  if (index !== -1) {
    // 不是最后一项
    if (index < songPlaylist.length - 1) {
      id = songPlaylist[index + 1].id;
    }
    // 列表回到第一项
    if (index !== -1 && index === songPlaylist.length - 1) {
      id = songPlaylist[0].id;
    }
  }

  // 随机播放
  const musicModeType = store.getters['music/musicModeType'];
  if (musicModeType === 2) {
    id = await getRandomPlayId(songPlaylist);
  }

  // 当前播放歌曲
  const musicItem = songPlaylist.find((item: MusicItemType) => item.id === id);
  store.commit('music/setPlaySongItem', musicItem);

  // 停止切换后开始播放
  if (audio.timer) {
    clearTimeout(audio.timer);
  }
  audio.timer = setTimeout(() => {
    audio.storage = false;

    store.commit('music/setSongPlayStatus', {
      look: audio.look,
      loading: false,
      refresh: true
    });
  }, 1000);
}

const cacheId: number[] = [];

/**
 * @description 获取随机播放id
 * @param { Array } list 播放列表
 */
function getRandomPlayId(list: MusicItemType[]): Promise<number> {
  return new Promise(resolve => {
    // 缓存当前播放
    const playSongId = store.getters['music/playSongId'];
    if (!cacheId.includes(playSongId)) {
      cacheId.push(playSongId);
    }

    // 删除不在播放列表的缓存id
    const songPlaylist = store.getters['music/songPlaylist'];
    cacheId.forEach((item: number, index: number) => {
      const exist = songPlaylist.find((p: MusicItemType) => p.id === item);

      if (!exist) {
        cacheId.splice(index, 1);
      }
    });

    // 筛选缓存数组
    const filterMusic = list.filter(item => !cacheId.includes(item.id));

    // 随机id
    const musicId = filterMusic.map(item => item.id);
    const playId: number = musicId[Math.floor(Math.random() * musicId.length)];

    // 歌曲列表小于5项，缓存数比列表数少一
    if (list.length <= 5 && cacheId.length === list.length - 1) {
      cacheId.splice(0, 1);
      cacheId.push(playId);
    }
    if (list.length <= 5 && cacheId.length < list.length - 1) {
      cacheId.push(playId);
    }

    // 歌曲列表大于5项，最大缓存5项
    if (list.length > 5 && cacheId.length >= 5) {
      cacheId.splice(0, 1);
      cacheId.push(playId);
    }
    if (list.length > 5 && cacheId.length < 5) {
      cacheId.push(playId);
    }

    resolve(cacheId[cacheId.length - 1]);
  });
}
