/**
 * @description 获取值的原始类型字符串
 */
function toRawType(value: unknown): string {
  const _toString = Object.prototype.toString;

  return _toString.call(value).slice(8, -1);
}

export { toRawType };
