import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取搜索建议
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } keywords - 关键词
 */
export const searchPropose = ({
  keywords
}: {
  keywords: string;
}): AxiosRequest => {
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

/**
 * @description 获取搜索列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } keywords - 关键词
 * @param { Number } [offest] - 页数: 默认为0
 * @param { Number } [limit] - 返回数量: 默认为30
 * @param { Number } [type] -  搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手,
 * 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 */

type SearchKeywords = {
  keywords: string;
  offset?: number;
  limit?: number;
  type?: number;
};

export const searchKeywords = ({
  keywords,
  offset,
  limit,
  type
}: SearchKeywords): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    keywords,
    offset,
    limit,
    type
  };
  return axios.request({
    url: '/cloudsearch',
    method: 'get',
    params
  });
};

/**
 * @description 收藏/取消收藏用户
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 用户id
 * @param { Number } t - 1为收藏,其他为取消收藏
 */

type Follow = {
  id: number;
  t: number;
};

export const followUser = ({ id, t }: Follow): AxiosRequest => {
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
