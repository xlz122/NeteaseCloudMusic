// 泛型约束
// 如果觉得 extends 不太好理解，可以暂时简单的理解为U中的属性在T中都有
// T 包含 U 的所有属性
function findKey<T extends object, U extends keyof T>(obj: T, key: U): T[U] {
  return obj[key];
}

// 联合类型缩小范围（使用is关键字）
// 例如：age: string | number，精确到 number 或 string
export const isString = (arg: unknown): arg is string => typeof arg === 'string';
export const isNumber = (arg: unknown): arg is number => typeof arg === 'number';
// 使用示例
function getAge(age: number | string): void {
  if (isNumber(age)) {
    console.log('age是数字类型');
  }
  if (isString(age)) {
    console.log('age是字符串类型');
  }
}
getAge(26);

// 获取函数返回值的工具类型 ReturnType
function getReturn(): string {
  return '';
}
// string
type GetReturnType = ReturnType<typeof getReturn>;

type Person = {
  name: string;
  age: number;
  sex: string;
};

// 实现一个和Person字段一样，类型一样的接口
type P<T> = {
  [k in keyof T]: T[k];
}

// 登录与未登录下的用户信息是完全不同的接口，其实也可以使用in关键字解决
interface ILogInUserProps {
  isLogin: boolean;
  name: string;
}

interface IUnLoginUserProps {
  isLogin: boolean;
  from: string;
}

function getUserInfo(user: ILogInUserProps | IUnLoginUserProps): string {
  return 'name' in user ? user.name : user.from;
}
