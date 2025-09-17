import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取轮播图
 * @param { Object } params
 * @param { number } params.type - 资源类型(0为pc)
 */
export const bannerImgUrl = (): AxiosPromise => {
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
 * @description 获取热门推荐 - 推荐歌单
 * @param { number } [params.limit] - 偏移量(默认为30)
 */
export const recommendSongList = ({ limit }: { limit?: number }): AxiosPromise => {
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
 * @description 获取热门推荐 - 推荐电台
 */
export const recommendDjprogram = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/personalized/djprogram',
    method: 'get',
    params
  });
};

/**
 * @description 获取个性化推荐
 */
export const recommendResource = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/recommend/resource',
    method: 'get',
    params
  });
};

/**
 * @description 获取新碟上架
 */
export const albumNewest = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/album/newest',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户动态
 */
export const userEvent = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/event',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户关注列表
 */
export const userFollows = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/follows',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户粉丝列表
 */
export const userFolloweds = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/followeds',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户粉丝列表
 * @param { Object } params
 * @param { number } params.type - 签到类型(0: 安卓端签到 , 1: web/PC 签到)
 */
export const dailySignin = (): AxiosPromise => {
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
