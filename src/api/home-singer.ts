import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取热门歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } offset - 页数，默认为 0
 * @param { Number } limit - 取出数量，默认为 50
 */
export const topArtists = ({ offset, limit }: { offset: number; limit: number; }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    offset,
    limit
  };
  return axios.request({
    url: '/top/artists',
    method: 'get',
    params
  });
};
