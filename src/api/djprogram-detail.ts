import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取电台节目详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid 电台节目id
 */
export const djProgramDetail = ({ id }: { id: number }): AxiosRequest => {
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
