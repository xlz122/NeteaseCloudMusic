import axios from '@utils/axios';

/**
 * @desc 获取 banner( 轮播图 )
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } type - 资源类型，0为pc
 */
export const bannerImgUrl = () => {
  const params = {
    timestamp: new Date().getTime(),
    type: 0
  };
  return axios.request({
    url: '/banner',
    method: 'get',
    params
  });
};

/**
 * @desc 获取个性化推荐
 * @param { Number } timestamp - 防止接口缓存
 */
export const recommendResource = () => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/recommend/resource',
    method: 'get',
    params
  });
};
