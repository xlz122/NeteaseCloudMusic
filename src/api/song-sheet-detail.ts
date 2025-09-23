import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取歌单所有歌曲
 * @param { Object } params
 * @param { number } params.id - 歌单id
 */
export const playlistTrack = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/playlist/track/all',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌单详情
 * @param { Object } params
 * @param { number } params.id - 歌单id
 * @param { number } [params.s] - 歌单最近收藏者(默认为8)
 */
export const playlistDetail = ({ id, s }: { id: number; s?: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    s
  };

  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};

/**
 * @description 歌单收藏
 * @param { Object } params
 * @param { number } params.id - 歌单id
 * @param { number } params.t - 1: 收藏, 2: 取消收藏
 */
export const playlistSubscribe = ({ id, t }: { id: number; t: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    t
  };

  return axios.request({
    url: '/playlist/subscribe',
    method: 'get',
    params
  });
};
