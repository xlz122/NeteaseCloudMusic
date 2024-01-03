import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获得每日推荐歌曲(需登录)
 */
export const recommendSongs = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/recommend/songs',
    method: 'get',
    params
  });
};
