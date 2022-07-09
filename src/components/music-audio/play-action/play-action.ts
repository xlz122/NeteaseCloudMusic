import store from '@store/index';
import type { PlayMusicItem } from '@store/music/state';

const audio = {
  timer: 0,
  storage: false,
  look: false
};

/**
 * @description 播放上一首歌曲
 */
export async function playPrevMusic(): Promise<boolean | undefined> {
  const playMusicId = store.getters['music/playMusicId'];
  const playMusicList = store.getters['music/playMusicList'];

  // 存储播放状态
  if (!audio.storage) {
    audio.storage = true;
    audio.look = store.getters['music/musicPlayStatus'].look;
  }

  if (playMusicList.length === 0) {
    return false;
  }

  // 重置播放状态
  store.commit('music/setMusicPlayStatus', {
    look: false,
    loading: true
  });
  // 重置播放进度
  store.commit('music/setMusicPlayProgress', {
    progress: 0,
    currentTime: 0,
    duration: 0
  });

  // 获取当前id索引
  const index: number = playMusicList.findIndex(
    (item: PlayMusicItem) => item.id === playMusicId
  );

  let id = 0;
  // 播放数据不在播放列表（清空播放列表后，重新添加出现这种情况）,播放最后一项
  if (index === -1) {
    id = playMusicList.at(-1).id;
  }

  // 播放数据在播放列表
  if (index !== -1) {
    // 不是第一项
    if (index > 0) {
      id = playMusicList[index - 1].id;
    }
    // 列表回到最后一项
    if (index === 0) {
      id = playMusicList.at(-1).id;
    }
  }

  // 随机播放
  const musicModeType = store.getters['music/musicModeType'];
  if (musicModeType === 2) {
    id = await getRandomPlayId(playMusicList);
  }

  // 当前播放音乐
  const musicItem = playMusicList.find((item: PlayMusicItem) => item.id === id);
  store.commit('music/setPlayMusicItem', musicItem);

  // 停止切换后开始播放
  if (audio.timer) {
    clearTimeout(audio.timer);
  }
  audio.timer = setTimeout(() => {
    audio.storage = false;

    store.commit('music/setMusicPlayStatus', {
      look: audio.look,
      loading: false,
      refresh: true
    });
  }, 1000);
}

/**
 * @description 播放下一首歌曲
 */
export async function playNextMusic(): Promise<boolean | undefined> {
  const playMusicId = store.getters['music/playMusicId'];
  const playMusicList = store.getters['music/playMusicList'];

  // 存储播放状态
  if (!audio.storage) {
    audio.storage = true;
    audio.look = store.getters['music/musicPlayStatus'].look;
  }

  if (playMusicList.length === 0) {
    return false;
  }

  // 重置播放状态
  store.commit('music/setMusicPlayStatus', {
    look: false,
    loading: true
  });
  // 重置播放进度
  store.commit('music/setMusicPlayProgress', {
    progress: 0,
    currentTime: 0,
    duration: 0
  });

  // 获取当前id索引
  const index: number = playMusicList.findIndex(
    (item: PlayMusicItem) => item.id === playMusicId
  );

  let id = 0;
  // 播放数据不在播放列表（清空播放列表后，重新添加出现这种情况）,播放第一项
  if (index === -1) {
    id = playMusicList[0].id;
  }

  // 播放数据在播放列表
  if (index !== -1) {
    // 不是最后一项
    if (index < playMusicList.length - 1) {
      id = playMusicList[index + 1].id;
    }
    // 列表回到第一项
    if (index !== -1 && index === playMusicList.length - 1) {
      id = playMusicList[0].id;
    }
  }

  // 随机播放
  const musicModeType = store.getters['music/musicModeType'];
  if (musicModeType === 2) {
    id = await getRandomPlayId(playMusicList);
  }

  // 当前播放音乐
  const musicItem = playMusicList.find((item: PlayMusicItem) => item.id === id);
  store.commit('music/setPlayMusicItem', musicItem);

  // 停止切换后开始播放
  if (audio.timer) {
    clearTimeout(audio.timer);
  }
  audio.timer = setTimeout(() => {
    audio.storage = false;

    store.commit('music/setMusicPlayStatus', {
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
function getRandomPlayId(list: PlayMusicItem[]): Promise<number> {
  return new Promise(resolve => {
    // 缓存当前播放
    const playMusicId = store.getters['music/playMusicId'];
    if (!cacheId.includes(playMusicId)) {
      cacheId.push(playMusicId);
    }

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
    if (list.length > 5 && cacheId.length > 5) {
      cacheId.splice(0, 1);
      cacheId.push(playId);
    }
    if (list.length > 5 && cacheId.length <= 5) {
      cacheId.push(playId);
    }

    resolve(cacheId[cacheId.length - 1]);
  });
}
