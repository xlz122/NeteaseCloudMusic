import axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';
import store from '@/store';
import { setMessage } from '@/hooks/useMessage';

const getRequestIdentify = (config: AxiosRequestConfig, isReuest = false) => {
  let url = config.url;
  if (config.url && isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length);
  }

  return config.method === 'get'
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

const pending: { [key: string]: () => void } = {};
const removePending = (key: string, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]();
  }

  delete pending[key];
};

class HttpRequest {
  getInsideConfig(): AxiosRequestConfig {
    const config = {
      baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      withCredentials: true,
      timeout: 60000
    };

    return config;
  }

  interceptors(instance: AxiosInstance) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 标识请求
        const requestIdentify: string = getRequestIdentify(config, true);
        // 取消重复请求
        removePending(requestIdentify, true);
        config.cancelToken = new axios.CancelToken((cancel) => {
          pending[requestIdentify] = cancel;
        });

        return Promise.resolve(config);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const res = response.headers['content-type'].includes('application/json')
          ? response.data
          : response;

        if (res?.code === 250) {
          setMessage({ type: 'error', title: res?.message });
        }

        return Promise.resolve(res);
      },
      (error: AxiosError) => {
        if (error.response?.status === 301) {
          store.commit('setLogout');
        }

        return Promise.reject(error);
      }
    );
  }

  request(options: AxiosRequestConfig) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance);

    return instance(options);
  }
}

const axiosInstance = new HttpRequest();

export default axiosInstance;
