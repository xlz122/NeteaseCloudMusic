/**
 * @description 获取当前星期几
 */
export function getTodayDayOfWeek(): string {
  const days = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];

  return days[new Date().getDay()];
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
 * @description 日期字符串/时间戳转日期字符串
 */
export function formatDateTime(
  date: string | number,
  fmt = 'yyyy-MM-dd hh:mm:ss'
): string {
  if (!date) {
    return '';
  }

  let d: Date = new Date();

  if (typeof date === 'number') {
    d = new Date(date * 1000);
  }
  if (typeof date === 'string') {
    d = new Date(new Date(date).getTime());
  }

  const o = {
    // 月份
    'M+': d.getMonth() + 1,
    // 日
    'd+': d.getDate(),
    // 小时
    'h+': d.getHours(),
    // 分
    'm+': d.getMinutes(),
    // 秒
    's+': d.getSeconds(),
    // 季度
    'q+': Math.floor((d.getMonth() + 3) / 3),
    // 毫秒
    S: d.getMilliseconds()
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt
      .replace(RegExp.$1, d.getFullYear() + '')
      .substr(4 - RegExp.$1.length);
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-expect-error - unknown
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }

  return fmt;
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
  // 一小时
  // const hour = minute * 60;
  // 一天
  // const day = hour * 24;
  // 一个月
  // const month = day * 30;

  // 计算差异时间的量级
  // const monthC = diffValue / month;
  // const weekC = diffValue / (7 * day);
  // const dayC = diffValue / day;
  // const hourC = diffValue / hour;
  const minC = diffValue / minute;

  // 数值补0方法
  function zero(value: number): string | number {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  }

  // 当前时间
  const date = new Date(timestamp);

  // 小于上一年12月31号23:59:59
  const lastYear = new Date(
    Date.parse(
      `${new Date().getFullYear() - 1}-12-31 23:59:59`.replace(/-/g, '/')
    )
  ).getTime();
  if (timestamp < lastYear) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  // 三天前 23:59:59
  const threeDaysAgo = new Date(
    new Date(new Date().toLocaleDateString()).getTime() -
      24 * 60 * 60 * 1000 * 2 -
      1000
  ).getTime();
  if (timestamp < threeDaysAgo) {
    return `${
      date.getMonth() + 1
    }月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
  }

  // 小于前天 23:59:59
  const dayBeforeYesterday = new Date(
    new Date(new Date().toLocaleDateString()).getTime() -
      24 * 60 * 60 * 1000 -
      1000
  ).getTime();
  if (timestamp < dayBeforeYesterday) {
    return `前天 ${date.getHours()}:${date.getMinutes()}`;
  }

  // 小于昨天 23:59:59
  const yesterday = new Date(
    new Date(new Date().toLocaleDateString()).getTime() - 1
  ).getTime();
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

/**
 * @description 大数字转换, 将大额数字转换为万、千万、亿等
 * @param { number | string } value 数字值
 */
export function bigNumberTransform(value: number | string): number | string {
  if (!value) {
    return value;
  }

  const newValue = Number(value);

  // 小于1万
  if (newValue < 10000) {
    return value.toString();
  }
  // 小于1亿
  if (newValue < 100000000) {
    return (newValue / 10000).toFixed(1) + '万';
  }
  // 小于10亿
  if (newValue < 1000000000) {
    return (newValue / 10000).toFixed(0) + '万';
  }
  // 大于10亿
  if (newValue > 1000000000) {
    return (newValue / 10000).toFixed(0) + '万';
  }

  return newValue;
}

/**
 * @description 字符串匹配
 * @param { string } str - 原始字符串
 * @param { string } value - 匹配值
 */
export function handleMatchString(str: string, value: string): string {
  if (!str) {
    return str;
  }

  const html = str.replaceAll?.(
    value,
    `<span style="color: #0c73c2">${value}</span>`
  );

  return html;
}

/**
 * @description 时间戳转为日期字符串
 * @param { number } time - 时间戳
 */
export function filterTime(time: number): string {
  const date = new Date(time);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  return `${Y}-${M}-${D}`;
}

/**
 * @description 动态加载图片
 * @param { string } path - 图片路径(相对于src目录)
 */
export function getImageUrl(path: string): string {
  return new URL(`../${path}`, import.meta.url).href;
}
