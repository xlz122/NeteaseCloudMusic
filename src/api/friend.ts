import axios from '@utils/axios';

/**
 * @desc 获取朋友动态
 * @param { Number } timestamp - 防止接口缓存
 */
export const friendEvent = () => {
  const params = { timestamp: new Date().getTime() };
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

export const dynamicLike = ({ cid, threadId, t }: DynamicLike) => {
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
