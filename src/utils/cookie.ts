/**
 * @description 设置cookie
 * @param { string } key - key
 * @param { string } value - value
 * @param { number } [maxAge] - 过期时间(秒数)
 */
export function setCookie(key: string, value: string, maxAge?: number): void {
  // 过期时间不存在, 设置一天过期
  if (!maxAge) {
    maxAge = 1 * 24 * 60 * 60 * 1000;
  }

  document.cookie = `${key}=${value};Max-Age=${maxAge}`;
}

/**
 * @description 获取cookie
 * @param { string } key - key
 */
export function getCookie(key: string): string {
  key = key + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(key) !== -1) return c.substring(key.length, c.length);
  }
  return '';
}

/**
 * @description 删除cookie
 * @param { string } key - key
 */
export function removeCookie(key: string): void {
  setCookie(key, '', -1);
}

/**
 * @description 清除所有cookie
 */
export function clearAllCookie(): void {
  const date = new Date();
  date.setTime(date.getTime() - 10000);
  // eslint-disable-next-line
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g);

  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0; expire=' + date.toUTCString() + '; path=/';
    }
  }
}
