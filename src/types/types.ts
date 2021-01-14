// 接口返回值类型
export interface ResponseDataType<T = any> {
  msg?: string;
  code?: number;
  data: T;
  cookie?: string;
}
