import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取电台节目详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id 电台节目id
 */
export const programDetail = ({ id }: { id: number }): AxiosPromise => {
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

type ProgramList = {
  rid: number;
  offest?: number;
  limit?: number;
  asc?: boolean;
};

/**
 * @description 获取电台节目列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid 电台节目id
 * @param { Number } [offest] - 页数: 默认为0
 * @param { Number } [limit] - 返回数量: 默认为30
 * @param { Boolean } [asc] - 排序方式,默认false(新 => 老),true(老 => 新)
 */
export const programList = ({
  rid,
  offest,
  limit,
  asc
}: ProgramList): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    rid,
    offest,
    limit,
    asc
  };
  return axios.request({
    url: '/dj/program',
    method: 'get',
    params
  });
};
