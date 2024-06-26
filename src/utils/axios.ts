import axios from 'axios';
import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  CancelTokenStatic
} from 'axios';
import store from '@/store/index';
import { setMessage } from '@/hooks/useMessage';

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
      baseURL: '',
      // 跨域携带cookie
      withCredentials: true,
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
      (config: InternalAxiosRequestConfig) => {
        // 标识请求
        const requestData: string = getRequestIdentify(config, true);
        // 取消重复请求
        removePending(requestData, true);
        config.cancelToken = new CancelToken(cancel => {
          pending[requestData] = cancel;
        });

        if (store.getters.isLogin && config.method === 'get') {
          config.params = Object.assign(config?.params || {}, {
            cookie: encodeURIComponent(store.getters.cookie)
          });
        }

        if (store.getters.isLogin && config.method === 'post') {
          config.params = Object.assign(config?.data || {}, {
            cookie: store.getters.cookie
          });
        }

        return Promise.resolve(config);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const res = response.headers['content-type'].includes(
          'application/json'
        )
          ? response.data
          : response;

        if (res?.code === 250) {
          setMessage({ type: 'error', title: res?.message });
        }

        return Promise.resolve(res);
      },
      (error: AxiosError) => {
        // cookie过期
        if (error?.response?.status === 301) {
          store.commit('setLogout');
        }

        return Promise.reject(error);
      }
    );
  }
}

const Axios = new HttpRequest({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL
});

export default Axios;
