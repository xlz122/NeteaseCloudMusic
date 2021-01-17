import axios from '@utils/axios';

/**
 * @desc 获取用户信息 , 歌单，收藏，mv, dj 数量
 * @param { Number } timestamp - 防止接口缓存
 */
export const userSubcount = () => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/user/subcount',
    method: 'get',
    params
  });
};

/**
 * @desc 获取我的视频列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const myMvSbulist = () => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/mv/sublist',
    method: 'get',
    params
  });
};
