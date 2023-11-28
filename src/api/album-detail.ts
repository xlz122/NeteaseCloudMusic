import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取专辑详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 专辑id
 */
export const albumDetail = ({ id }: { id: number }): AxiosPromise => {
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

type ArtistAlbum = {
  id: number;
  offset?: number;
  limit?: number;
};

/**
 * @description 获取歌手专辑
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 * @param { Number } [offset] - 页数(默认为0)
 * @param { Number } [limit] - 偏移量(默认为50)
 */
export const artistAlbum = ({
  id,
  offset,
  limit
}: ArtistAlbum): AxiosPromise => {
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
