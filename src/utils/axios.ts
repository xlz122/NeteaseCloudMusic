import store from '@store/index';
import axios from 'axios';
import {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
  CancelTokenStatic
} from 'axios';
import { setMessage } from '@/components/message/useMessage';

type IAxiosError = AxiosError & {
  status: number;
  response: {
    status: number;
    data: Record<string, any>;
  };
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
      baseURL: '',
      // 允许跨域带token,cookie
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
        // 拦截重复请求(即当前正在进行的相同请求)
        const requestData: string = getRequestIdentify(config, true); // 标识请求
        // 取消重复请求
        removePending(requestData, true);
        // 创建当前请求的取消方法
        config.cancelToken = new CancelToken(cancel => {
          pending[requestData] = cancel;
        });

        if (store.getters.isLogin && config.method === 'get') {
          config.params = Object.assign(config.params, {
            cookie: encodeURIComponent(store.getters.cookie)
          });
        }

        if (store.getters.isLogin && config.method === 'post') {
          config.params = Object.assign(config.data, {
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
      (res: AxiosResponse) => {
        const data = res.data;

        // 验证
        if (data?.code === -462) {
          store.commit('setAbnormal', {
            visible: true,
            url: data?.data?.url
          });
        }

        if (data?.code === 250) {
          setMessage({ type: 'error', title: data?.message });
        }

        return Promise.resolve(data);
      },
      (error: IAxiosError) => {
        // cookie过期
        if (error?.response?.status === 301) {
          store.commit('setLogout');
        }

        // 验证
        if (
          error?.response?.status === 400 &&
          error?.response?.data?.code === -462
        ) {
          store.commit('setAbnormal', {
            visible: true,
            url: error?.response?.data?.data?.url
          });
        }

        return Promise.reject(error);
      }
    );
  }
}

const Axios = new HttpRequest({
  baseURL: process.env.VUE_APP_BASE_URL
});

export default Axios;
