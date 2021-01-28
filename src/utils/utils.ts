/* eslint-disable */
// @ts-nocheck
/**
 * @desc 时间戳转视频时长
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
  const zero = function(v: number) {
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
 * @desc 日期格式化
 * @param { String | Date } - date 日期或者时间戳
 * @param { String } - fmt 格式化后的日期字符串格式
 */
export function formatDateTime(
  date: string | Date,
  fmt = 'yyyy-MM-dd hh:mm:ss'
) {
  if (!date) {
    return '';
  }
  if (typeof date === 'number') {
    date = new Date(date * 1000);
  }
  const o = {
    'M+': (date as Date).getMonth() + 1, // 月份
    'd+': (date as Date).getDate(), // 日
    'h+': (date as Date).getHours(), // 小时
    'm+': (date as Date).getMinutes(), // 分
    's+': (date as Date).getSeconds(), // 秒
    'q+': Math.floor(((date as Date).getMonth() + 3) / 3), // 季度
    // eslint-disable-next-line
    'S': (date as Date).getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt
      .replace(RegExp.$1, (date as Date).getFullYear() + '')
      .substr(4 - RegExp.$1.length);
  }
  for (const k in o) {
    /* eslint-disable */
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt
        .replace(
          RegExp.$1, (RegExp.$1.length == 1)
            // @ts-ignore
            ? o[k]
            // @ts-ignore
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
    }
    /* eslint-enable */
  }
  return fmt;
}

/**
 * @desc 格式化日期字符串
 * @param { Nubmer} - 时间戳
 * @returns { String } 格式化后的日期字符串
 */
export function formatDate(timestamp: number) {
  // 补全为13位
  let arrTimestamp = (timestamp + '').split('');
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) {
      arrTimestamp[start] = '0';
    }
  }
  timestamp = arrTimestamp.join('') * 1;
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - timestamp;
  // 如果本地时间反而小于变量时间
  if (diffValue < 0) {
    return '不久前';
  }
  // 计算差异时间的量级
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  // 数值补0方法
  let zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };
  // 使用
  if (monthC > 4) {
    // 超过1年，直接显示年月日
    return (function () {
      let date = new Date(timestamp);
      return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
    })();
  } else if (monthC >= 1) {
    return parseInt(monthC) + '月前';
  } else if (weekC >= 1) {
    return parseInt(weekC) + '周前';
  } else if (dayC >= 1) {
    return parseInt(dayC) + '天前';
  } else if (hourC >= 1) {
    return parseInt(hourC) + '小时前';
  } else if (minC >= 1) {
    return parseInt(minC) + '分钟前';
  }
  return '刚刚';
}
