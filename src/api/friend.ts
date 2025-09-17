import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

type FirendEvent = {
  pagesize: number;
  lasttime: number;
};

/**
 * @description 获取动态
 * @param { Object } params
 * @param { number } params.pagesize - 页数(默认20)
 * @param { number } params.lasttime - 默认-1, 传入上一次返回结果的 lasttime, 将会返回下一页的数据
 */
export const friendEvent = ({ pagesize, lasttime }: FirendEvent): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    pagesize,
    lasttime
  };

  return axios.request({
    url: '/event',
    method: 'get',
    params
  });
};

type DynamicLike = {
  cid: number;
  threadId: number;
  t: number;
};

/**
 * @description 动态点赞
 * @param { Object } params
 * @param { number } params.cid - 评论id
 * @param { number } params.threadId - 动态threadId
 * @param { number } params.t - 是否点赞(0: 取消点赞, 1: 点赞)
 */
export const dynamicLike = ({ cid, threadId, t }: DynamicLike): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    tpye: 6, // 6: 动态
    cid,
    threadId,
    t
  };

  const paramsStr = `type=${params.tpye}&cid=${params.cid}&threadId=${params.threadId}&t=${params.t}`;

  return axios.request({
    url: `/comment/like?timestamp=${params.timestamp}&${paramsStr}`,
    method: 'get'
  });
};
