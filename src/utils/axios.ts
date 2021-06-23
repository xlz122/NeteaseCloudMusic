import store from '@store/index';
import axios from 'axios';
import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  CancelTokenStatic
} from 'axios';

type IAxiosError = AxiosError & {
  status: number;
};

// 标识请求
const getRequestIdentify = (config: AxiosRequestConfig, isReuest = false) => {
  let url = config.url;
  if (isReuest && config.url) {
    url = config.baseURL + config.url.substring(1, config.url.length);
  }
  return config.method === 'get'
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

// 取消重复请求
type Pending = {
  [key: string]: (message: string) => void;
};
const pending: Pending = {};
const CancelToken: CancelTokenStatic = axios.CancelToken;

const removePending = (key: string, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求');
  }
  delete pending[key];
};

class HttpRequest {
  constructor(externalConfig: AxiosRequestConfig) {
    this.externalConfig = externalConfig;
  }

  externalConfig: AxiosRequestConfig = {};

  getInsideConfig(): AxiosRequestConfig {
    let config = {
      // 基础路径
      baseURL: '',
      // 允许跨域带token,cookie
      withCredentials: true,
      // 请求超时
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    };
    config = Object.assign(config, this.externalConfig);
    return config;
  }

  // 调用方法
  request(options: AxiosRequestConfig) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance);
    return instance(options);
  }

  // 拦截器设置
  interceptors(instance: AxiosInstance) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 拦截重复请求(即当前正在进行的相同请求)
        const requestData: string = getRequestIdentify(config, true); // 标识请求
        // 取消重复请求
        removePending(requestData, true);
        // 创建当前请求的取消方法
        config.cancelToken = new CancelToken(cancel => {
          pending[requestData] = cancel;
        });

        return Promise.resolve(config);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res: AxiosResponse) => {
        const data = res.data;
        return Promise.resolve(data);
      },
      (error: IAxiosError) => {
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
