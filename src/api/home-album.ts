import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取新碟上架
 */
export const hotAlbum = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

type NweAlbum = {
  area: string;
  offset?: number;
  limit?: number;
};

/**
 * @description 获取全部新碟
 * @param { Object } params
 * @param { string } params.area - ALL: 全部, ZH: 华语, EA: 欧美, KR: 韩国, JP: 日本
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为30)
 */
export const nweAlbum = ({ area, limit, offset }: NweAlbum): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    area,
    limit,
    offset
  };

  return axios.request({
    url: '/album/new',
    method: 'get',
    params
  });
};
