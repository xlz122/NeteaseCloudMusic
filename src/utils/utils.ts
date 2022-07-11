/**
 * @description 日期字符串转时间戳
 * @param { String} - 日期字符串
 * @returns { Nubmer } 时间戳
 */
export function datestrToTimestamp(datestr: string): number {
  return new Date(Date.parse(datestr.replace(/-/g, '/'))).getTime();
}

/**
 * @description 获取当前星期几
 * @return { String } 星期几
 */
export function getWeekDate(): string {
  const now = new Date();
  const day = now.getDay();
  const weeks = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];
  const week = weeks[day];

  return week;
}

/**
 * @description 时间戳转视频时长
 * @return { String } 视频时长 01:23:45
 */
export function timeStampToDuration(timeStamp: number): string {
  const time = timeStamp.toString();
  let h = 0,
    i = 0,
    s = parseInt(time);
  if (s > 60) {
    i = parseInt((s / 60).toString());
    s = parseInt((s % 60).toString());
    if (i > 60) {
      h = parseInt((i / 60).toString());
      i = parseInt((i % 60).toString());
    }
  }
  // 补零
  const zero = function (v: number) {
    return v >> 0 < 10 ? '0' + v : v;
  };
  const h2 = zero(h);
  const i2 = zero(i);
  const s2 = zero(s);
  let ok = '';
  if (h2 <= 0) {
    ok = [i2, s2].join(':');
  } else {
    ok = [h2, i2, s2].join(':');
  }

  return ok;
}

/**
 * @description 日期字符串/时间戳转日期字符串
 * @param { String | Number | Date } - date 日期字符串/时间戳/Date
 * @param { String } - 日期字符串格式
 */
export function formatDateTime(
  date: string | Date | number,
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
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }

  return fmt;
}

/**
 * @description 时间戳转日期字符串，主要用于评论时间
 * @param { Nubmer} - 时间戳
 * @returns { String } 格式化后的日期字符串
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
 * 大数字转换，将大额数字转换为万、千万、亿等
 * @param value 数字值
 */
export function bigNumberTransform(value: number | string): number | string {
  const newValue = Number(value);
  if (isNaN(newValue)) {
    return value;
  }

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
 * @description 获取滚动条距离页面底部的高度
 * @param { MouseEvent } event 滚动条事件对象
 */
export function getPageBottomHeight(e: Event): number {
  const target = e.target as Document;
  // 总的滚动的高度
  const scrollHeight =
    (target ? target.documentElement.scrollHeight : false) ||
    (target ? target.body.scrollHeight : 0);
  // 视口高度
  const clientHeight =
    (target ? target.documentElement.clientHeight : false) ||
    (target ? target.body.clientHeight : 0);
  // 当前滚动的高度
  const scrollTop =
    (target ? target.documentElement.scrollTop : false) ||
    (target ? target.body.scrollTop : 0);
  // 距离底部高度(总的高度 - 视口高度 - 滚动高度)
  const bottomHeight = scrollHeight - clientHeight - scrollTop;

  return bottomHeight;
}

/**
 * @description 字符串匹配
 * @param { String } str - 原始字符串
 * @param { String } value - 匹配值
 */
export function handleMatchString(str: string, value: string): string {
  const html = str?.replaceAll(
    value,
    `<span style="color: #0c73c2">${value}</span>`
  );

  return html || str;
}

// 时间戳转为正常时间的公共方法---2020-02-02
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
