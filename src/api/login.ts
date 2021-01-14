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
 * @param { Boolean } [qrimg] - 生成二维码base64链接，可选
 */

interface GetQrcodeImg {
  key: string;
  qrimg?: boolean;
}

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
 * @desc 二维码登录 - 检测扫码状态接口
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
