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

/**
 * @desc 获取用户等级信息
 * @param { Number } timestamp - 防止接口缓存
 */
export const userLevel = () => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/user/level',
    method: 'get',
    params
  });
};
