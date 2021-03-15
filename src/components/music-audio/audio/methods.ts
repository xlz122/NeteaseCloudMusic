import store from '@store/index';
import { getPlayMusicUrl } from '@api/my-music';
import { ResponseDataType, LoopType } from '@/types/types';

/**
 * @desc 获取音乐播放链接
 * @param { Number } id - 音乐id
 * @return { String } 音乐播放链接
 */
export function getMusicUrl(id: number): Promise<string> {
  return new Promise(resolve => {
    getPlayMusicUrl({ id }).then((res: ResponseDataType) => {
      if (res.code === 200) {
        resolve(res.data[0].url);
      }
    });
  });
}

/**
 * @desc 获取上一首歌曲id
 * @return { Number } 上一首歌曲id
 */
export function getPrevMusicId(): Promise<number> {
  return new Promise(resolve => {
    // 播放列表
    const playMusicList = store.getters['music/playMusicList'];

    // 当前播放音乐id
    const playMusicId = store.getters['music/playMusicId'];

    if (playMusicList.length === 0) {
      return false;
    }
    // 获取当前id索引
    const index: number = playMusicList.findIndex(
      (item: LoopType) => item.id === playMusicId
    );

    let id = 0;
    // 播放数据不在播放列表（清空播放列表后，重新添加出现这种情况）,播放最后一项
    if (index === -1) {
      id = playMusicList[playMusicList.length - 1].id;
    }

    // 播放数据在播放列表
    if (index !== -1) {
      // 不是第一项
      if (index > 0) {
        id = playMusicList[index - 1].id;
      }
      // 列表回到最后一项
      if (index === 0) {
        id = playMusicList[playMusicList.length - 1].id;
      }
    }
    // 当前播放音乐id
    store.commit('music/setPlayMusicId', id);
    // 当前播放音乐数据
    const musicItem = playMusicList.find((item: LoopType) => item.id === id);
    store.commit('music/setPlayMusicItem', musicItem);
    resolve(id);
  });
}

/**
 * @desc 获取下一首歌曲id
 * @return { Number } 上一首歌曲id
 */
export function getNextMusicId(): Promise<number> {
  return new Promise(resolve => {
    // 播放列表
    const playMusicList = store.getters['music/playMusicList'];

    // 当前播放音乐id
    const playMusicId = store.getters['music/playMusicId'];

    if (playMusicList.length === 0) {
      return false;
    }
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
    // 当前播放音乐id
    store.commit('music/setPlayMusicId', id);
    // 当前播放音乐数据
    const musicItem = playMusicList.find((item: LoopType) => item.id === id);
    store.commit('music/setPlayMusicItem', musicItem);
    resolve(id);
  });
}
