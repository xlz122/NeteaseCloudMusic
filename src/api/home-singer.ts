import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

type TopArtists = {
  offset?: number;
  limit?: number;
};

/**
 * @description 获取热门歌手列表
 * @param { Object } params
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为50)
 */
export const topArtists = ({ offset, limit }: TopArtists): AxiosPromise => {
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

type ArtistList = {
  area: number;
  type: number;
  initial: number | string;
};

/**
 * @description 获取歌手分类列表
 * @param { Object } params
 * @param { number } params.area - 语言
 * @param { number } params.type - 歌手
 * @param { (number | string) } params.initial - 排列(-1为热门, 0为其他)
 */
export const artistList = ({ area, type, initial }: ArtistList): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    area,
    type,
    initial
  };

  return axios.request({
    url: '/artist/list',
    method: 'get',
    params
  });
};
