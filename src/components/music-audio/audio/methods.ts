import store from '@store/index';
import { getPlayMusicUrl } from '@api/my-music';
import { ResponseDataType, LoopType } from '@/types/types';

/**
 * @description 获取音乐播放链接
 * @param { Number } id - 音乐id
 * @return { String } 音乐播放链接
 */
export function getMusicUrl(id: number): Promise<string> {
  return new Promise(resolve => {
    getPlayMusicUrl({ id })
      .then((res: ResponseDataType) => {
        if (res.code === 200) {
          resolve(res.data[0].url);
        }
      })
      .catch(() => ({}));
  });
}

/**
 * @description 获取上一首歌曲id
 */
export function getPrevMusicId(): Promise<number> {
  return new Promise(resolve => {
    (async () => {
      const playMusicId = store.getters['music/playMusicId'];
      const playMusicList = store.getters['music/playMusicList'];

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

      // 播放模式
      const musicModeType = store.getters['music/musicModeType'];
      // 随机播放
      if (musicModeType === 2) {
        id = await randomPlay(playMusicList);
      }

      // 当前播放音乐数据
      const musicItem = playMusicList.find((item: LoopType) => item.id === id);
      store.commit('music/setPlayMusicItem', musicItem);
      resolve(id);
    })();
  });
}

/**
 * @description 获取下一首歌曲id
 */
export function getNextMusicId(): Promise<number> {
  return new Promise(resolve => {
    (async () => {
      const playMusicId = store.getters['music/playMusicId'];
      const playMusicList = store.getters['music/playMusicList'];

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

      // 播放模式
      const musicModeType = store.getters['music/musicModeType'];
      // 随机播放
      if (musicModeType === 2) {
        id = await randomPlay(playMusicList);
      }

      // 当前播放音乐数据
      const musicItem = playMusicList.find((item: LoopType) => item.id === id);
      store.commit('music/setPlayMusicItem', musicItem);
      resolve(id);
    })();
  });
}

const musicId: number[] = [];

/**
 * @description 获取随机播放id
 * @param { Array } list 播放列表
 */
export function randomPlay(list: Record<string, any>[]): Promise<number> {
  return new Promise(resolve => {
    const musicItem: number = Math.floor(Math.random() * list.length);
    const id: number = list[musicItem].id;

    if (list.length >= 6 && musicId.includes(list[musicItem].id)) {
      randomPlay(list);
      return false;
    }

    if (musicId.length >= 5) {
      musicId.splice(0, 1);
      musicId.push(id);
    } else {
      musicId.push(id);
    }

    resolve(id);
  });
}
