import { ResponseType, LoopType } from '@/types/types';
import { formatMixedText } from '@utils/formatMixedText';

type CommentReturn = {
  hotList: List[];
  list: List[];
};

type List = {
  replyShow: boolean;
  liked: boolean;
  likedCount: number;
};

export function handleCommentData(data: ResponseType): CommentReturn {
  const result = {
    hotList: [],
    list: []
  };
  // 精彩评论
  if (data.hotComments) {
    data.hotComments.forEach((item: LoopType) => {
      item.replyShow = false;
      item.content = formatMixedText(item.content);
      // 他人回复也进行转换
      if (item.beReplied[0]) {
        item.beReplied[0].content = formatMixedText(
          item?.beReplied[0]?.content
        );
      }
    });
    result.hotList = data?.hotComments;
  }

  // 最新评论
  data?.comments.forEach((item: LoopType) => {
    item.replyShow = false;
    item.content = formatMixedText(item.content);
    // 他人回复也进行转换
    if (item.beReplied[0]) {
      item.beReplied[0].content = formatMixedText(item?.beReplied[0]?.content);
    }
  });
  result.list = data.comments;

  return result;
}
