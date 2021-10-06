import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获得每日推荐歌曲 ( 需要登录 )
 * @param { Number } timestamp - 防止接口缓存
 */
export const recommendSongs = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/recommend/songs',
    method: 'get',
    params
  });
};
