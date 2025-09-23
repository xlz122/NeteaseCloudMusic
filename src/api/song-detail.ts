import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取歌曲详情
 * @param { Object } params
 * @param { number } params.id - 歌曲id
 */
export const songDetail = ({ ids }: { ids: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    ids
  };

  return axios.request({
    url: '/song/detail',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌曲的相似歌单
 * @param { Object } params
 * @param { number } params.id - 歌曲id
 */
export const simiPlaylist = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/simi/playlist',
    method: 'get',
    params
  });
};

/**
 * @description 获取相似歌曲
 * @param { Object } params
 * @param { number } params.id - 歌曲id
 */
export const simiSong = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/simi/song',
    method: 'get',
    params
  });
};
