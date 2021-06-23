import axios from '@utils/axios';

/**
 * @desc 获取账号信息(需登录)
 * @param { Number } timestamp - 防止接口缓存
 */
 export const userAccount = () => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/user/account',
    method: 'get',
    params
  });
};
