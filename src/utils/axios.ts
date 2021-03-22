// @ts-nocheck
import axios from 'axios';

// 标识请求
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url;
  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length);
  }
  return config.method === 'get'
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

// 取消重复请求
const pending = {};
const CancelToken = axios.CancelToken;
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求');
  }
  delete pending[key];
};

class HttpRequest {
  constructor(externalConfig) {
    // 外部配置
    this.externalConfig = externalConfig;
  }

  externalConfig;

  // 内部配置
  getInsideConfig() {
    let config = {
      // 基础路径
      baseURL: '',
      // 表示跨域请求时是否需要使用凭证
      // 允许跨域带token,cookie
      withCredentials: true,
      // 请求超时
      timeout: 60000,
      headers: {
        contentType: 'application/json;charset=UTF-8'
      }
    };
    config = Object.assign(config, this.externalConfig);
    return config;
  }

  // 调用方法
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance);
    return instance(options);
  }

  // 拦截器设置
  interceptors(instance) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 拦截重复请求(即当前正在进行的相同请求)
        const requestData = getRequestIdentify(config, true); // 标识请求
        removePending(requestData, true); // 取消重复请求
        // 创建当前请求的取消方法
        config.cancelToken = new CancelToken(c => {
          pending[requestData] = c;
        });

        return Promise.resolve(config);
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        const data = res.data;
        return Promise.resolve(data);
      },
      error => {
        // cookie过期
        if (error.status === 301) {
          store.commit('setLogout');
        }
        return Promise.reject(error);
      }
    );
  }
}

const Axios = new HttpRequest({
  baseURL: '/api'
});

export default Axios;
