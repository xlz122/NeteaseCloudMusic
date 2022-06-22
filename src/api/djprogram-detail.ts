import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取电台节目详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid 电台节目id
 */
export const djProgramDetail = ({ id }: { id: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/dj/program/detail',
    method: 'get',
    params
  });
};
