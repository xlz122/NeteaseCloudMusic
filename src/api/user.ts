import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取账号信息（需登录）
 * @param { Number } timestamp - 防止接口缓存
 */
export const userAccount = (): AxiosPromise => {
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
 * @description 获取VIP信息（需登录）
 * @param { Number } timestamp - 防止接口缓存
 */
export const userVipInfo = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/vip/info',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户播放记录
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } uid - 用户id
 * @param { Number } [type] 1返回 weekData, 0返回 allData
 */

type UserRecord = {
  uid: number;
  type?: number;
};

export const userRecord = ({ uid, type }: UserRecord): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    uid,
    type
  };
  return axios.request({
    url: '/user/record',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户等级信息
 * @param { Number } timestamp - 防止接口缓存
 */
export const userLevel = (): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/user/level',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } uid - 用户id
 */
export const userDetail = ({ uid }: { uid: number }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    uid
  };
  return axios.request({
    url: '/user/detail',
    method: 'get',
    params
  });
};
