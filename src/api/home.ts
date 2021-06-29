import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取 banner( 轮播图 )
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } type - 资源类型，0为pc
 */
export const bannerImgUrl = (): AxiosRequest => {
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
 * @desc 获取热门推荐 - 推荐歌单
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } limit - 条数，可选
 */
export const recommendSongList = ({
  limit
}: {
  limit?: number;
}): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    limit
  };
  return axios.request({
    url: '/personalized',
    method: 'get',
    params
  });
};

/**
 * @desc 获取热门推荐 - 推荐电台
 * @param { Number } timestamp - 防止接口缓存
 */
export const recommendDjprogram = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/personalized/djprogram',
    method: 'get',
    params
  });
};

/**
 * @desc 获取个性化推荐
 * @param { Number } timestamp - 防止接口缓存
 */
export const recommendResource = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/recommend/resource',
    method: 'get',
    params
  });
};

/**
 * @desc 获取新碟上架
 * @param { Number } timestamp - 防止接口缓存
 */
export const albumNewest = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

/**
 * @desc 获取用户动态
 * @param { Number } timestamp - 防止接口缓存
 */
export const userEvent = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/user/event',
    method: 'get',
    params
  });
};

/**
 * @desc 获取用户关注列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const userFollows = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/user/follows',
    method: 'get',
    params
  });
};

/**
 * @desc 获取用户粉丝列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const userFolloweds = (): AxiosRequest => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/user/followeds',
    method: 'get',
    params
  });
};

/**
 * @desc 获取用户粉丝列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } type - 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 */
export const dailySignin = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    type: 1
  };
  return axios.request({
    url: '/daily_signin',
    method: 'get',
    params
  });
};

/**
 * @desc 获取飙升榜列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 飙升榜id
 */
export const soaringList = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id: 19723756
  };
  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};

/**
 * @desc 获取新歌榜列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 新歌榜id
 */
export const newSongs = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id: 3779629
  };
  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};

/**
 * @desc 获取原创榜列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 飙升榜id
 */
export const originalList = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id: 2884035
  };
  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};
