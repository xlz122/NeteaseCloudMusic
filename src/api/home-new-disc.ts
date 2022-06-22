import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取新碟上架
 * @param { Number } timestamp - 防止接口缓存
 */
export const hotNewDisc = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

/**
 * @description 获取全部新碟
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } limit - 返回数量 , 默认为 30
 * @param { Number } offset - 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param { Number } area - ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 */

export type NweDiscAlbum = {
  limit: number;
  offset: number;
  area: string;
};

export const nweDiscAlbum = ({
  limit,
  offset,
  area
}: NweDiscAlbum): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    limit,
    offset,
    area
  };
  return axios.request({
    url: '/album/new',
    method: 'get',
    params
  });
};
