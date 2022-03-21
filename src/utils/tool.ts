/**
 * @description 获取值的原始类型字符串
 */
const _toString = Object.prototype.toString;
function toRawType(value: unknown): string {
  return _toString.call(value).slice(8, -1);
}

/**
 * @description 检测是否是自己的属性
 * @param { Object } - 源对象
 * @param { String } - key
 */
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj: object, key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

/**
 * @description 去除首尾空格
 */
function trim(str: string): string {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

export { toRawType, hasOwn, trim };
