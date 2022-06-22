import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取歌手详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 */
export const artistDetail = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/artist/detail',
    method: 'get',
    params
  });
};

/**
 * @description 收藏/取消收藏歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 * @param { Number } t - 1为收藏,其他为取消收藏
 */

type ArtistSub = {
  id: number;
  t: number;
};

export const artistSub = ({ id, t }: ArtistSub): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    t
  };
  return axios.request({
    url: '/artist/sub',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌手单曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 */
export const artistSong = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/artists',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌手mv
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 * @param { Number } offset - 页数，默认为 0
 * @param { Number } limit - 取出数量，默认为 50
 */

export type ArtistMv = {
  id: number;
  offset: number;
  limit: number;
};

export const artistMv = ({ id, offset, limit }: ArtistMv): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit
  };
  return axios.request({
    url: '/artist/mv',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌手描述
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 */
export const artistDesc = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/artist/desc',
    method: 'get',
    params
  });
};

/**
 * @description 获取热门歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } [offset] - 页数
 * @param { Number } [limit] - 每页条数，默认20
 */

type TopArtists = {
  offset?: number;
  limit?: number;
};

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

/**
 * @description 获取相似歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手id
 */
export const simiArtist = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/simi/artist',
    method: 'get',
    params
  });
};
