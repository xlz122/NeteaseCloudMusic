import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取电台分类列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const djCatelist = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/dj/catelist',
    method: 'get',
    params
  });
};

/**
 * @description 获取推荐节目
 * @param { Number } timestamp - 防止接口缓存
 */
export const programRecommend = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/program/recommend',
    method: 'get',
    params
  });
};

type TopListType = {
  limit?: number;
  offset?: number;
};

/**
 * @description 获取节目排行榜
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } [offset] - 页数(默认为0)
 * @param { Number } [limit] - 偏移量
 */
export const programTopList = ({
  limit,
  offset
}: TopListType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    limit,
    offset
  };

  return axios.request({
    url: '/dj/program/toplist',
    method: 'get',
    params
  });
};

type RecommendType = {
  type: number;
};

/**
 * @description 获取分类推荐
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } type - 类型
 */
export const recommendTypeList = ({ type }: RecommendType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    type
  };

  return axios.request({
    url: '/dj/recommend/type',
    method: 'get',
    params
  });
};

type DjDetailType = {
  rid: number;
};

/**
 * @description 获取电台详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid - 电台id
 */
export const djDetail = ({ rid }: DjDetailType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    rid
  };

  return axios.request({
    url: '/dj/detail',
    params
  });
};

type DjProgramType = {
  rid: number;
  asc: boolean;
  limit?: number;
  offset?: number;
};

/**
 * @description 获取电台详情- 节目列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid - 电台id
 * @param { Boolean } asc - 排序
 * @param { Number } [offset] - 页数(默认为0)
 * @param { Number } [limit] - 偏移量
 */
export const djProgram = ({
  rid,
  asc,
  limit,
  offset
}: DjProgramType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    rid,
    asc,
    limit,
    offset
  };

  return axios.request({
    url: '/dj/program',
    params
  });
};
