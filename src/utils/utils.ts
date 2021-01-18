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
