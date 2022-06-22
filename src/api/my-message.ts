import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取mv详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } limit - 返回数量 , 默认为 30
 * @param { Number } offset - 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export type MessagType = {
  limit?: number;
  offset?: number;
};
export const messageEv = ({ limit, offset }: MessagType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    limit,
    offset
  };
  return axios.request({
    url: '/msg/private',
    params
  });
};
