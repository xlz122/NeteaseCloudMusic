import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取所有榜单
 */
export const topList = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/toplist',
    method: 'get',
    params
  });
};
