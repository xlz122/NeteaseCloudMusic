import { expressionList } from '@/components/comment/comment-replay/comment-replay';

/**
 * @description 混合文本格式化
 * @param { string } content - 内容字符串
 */
export function formatMixedText(content: string): string {
  if (!content) {
    return '';
  }

  let contentStr = JSON.parse(JSON.stringify(content));
  const reg = /\[.+?\]/g;

  content.replace(reg, function (item: string) {
    // 去除重复的[]符号
    item = character(item);
    // 表情文本
    const expressionText = item.split('[')[1].split(']')[0];
    // 匹配表情对应的数据项
    const expressionItem = expressionList.find?.(
      (item: { title: string }) => item.title === expressionText
    );

    // 表情替换为img标签
    if (expressionItem) {
      contentStr = contentStr.replace(
        item,
        `<img 
          src='http://s1.music.126.net/style/web2/emt/emoji_${expressionItem.num}.png'
          style="display: inline-block; vertical-align: middle;"
        />`
      );
    }

    return item;
  });

  return contentStr;
}

/**
 * @description 去除重复的[]符号
 * @param { string } chareacterStr - 带有重复[]的表情字符串
 */
function character(chareacterStr: string): string {
  const result = [];
  // 字符串转换成数组
  const arr = chareacterStr.split('');

  // 去重
  for (let j = 0; j < arr.length; j++) {
    if (arr[j] === '[' && result.indexOf('[') < 0) {
      result.push(arr[j]);
    }
    if (arr[j] === ']' && result.indexOf(']') < 0) {
      result.push(arr[j]);
    }
    const rIndex = result.findIndex?.((item: string) => item === '[');
    if (rIndex > -1) {
      if (arr[j] !== '[' && arr[j] !== ']') {
        result.push(arr[j]);
      }
    }
  }

  // 数组转换成字符串
  return result.join('');
}
