import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取专辑详情
 * @param { Object } params
 * @param { number } params.id - 专辑id
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
 * @param { Object } params
 * @param { number } params.id - 歌手id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为50)
 */
export const artistAlbum = ({ id, offset, limit }: ArtistAlbum): AxiosPromise => {
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
