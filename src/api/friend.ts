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
