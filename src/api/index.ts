import axios from '@utils/axios';

/**
 * @desc 账号登录
 * @params username - 用户名
 * @params password - 密码
*/
export const accountLogin = ({ username, password }: { username: string, password: string | number }) => {
  const data = { username, password };
  return axios.request({
    url: '/login',
    method: 'post',
    data
  })
}