import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取电台节目详情
 * @param { Object } params
 * @param { number } params.id - 电台节目id
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

type ProgramList = {
  rid: number;
  offest?: number;
  limit?: number;
  asc?: boolean;
};

/**
 * @description 获取电台节目列表
 * @param { Object } params
 * @param { number } params.rid - 电台节目id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为30)
 * @param { boolean } [params.asc] - 排序方式, 默认false(新 => 老), true(老 => 新)
 */
export const djProgramList = ({ rid, offest, limit, asc }: ProgramList): AxiosPromise => {
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
