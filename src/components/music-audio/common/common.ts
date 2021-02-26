import store from '@store/index';
import { getPlayMusicUrl } from '@api/my-music';
import { ResponseDataType } from '@/types/types';

// 播放列表
const musicList = store.getters['music/playMusicList'];

/**
 * @desc 获取音乐播放链接
 * @param { Number } id - 音乐id
 * @return { String } 音乐播放链接
 */
export function getMusicUrl(id: number): Promise<unknown> | boolean {
  if (musicList.length <= 0) {
    return false;
  }
  return new Promise(resolve => {
    getPlayMusicUrl({ id }).then((res: ResponseDataType) => {
      if (res.code === 200) {
        resolve({ url: res.data[0].url });
      }
    });
  });
}
