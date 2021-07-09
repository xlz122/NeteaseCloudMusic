import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取热门歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } offset - 页数，默认为 0
 * @param { Number } limit - 取出数量，默认为 50
 */

type TopArtists = {
  offset: number;
  limit: number;
};

export const topArtists = ({ offset, limit }: TopArtists): AxiosRequest => {
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

/**
 * @desc 获取热门歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } offset - 页数，默认为 0
 * @param { Number } limit - 取出数量，默认为 50
 */

export type ArtistList = {
  area: number;
  type: number;
  initial: number | string;
};

export const artistList = ({
  area,
  type,
  initial
}: ArtistList): AxiosRequest => {
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
