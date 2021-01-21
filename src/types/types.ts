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
export interface ResponseType {
  [key: string]: any;
}

// 循环类型，forEach map...
export interface LoopType {
  [key: string]: any;
}
