import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取朋友动态
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } pagesize - 每页数据,默认20
 * @param { Number } pagesize - 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 */

export type FirendEvent = {
  pagesize: number;
  lasttime: number;
};

export const friendEvent = ({
  pagesize,
  lasttime
}: FirendEvent): AxiosRequest => {
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

/**
 * @desc 朋友动态点赞
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } cid - 评论id
 * @param { Number } threadId - 动态的 threadId
 * @param { Number } t - 是否点赞 ,1 为点赞 ,0 为取消点赞
 */
type DynamicLike = {
  cid: number;
  threadId: number;
  t: number;
};

export const dynamicLike = ({
  cid,
  threadId,
  t
}: DynamicLike): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    tpye: 6, // type 6为动态
    cid,
    threadId, // 动态的 threadId
    t
  };
  return axios.request({
    url: `/comment/like?
      timestamp=${params.timestamp}&type=${params.tpye}
      &cid=${params.cid}&threadId=${params.threadId}&t=${params.t}
    `,
    method: 'get'
  });
};
