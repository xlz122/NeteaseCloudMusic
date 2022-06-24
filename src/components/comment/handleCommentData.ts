import { formatMixedText } from '@utils/formatMixedText';
import type { ResponseType } from '@/types/types';

type CommentReturn = {
  hotList: List[];
  list: List[];
};

type List = {
  replyShow: boolean;
  content: string;
  beReplied: Record<string, { content: string }>;
  liked: boolean;
  likedCount: number;
};

/**
 * @description 处理评论数据
 * @param { Object } data - 评论数据
 */
export function handleCommentData(data: ResponseType): CommentReturn {
  const result = {
    hotList: [],
    list: []
  };
  // 精彩评论
  if (data.hotComments) {
    data.hotComments.forEach((item: List) => {
      item.replyShow = false;
      item.content = formatMixedText(item.content);
      // 他人回复进行转换
      if (item.beReplied[0]) {
        item.beReplied[0].content = formatMixedText(
          item?.beReplied[0]?.content
        );
      }
    });
    result.hotList = data?.hotComments;
  }

  // 最新评论
  data?.comments.forEach((item: List) => {
    item.replyShow = false;
    item.content = formatMixedText(item.content);
    // 他人回复进行转换
    if (item.beReplied[0]) {
      item.beReplied[0].content = formatMixedText(item?.beReplied[0]?.content);
    }
  });
  result.list = data.comments;

  return result;
}
