import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取专辑详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 专辑id
 */
export const albumDetail = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/album',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌手专辑
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 * @param { Number } [offset] - 页数，默认为 0
 * @param { Number } [limit] - 偏移数量，默认为 50
 */

export type ArtistAlbum = {
  id: number;
  offset?: number;
  limit?: number;
};

export const artistAlbum = ({
  id,
  offset,
  limit
}: ArtistAlbum): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit
  };
  return axios.request({
    url: '/artist/album',
    method: 'get',
    params
  });
};
