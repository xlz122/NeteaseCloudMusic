import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取视频详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 视频id
 */
export const videoDetail = ({ id }: { id: number }): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 视频id
 */
export const relatedVideo = ({ id }: { id: number }): AxiosRequest => {
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
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 视频id
 */
export const videoUrl = ({ id }: { id: number }): AxiosRequest => {
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
