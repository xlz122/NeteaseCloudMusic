import store from '@store/index';
import { getPlayMusicUrl } from '@api/my-music';
import type { ResponseType, LoopType } from '@/types/types';
import type { PlayMusicItem } from '@store/music/state';

/**
 * @description 获取音乐播放链接
 * @param { Number } id - 音乐id
 * @return { String } 音乐播放链接
 */
export function getMusicUrl(id: number): Promise<string> {
  return new Promise(resolve => {
    getPlayMusicUrl({ id })
      .then((res: ResponseType) => {
        if (res.code === 200) {
          if (!res?.data[0]?.url) {
            store.commit('setMessage', {
              type: 'error',
              title: '播放链接获取失败'
            });
            resolve('');
          }

          resolve(res.data[0].url);
        }
      })
      .catch(() => ({}));
  });
}

let timer: number | null = null;

/**
 * @description 上一首歌曲
 */
export async function getPrevMusicId(): Promise<boolean | undefined> {
  const playMusicId = store.getters['music/playMusicId'];
  const playMusicList = store.getters['music/playMusicList'];

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
    (item: LoopType) => item.id === playMusicId
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

  // 播放模式
  const musicModeType = store.getters['music/musicModeType'];
  // 随机播放
  if (musicModeType === 2) {
    id = await randomPlay(playMusicList);
  }

  // 当前播放音乐
  const musicItem = playMusicList.find((item: LoopType) => item.id === id);
  store.commit('music/setPlayMusicItem', musicItem);

  // 停止切换后开始播放
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    store.commit('music/setMusicPlayStatus', {
      look: true,
      loading: false,
      refresh: true
    });
  }, 1000);
}

/**
 * @description 下一首歌曲
 */
export async function getNextMusicId(): Promise<boolean | undefined> {
  const playMusicId = store.getters['music/playMusicId'];
  const playMusicList = store.getters['music/playMusicList'];

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
    (item: LoopType) => item.id === playMusicId
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

  // 播放模式
  const musicModeType = store.getters['music/musicModeType'];
  // 随机播放
  if (musicModeType === 2) {
    id = await randomPlay(playMusicList);
  }

  // 当前播放音乐
  const musicItem = playMusicList.find((item: LoopType) => item.id === id);
  store.commit('music/setPlayMusicItem', musicItem);

  // 停止切换后开始播放
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    store.commit('music/setMusicPlayStatus', {
      look: true,
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
export function randomPlay(list: PlayMusicItem[]): Promise<number> {
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
