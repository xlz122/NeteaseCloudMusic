import axios from '@utils/axios';

/**
 * @desc 二维码登录 - 获取key
 * @param { Number } timestamp - 防止接口缓存
 */
export const qrcodeKey = () => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/login/qr/key',
    method: 'get',
    params
  });
};

/**
 * @desc 二维码登录 - 获取二维码
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } key - 二维码登录key
 * @param { Boolean } [qrimg] - 是否生成二维码base64链接，可选
 */

type GetQrcodeImg = {
  key: string;
  qrimg?: boolean;
};

export const qrcodeImg = ({ key, qrimg }: GetQrcodeImg) => {
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
 * @desc 二维码登录 - 检测扫码状态
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } key - 二维码登录key
 */
export const qrcodeStatus = ({ key }: { key: string }) => {
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
 * @desc 手机号登录 - 获取国家编码列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const countryCode = () => {
  const params = { timestamp: new Date().getTime() };
  return axios.request({
    url: '/countries/code/list',
    method: 'get',
    params
  });
};

/**
 * @desc 手机号登录 - 检测手机号码是否已注册
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } phone - 手机号码
 * @param { String } [countrycode] - 国家码，用于国外手机号(可选)
 */

type TestCellphone = {
  phone: string;
  countrycode?: string;
};

export const testCellphone = ({ phone, countrycode }: TestCellphone) => {
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

/**
 * @desc 手机号登录 - 登录
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } phone - 手机号码
 * @param { String } password - 密码
 * @param { String } [countrycode] - 国家码，用于国外手机号(可选)
 */

type CellphoneLogin = {
  phone: string;
  password: string;
  countrycode?: string;
};

export const cellphoneLogin = ({
  phone,
  password,
  countrycode
}: CellphoneLogin) => {
  const params = {
    timestamp: new Date().getTime(),
    phone,
    password,
    countrycode
  };
  return axios.request({
    url: '/login/cellphone',
    method: 'get',
    params
  });
};

/**
 * @desc 手机号注册 - 发送验证码
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } phone - 手机号码
 * @param { String } [ctcode] - 国家码，用于国外手机号(可选)
 */

type CaptchaSent = {
  phone: string;
  ctcode?: string;
};

export const captchaSent = ({ phone, ctcode }: CaptchaSent) => {
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

/**
 * @desc 手机号注册 - 验证验证码
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } captcha - 验证码
 * @param { String } [ctcode] - 国家码，用于国外手机号(可选)
 */

type CaptchaVerify = {
  captcha: string;
  phone: string;
  ctcode?: string;
};

export const captchaVerify = ({ captcha, phone, ctcode }: CaptchaVerify) => {
  const params = {
    timestamp: new Date().getTime(),
    captcha,
    phone,
    ctcode
  };
  return axios.request({
    url: '/captcha/verify',
    method: 'get',
    params
  });
};

/**
 * @desc 邮箱登录
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } email - 163 网易邮箱
 * @param { String } password - 密码
 * @param { String } [md5_password] - md5加密后的密码,传入后 password 将失效
 */

type MailboxLogin = {
  email: string;
  password?: string;
  md5Password?: string;
};

export const mailboxLogin = ({
  email,
  password,
  md5Password
}: MailboxLogin) => {
  const params = {
    timestamp: new Date().getTime(),
    email,
    password,
    ['md5_password']: md5Password
  };
  return axios.request({
    url: '/login',
    method: 'get',
    params
  });
};

/**
 * @desc 获取账号信息
 * @param { Number } timestamp - 防止接口缓存
 */
export const accountInfo = () => {
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
 * @desc 获取用户信息
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } uid - 账号id
 */
export const userInfo = ({ uid }: { uid: number }) => {
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
 * @desc 退出登录
 * @param { Number } timestamp - 防止接口缓存
 */
export const logout = () => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/logout',
    method: 'get',
    params
  });
};
