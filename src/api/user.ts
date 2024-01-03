import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取账号信息(需登录)
 */
export const userAccount = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/account',
    method: 'get',
    params
  });
};

/**
 * @description 获取VIP信息(需登录)
 */
export const userVipInfo = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/vip/info',
    method: 'get',
    params
  });
};

type UserRecord = {
  uid: number;
  type?: number;
};

/**
 * @description 获取用户播放记录(需登录)
 * @param { Object } params
 * @param { number } params.uid - 用户id
 * @param { number } [params.type] 0: 全部数据(allData), 1: 周数据(weekData)
 */
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
 * @description 获取用户等级信息(需登录)
 */
export const userLevel = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/level',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户详情(需登录)
 * @param { Object } params
 * @param { number } params.uid - 用户id
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

type MessagType = {
  offset?: number;
  limit?: number;
};

/**
 * @description 获取消息提示(需登录)
 * @param { Object } params
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为30)
 */
export const messageEv = ({ offset, limit }: MessagType): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    offset,
    limit
  };

  return axios.request({
    url: '/msg/private',
    params
  });
};
