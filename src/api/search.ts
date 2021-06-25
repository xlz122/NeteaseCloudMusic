import axios from '@utils/axios';

/**
 * @desc 获取账号信息(需登录)
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } keywords - 关键词
 */
export const searchKeywords = ({ keywords }: { keywords: string }) => {
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
