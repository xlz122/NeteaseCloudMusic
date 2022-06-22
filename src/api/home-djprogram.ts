import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取电台分类列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const djCatelist = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/dj/catelist',
    method: 'get',
    params
  });
};
