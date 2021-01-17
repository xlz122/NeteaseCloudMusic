/**
 * @desc 时间戳转视频时长
 */
/* eslint-disable */
// @ts-nocheck
export function timeStampToDuration(timeStamp: number): string {
  const a = timeStamp.toString();
  let h = 0,
    i = 0,
    s = parseInt(a);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
    if (i > 60) {
      h = parseInt(i / 60);
      i = parseInt(i % 60);
    }
  }
  // 补零
  const zero = function (v) {
    return v >> 0 < 10 ? "0" + v : v;
  };
  let h2 = zero(h);
  let i2 = zero(i);
  let s2 = zero(s);
  let ok = "";
  if (h2 <= 0) {
    ok = [i2, s2].join(":");
  } else {
    ok = [h2, i2, s2].join(":");
  }
  return ok;
};
