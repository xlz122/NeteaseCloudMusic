/**
 * @description 节流函数
 * @param { Function } fn - 目标函数
 * @param delay 节流时间间隔（毫秒）
 * @returns 返回一个节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remainingTime = delay - (now - lastCallTime);

    if (remainingTime <= 0 || remainingTime > delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCallTime = now;
      return fn.apply(this, args);
    }

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remainingTime);
    }
  } as T;
}

/**
 * @description 获取图片资源
 * @param { string } path - 资源路径
 */
export const getImageUrl = (path: string): string | undefined => {
  const modules: Record<string, { default: string }> = import.meta.glob('/src/assets/**/*', {
    query: '?url',
    eager: true
  });

  if (!modules[path]) return;

  return modules[path].default;
};

/**
 * @description 获取当前星期几
 */
export function getTodayDayOfWeek(): string {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  return days[new Date().getDay()];
}

/**
 * @description 时间戳转日期字符串
 */
export function formatTimestamp(
  timestamp: number,
  formatString: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const date = new Date(timestamp);

  const map: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0')
  };

  return formatString.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
}

/**
 * @description 时间戳转视频时长
 * @param { number } timestamp - 时间戳
 * @return { string } 02:27/01:02:27
 */
export function timeStampToDuration(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  if (date.getUTCHours() === 0) {
    return `${minutes}:${seconds}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * @description 大额数字格式化
 * @param { number } number 数值
 */
export function formatLargeNumber(number: number): string {
  if (number === null || number === undefined || isNaN(number)) return '0';

  if (number >= 1e8) {
    return (number / 1e8).toFixed(1) + '亿';
  }
  if (number >= 1e4) {
    return (number / 1e4).toFixed(1) + '万';
  }

  return number.toString();
}

/**
 * @description 字符串匹配
 * @param { string } str - 原始字符串
 * @param { string } value - 匹配值
 */
export function handleMatchString(str: string, value: string): string {
  if (!str) return str;

  const htmlStr = str.replaceAll?.(value, `<span style="color: #0c73c2">${value}</span>`);

  return htmlStr;
}

/**
 * @description 时间戳转日期字符串, 用于评论时间
 * @param { number } timestamp - 时间戳
 */
export function formatDate(timestamp: number): string {
  // 补全为13位，缺少补0
  const arrTimestamp = timestamp.toString().split('');
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }

  // 转为数字时间戳
  timestamp = Number(arrTimestamp.join(''));

  // 当前时间 - 时间戳
  const now = new Date().getTime();
  // 当前时间与传入时间戳的差值
  const diffValue = now - timestamp;

  // 如果本地时间反而小于传入时间戳
  if (diffValue < 0) {
    return '不久前';
  }

  // 一分钟
  const minute = 1000 * 60;
  const minC = diffValue / minute;

  // 数值补零
  function zero(value: number): string | number {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  }

  // 当前时间
  const date = new Date(timestamp);

  // 去年
  const lastYear = new Date(
    Date.parse(`${new Date().getFullYear() - 1}-12-31 23:59:59`.replace(/-/g, '/'))
  ).getTime();
  if (timestamp < lastYear) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  // 三天前
  const threeDaysAgo = new Date(
    new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000 * 2 - 1000
  ).getTime();
  if (timestamp < threeDaysAgo) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
  }

  // 前天
  const dayBeforeYesterday = new Date(
    new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000 - 1000
  ).getTime();
  if (timestamp < dayBeforeYesterday) {
    return `前天 ${date.getHours()}:${date.getMinutes()}`;
  }

  // 昨天
  const yesterday = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1).getTime();
  if (timestamp < yesterday) {
    return `昨天 ${date.getHours()}:${date.getMinutes()}`;
  }

  // 超过一小时
  if (minC >= 60) {
    return `${zero(date.getHours())}:${zero(date.getMinutes())}`;
  }

  // 超过1分钟
  if (minC >= 1) {
    return `${minC.toFixed(0)}分钟前`;
  }

  return '刚刚';
}
