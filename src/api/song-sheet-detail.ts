import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取歌单所有歌曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单 id
 */
export const playlistTrack = ({ id }: { id: number }): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单 id
 * @param { Number } s - 歌单最近的 s 个收藏者,默认为8
 */
export const playlistDetail = ({
  id,
  s
}: {
  id: number;
  s?: number;
}): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单 id
 * @param { Number } t - 类型,1:收藏,2:取消收藏
 */
export const playlistSubscribe = ({
  id,
  t
}: {
  id: number;
  t: number;
}): AxiosRequest => {
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
