/**
 * @description 获取值的原始类型字符串
 */
function toRawType(value: unknown): string {
  const _toString = Object.prototype.toString;

  return _toString.call(value).slice(8, -1);
}

/**
 * @description 检测是否是自己的属性
 * @param { Object } obj - 源对象
 * @param { String } key - key值
 */
function hasOwn(obj: object, key: string): boolean {
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  return hasOwnProperty.call(obj, key);
}

/**
 * @description 去除首尾空格
 * @param { String } str - 字符串
 */
function trim(str: string): string {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

export { toRawType, hasOwn, trim };
