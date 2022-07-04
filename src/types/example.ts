// 获取函数返回值的工具类型 ReturnType示例
/*
function foo(): string {
  return '';
}

// string
type FooReturnType = ReturnType<typeof foo>;
*/

// 获取promise的返回类型示例
/*
type User = {
  name: string;
  age: number;
  sex: string;
};

function foo(): Promise<User> {
  return new Promise(resolve => {
    resolve({
      name: '',
      age: 26,
      sex: ''
    });
  });
}

type FooReturnType = ReturnType<typeof foo>;

// infer 类似loading占位符
// 当传递类型进来的时候，类型系统在获得 足够的信息后，就能将 infer 后跟随的类型参数推导出来
type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

type FooPromiseType = PromiseType<FooReturnType>;
*/

// 联合类型缩小范围示例
/*
const isString = (arg: unknown): arg is string => typeof arg === 'string';
const isNumber = (arg: unknown): arg is number => typeof arg === 'number';

function getAge(age: number | string): void {
  if (isNumber(age)) {
    console.log('age是数字类型');
  }
  if (isString(age)) {
    console.log('age是字符串类型');
  }
}
getAge(26);
*/

// 登录与未登录下的用户信息是完全不同的接口，in关键字示例
/*
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
*/
