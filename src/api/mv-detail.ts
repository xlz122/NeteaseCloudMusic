import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取mv详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } mvid - mv id
 */
export const mvDetail = ({ mvid }: { mvid: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    mvid
  };
  return axios.request({
    url: '/mv/detail',
    method: 'get',
    params
  });
};

/**
 * @description 获取mv播放地址
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - mv id
 */
export const mvUrl = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/mv/url',
    method: 'get',
    params
  });
};
