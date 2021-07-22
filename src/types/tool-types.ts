// 内置类型（复制类型接口，直接使用）
// type Partial<T> = {
//   [k in keyof T]?: T[k];
// };

// 获取函数返回值的工具类型 ReturnType
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

// 获取promise的返回类型
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// 联合类型缩小范围（使用is关键字）
// 例如：age: string | number，精确到 number 或 string
export const isString = (arg: unknown): arg is string => typeof arg === 'string';
export const isNumber = (arg: unknown): arg is number => typeof arg === 'number';

// 泛型约束
// 如果觉得 extends 不太好理解，可以暂时简单的理解为U中的属性在T中都有
export function findKey<T extends object, U extends keyof T>(obj: T, key: U): T[U] {
  return obj[key];
}
