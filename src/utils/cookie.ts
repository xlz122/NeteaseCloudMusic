/**
 * @desc 设置cookie
 * @param { String } key - key
 * @param { String } value - value
 * @param { String | Number } [expires] - 过期时间，可选
 */
export function setCookie(key: string, value: string, expires?: string | number): void {
  // 过期时间不存在，设置一天过期
  // 转回中国时间 new Date(new Date('expires').getTime())
  if (!expires) {
    expires = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000).toUTCString();
  }
  document.cookie = `${key}=${value};expires=${expires}`;
}

/**
 * @desc 获取cookie
 * @param { String } key - key
 */
export function getCookie(key: string) {
  key = key + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(key) != -1) return c.substring(key.length, c.length);
  }
  return '';
}

/**
 * @desc 删除cookie
 * @param { String } key - key
 */
export function removeCookie(key: string): void {
  setCookie(key, '', -1);
}
