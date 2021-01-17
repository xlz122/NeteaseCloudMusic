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
