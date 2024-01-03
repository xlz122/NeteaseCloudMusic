import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取歌手详情
 * @param { Object } params
 * @param { number } params.id - 歌手id
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

type ArtistSub = {
  id: number;
  t: number;
};

/**
 * @description 收藏/取消收藏歌手
 * @param { Object } params
 * @param { number } params.id - 歌手id
 * @param { number } params.t - 1: 收藏, 其他为取消收藏
 */
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
 * @param { Object } params
 * @param { number } params.id - 歌手id
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

type ArtistMv = {
  id: number;
  offset?: number;
  limit?: number;
};

/**
 * @description 获取歌手mv
 * @param { Object } params
 * @param { number } params.id - 歌手id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为50)
 */
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
 * @param { Object } params
 * @param { number } params.id - 歌手id
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

type TopArtists = {
  offset?: number;
  limit?: number;
};

/**
 * @description 获取热门歌手
 * @param { Object } params
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
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

/**
 * @description 获取相似歌手
 * @param { Object } params
 * @param { number } params.id - 歌手id
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
