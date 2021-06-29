import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取搜索建议
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
 * @desc 获取搜索列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } keywords - 关键词
 * @param { Number } [offest] - 页数: 默认为0
 * @param { Number } [limit] - 返回数量: 默认为30
 * @param { Number } [type] - 搜索类型: 默认为 1 即单曲
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
