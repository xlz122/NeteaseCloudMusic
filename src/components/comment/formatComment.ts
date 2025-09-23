import { formatMixedText } from '@/utils/formatMixedText';
import type { ResponseType } from '@/types';

type Comment = {
  hotList: ItemType[];
  list: ItemType[];
  total: number;
};

type ItemType = {
  replyShow: boolean;
  content: string;
  beReplied: {
    content: string;
  }[];
  liked: boolean;
  likedCount: number;
};

/**
 * @description 评论数据格式化
 * @param { Object } res - 评论数据
 */
export function formatComment(res: ResponseType): Comment {
  const comment: Comment = {
    hotList: [],
    list: [],
    total: 0
  };

  // 精彩评论
  res.hotComments?.forEach?.((item: ItemType) => {
    item.replyShow = false;
    item.content = formatMixedText(item.content);
    // 他人回复转换
    if (item.beReplied[0]) {
      item.beReplied[0].content = formatMixedText(item.beReplied[0]?.content);
    }
  });
  comment.hotList = res.hotComments ?? [];

  // 最新评论
  res.comments?.forEach?.((item: ItemType) => {
    item.replyShow = false;
    item.content = formatMixedText(item.content);
    // 他人回复转换
    if (item.beReplied[0]) {
      item.beReplied[0].content = formatMixedText(item.beReplied[0]?.content);
    }
  });
  comment.list = res.comments ?? [];

  comment.total = res.total ?? 0;

  return comment;
}
