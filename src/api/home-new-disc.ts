import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取新碟上架
 * @param { Number } timestamp - 防止接口缓存
 */
export const hotNewDisc = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

type NweDiscAlbum = {
  offset?: number;
  limit?: number;
  area: string;
};

/**
 * @description 获取全部新碟
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } offset - 页数(默认为0)
 * @param { Number } limit - 偏移量
 * @param { Number } area - ALL: 全部, ZH: 华语, EA: 欧美, KR: 韩国, JP: 日本
 */
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
