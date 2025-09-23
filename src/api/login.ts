import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 二维码登录 - 获取key
 */
export const qrcodeKey = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/login/qr/key',
    method: 'get',
    params
  });
};

type GetQrcodeImg = {
  key: string;
  qrimg?: boolean;
};

/**
 * @description 二维码登录 - 获取二维码
 * @param { Object } params
 * @param { string } params.key - 二维码登录key
 * @param { boolean } [params.qrimg] - 生成二维码base64链接
 */
export const qrcodeImg = ({ key, qrimg }: GetQrcodeImg): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    key,
    qrimg
  };

  return axios.request({
    url: '/login/qr/create',
    method: 'get',
    params
  });
};

/**
 * @description 二维码登录 - 检测扫码状态
 * @param { Object } params
 * @param { string } params.key - 二维码登录key
 */
export const qrcodeStatus = ({ key }: { key: string }): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    key
  };

  return axios.request({
    url: '/login/qr/check',
    method: 'get',
    params
  });
};

/**
 * @description 手机号登录 - 获取国家编码列表
 */
export const countryCode = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/countries/code/list',
    method: 'get',
    params
  });
};

type TestCellphone = {
  phone: string;
  countrycode?: string;
};

/**
 * @description 手机号登录 - 检测手机号码是否已注册
 * @param { Object } params
 * @param { string } params.phone - 手机号码
 * @param { string } [params.countrycode] - 国家码, 用于国外手机号
 */
export const testCellphone = ({ phone, countrycode }: TestCellphone): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    phone,
    countrycode
  };

  return axios.request({
    url: '/cellphone/existence/check',
    method: 'get',
    params
  });
};

type CellphoneLogin = {
  phone: string;
  password?: string;
  countrycode?: string;
  captcha?: string;
};

/**
 * @description 手机号登录 - 登录
 * @param { Object } params
 * @param { string } params.phone - 手机号码
 * @param { string } params.password - 密码
 * @param { string } [params.countrycode] - 国家码, 用于国外手机号
 * @param { string } [params.captcha] - 验证码, 传入后 password 参数将失效
 */
export const cellphoneLogin = ({
  phone,
  password,
  countrycode,
  captcha
}: CellphoneLogin): AxiosPromise => {
  const data = {
    timestamp: new Date().getTime(),
    phone,
    password,
    countrycode,
    captcha
  };

  return axios.request({
    url: '/login/cellphone',
    method: 'post',
    data
  });
};

type CaptchaSent = {
  phone: string;
  ctcode?: string;
};

/**
 * @description 手机号注册 - 发送验证码
 * @param { Object } params
 * @param { string } params.phone - 手机号码
 * @param { string } [params.ctcode] - 国家码, 用于国外手机号
 */
export const captchaSent = ({ phone, ctcode }: CaptchaSent): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    phone,
    ctcode
  };

  return axios.request({
    url: '/captcha/sent',
    method: 'get',
    params
  });
};

type CaptchaVerify = {
  phone: string;
  captcha: string;
  ctcode?: string;
};

/**
 * @description 手机号注册 - 验证验证码
 * @param { Object } params
 * @param { string } params.phone - 手机号码
 * @param { string } params.captcha - 验证码
 * @param { string } [params.ctcode] - 国家码, 用于国外手机号
 */
export const captchaVerify = ({ phone, captcha, ctcode }: CaptchaVerify): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    phone,
    captcha,
    ctcode
  };

  return axios.request({
    url: '/captcha/verify',
    method: 'get',
    params
  });
};

type MailboxLogin = {
  email: string;
  password?: string;
  md5Password?: string;
};

/**
 * @description 邮箱登录
 * @param { Object } params
 * @param { string } params.email - 163网易邮箱
 * @param { string } params.password - 密码
 * @param { string } [params.md5Password] - md5加密后的密码, 传入后 password 将失效
 */
export const mailboxLogin = ({ email, password, md5Password }: MailboxLogin): AxiosPromise => {
  const data = {
    timestamp: new Date().getTime(),
    email,
    password,
    ['md5_password']: md5Password
  };

  return axios.request({
    url: '/login',
    method: 'post',
    data
  });
};

/**
 * @description 获取账号信息
 */
export const accountInfo = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/account',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户信息
 * @param { Object } params
 * @param { number } params.uid - 用户id
 */
export const userInfo = ({ uid }: { uid: number }): AxiosPromise => {
  const data = {
    timestamp: new Date().getTime(),
    uid
  };

  return axios.request({
    url: '/user/detail',
    method: 'post',
    data
  });
};

/**
 * @description 退出登录
 */
export const logout = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/logout',
    method: 'get',
    params
  });
};
