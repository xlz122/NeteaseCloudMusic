import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

type CommentParams = {
  id?: number | string;
  offset?: number;
  limit?: number;
  before?: number;
};

/**
 * @description 获取歌曲评论列表
 * @param { Object } params
 * @param { number } params.id - 歌曲id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const musicComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/music',
    method: 'get',
    params
  });
};

/**
 * @description 获取歌单评论列表
 * @param { Object } params
 * @param { number } params.id - 歌单id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const playlistComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/playlist',
    method: 'get',
    params
  });
};

/**
 * @description 获取专辑评论列表
 * @param { Object } params
 * @param { number } params.id - 专辑id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const albumComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/album',
    method: 'get',
    params
  });
};

/**
 * @description 获取电台节目评论列表
 * @param { Object } params
 * @param { number } params.id - 节目id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const djprogramComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/dj',
    method: 'get',
    params
  });
};

/**
 * @description 获取视频评论列表
 * @param { Object } params
 * @param { number } params.id - 视频id
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const videoComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/video',
    method: 'get',
    params
  });
};

/**
 * @description 获取MV评论列表
 * @param { Object } params
 * @param { number } params.id - mvid
 * @param { number } [params.offset] - 页数(默认为0)
 * @param { number } [params.limit] - 偏移量(默认为20)
 * @param { number } [params.before] - 分页参数, 取上一页最后一项的 time 获取下一页数据
 */
export const mvComment = ({ id, offset, limit, before }: CommentParams): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    offset,
    limit,
    before
  };

  return axios.request({
    url: '/comment/mv',
    method: 'get',
    params
  });
};

type AddComment = {
  type: number;
  id: number;
  content: string;
};

/**
 * @description 新增评论
 * @param { Object } params
 * @param { number } params.type -  0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param { number } params.id - type类型id
 * @param { string } params.content - 评论内容
 */
export const addComment = ({ type, id, content }: AddComment): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    t: 1, // 1: 新增评论
    type,
    id,
    content
  };

  const paramsStr = `t=${params.t}&type=${params.type}&id=${params.id}&content=${params.content}`;

  return axios.request({
    url: `/comment?timestamp=${params.timestamp}&${paramsStr}`,
    method: 'get'
  });
};

type ReplyComment = {
  type: number;
  id: number;
  content: string;
  commentId: number;
};

/**
 * @description 回复歌单评论
 * @param { Object } params
 * @param { number } params.type -  0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param { number } params.id - type类型id
 * @param { string } params.content - 评论内容
 * @param { number } params.commentId - 内容id
 */
export const replyComment = ({ type, id, content, commentId }: ReplyComment): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    t: 2, // 2: 回复评论
    type,
    id,
    content,
    commentId
  };

  const paramsStr = `t=${params.t}&type=${params.type}&id=${params.id}&content=${params.content}`;

  return axios.request({
    url: `/comment?timestamp=${params.timestamp}&${paramsStr}&commentId=${params.commentId}`,
    method: 'get'
  });
};

type DeleteComment = {
  type: number;
  id: number;
  commentId: number;
};

/**
 * @description 删除评论
 * @param { Object } params
 * @param { number } params.type -  0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param { number } params.id - type类型id
 * @param { number } params.commentId - 内容id
 */
export const deleteComment = ({ type, id, commentId }: DeleteComment): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    t: 0, // 0: 删除
    type,
    id,
    commentId
  };

  const paramsStr = `t=${params.t}&type=${params.type}&id=${params.id}&commentId=${params.commentId}`;

  return axios.request({
    url: `/comment?timestamp=${params.timestamp}&${paramsStr}`,
    method: 'get'
  });
};

type SongSheetLike = {
  type: number;
  id: number;
  cid: number;
  t: number;
};

/**
 * @description 评论点赞
 * @param { Object } params
 * @param { number } params.type -  0: 歌曲, 1: mv, 2: 歌单, 3: 专辑, 4: 电台, 5: 视频, 6: 动态
 * @param { number } params.id - type类型id
 * @param { number } params.cid - 评论id
 * @param { number } params.t - 是否点赞(0: 取消点赞, 1: 点赞)
 */
export const commentLike = ({ type, id, cid, t }: SongSheetLike): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    type,
    id,
    cid,
    t
  };

  const paramsStr = `type=${params.type}&id=${params.id}&cid=${params.cid}&t=${params.t}`;

  return axios.request({
    url: `/comment/like?timestamp=${params.timestamp}&${paramsStr}`,
    method: 'get'
  });
};
