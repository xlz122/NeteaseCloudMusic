import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取歌手详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手 id
 */
export const artistDetail = ({ id }: { id: number }): AxiosRequest => {
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
 * @desc 获取歌手单曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手 id
 */
export const artistSong = ({ id }: { id: number }): AxiosRequest => {
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
 * @desc 获取歌手描述
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手 id
 */
export const artistDesc = ({ id }: { id: number }): AxiosRequest => {
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
 * @desc 获取相似歌手
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌手 id
 */
export const simiArtist = ({ id }: { id: number }): AxiosRequest => {
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
