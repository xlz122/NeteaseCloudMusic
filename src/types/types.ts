// 接口返回值类型
export type ResponseType<T = any> = {
  msg?: string;
  message?: string;
  code?: number;
  count?: T;
  data: T;
  cookie?: string;
  token?: string;
  account?: T;
  result?: T;
  [index: string]: any;
};
