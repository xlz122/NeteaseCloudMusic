import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取歌曲详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } ids - 歌曲id
 */
export const songDetail = ({ ids }: { ids: number }): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 */
export const simiPlaylist = ({ id }: { id: number }): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 */
export const simiSong = ({ id }: { id: number }): AxiosRequest => {
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
