import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取歌单分类
 */
export const playlistCatlist = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/playlist/catlist',
    method: 'get',
    params
  });
};

type TopPlaylist = {
  order?: string;
  cat?: string;
  offset?: number;
  limit?: number;
};

/**
 * @description 获取歌单列表
 * @param { Object } params
 * @param { string } [params.order] - 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param { string } [params.cat] - tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部"
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为50)
 */
export const topPlaylist = ({ order, cat, offset, limit }: TopPlaylist): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    order,
    cat,
    offset,
    limit
  };

  return axios.request({
    url: '/top/playlist',
    method: 'get',
    params
  });
};
