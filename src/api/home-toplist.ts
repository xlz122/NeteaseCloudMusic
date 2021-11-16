import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取所有榜单
 * @param { Number } timestamp - 防止接口缓存
 */
export const topList = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/toplist',
    method: 'get',
    params
  });
};
