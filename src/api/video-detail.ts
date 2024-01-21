import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取视频详情
 * @param { Object } params
 * @param { string } params.id- 视频id
 */
export const videoDetail = ({ id }: { id: string }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/video/detail',
    method: 'get',
    params
  });
};

/**
 * @description 获取相关视频
 * @param { Object } params
 * @param { string } params.id- 视频id
 */
export const relatedVideo = ({ id }: { id: string }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/related/allvideo',
    method: 'get',
    params
  });
};

/**
 * @description 获取视频播放地址
 * @param { Object } params
 * @param { string } params.id- 视频id
 */
export const videoUrl = ({ id }: { id: string }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };

  return axios.request({
    url: '/video/url',
    method: 'get',
    params
  });
};

type VideoSub = {
  id: string;
  t: number;
};

/**
 * @description 收藏/取消收藏视频
 * @param { Object } params
 * @param { string } params.id- 视频id
 * @param { number } params.t - 1: 收藏, 其他为取消收藏
 */
export const videoSub = ({ id, t }: VideoSub): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    t
  };

  return axios.request({
    url: '/video/sub',
    method: 'get',
    params
  });
};
