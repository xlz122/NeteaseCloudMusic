// 获取promise的返回类型
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// 联合类型缩小范围（使用is关键字）
// 例如：age: string | number，精确到 number 或 string
export const isString = (arg: unknown): arg is string =>
  typeof arg === 'string';
export const isNumber = (arg: unknown): arg is number =>
  typeof arg === 'number';
