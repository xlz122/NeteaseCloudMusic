// 接口返回值类型
export interface ResponseDataType<T = any> {
  msg?: string;
  message?: string;
  code?: number;
  count?: T;
  data: T;
  cookie?: string;
  token?: string;
  account?: T;
}

// 不固定接口返回值类型
export type ResponseType = Record<string, any>;

// 循环类型，forEach map...
export type LoopType = Record<string, any>;
