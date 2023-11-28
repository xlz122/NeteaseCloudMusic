import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取搜索建议
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } keywords - 关键词
 */
export const searchPropose = ({
  keywords
}: {
  keywords: string;
}): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    keywords
  };

  return axios.request({
    url: '/search/suggest',
    method: 'get',
    params
  });
};

type SearchKeywords = {
  keywords: string;
  offset?: number;
  limit?: number;
  type?: number;
};

/**
 * @description 获取搜索列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } type -  搜索类型: 默认为 1, 取值意义: 1: 单曲, 10: 专辑, 100: 歌手,
 * 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018: 综合
 * @param { String } keywords - 关键词
 * @param { Number } [offest] - 页数(默认为 0)
 * @param { Number } [limit] - 偏移量(默认为30)
 */
export const searchKeywords = ({
  type,
  keywords,
  offset,
  limit
}: SearchKeywords): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    type,
    keywords,
    offset,
    limit
  };

  return axios.request({
    url: '/cloudsearch',
    method: 'get',
    params
  });
};

type FollowUser = {
  id: number;
  t: number;
};

/**
 * @description 收藏/取消收藏用户
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 用户id
 * @param { Number } t - 1: 收藏, 其他为取消收藏
 */
export const followUser = ({ id, t }: FollowUser): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    t
  };

  return axios.request({
    url: '/follow',
    method: 'get',
    params
  });
};
