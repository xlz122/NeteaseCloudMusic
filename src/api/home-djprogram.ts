import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取电台分类列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const djCatelist = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/dj/catelist',
    method: 'get',
    params
  });
};
