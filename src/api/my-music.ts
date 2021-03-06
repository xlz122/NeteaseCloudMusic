import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取用户歌单，收藏，mv, dj 数量
 * @param { Number } timestamp - 防止接口缓存
 */
export const userSubcount = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/user/subcount',
    method: 'get',
    params
  });
};

/**
 * @desc 获取我的歌手列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const subPlayList = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/artist/sublist',
    method: 'get',
    params
  });
};

/**
 * @desc 获取我的视频列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const myMvSbulist = (): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime()
  };
  return axios.request({
    url: '/mv/sublist',
    method: 'get',
    params
  });
};

/**
 * @desc 获取用户歌单列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } uid - 账号id
 */
export const userPlayList = ({ uid }: { uid: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    uid
  };
  return axios.request({
    url: '/user/playlist',
    method: 'get',
    params
  });
};

/**
 * @desc 新增用户歌单
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } name - 歌单名称
 */
export const addPlayList = ({ name }: { name: string }): AxiosRequest => {
  const data = {
    timestamp: new Date().getTime(),
    name
  };
  return axios.request({
    url: '/playlist/create',
    method: 'post',
    data
  });
};

/**
 * @desc 删除用户歌单
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 */
export const deletePlayList = ({ id }: { id: number }): AxiosRequest => {
  const data = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/playlist/delete',
    method: 'post',
    data
  });
};

/**
 * @desc 获取用户歌单详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 */
export const playListDetail = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};

/**
 * @desc 删除歌单歌曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } op - 从歌单增加单曲为 add, 删除为 del
 * @param { Number } pid: 歌单 id
 * @param { Number } id - 歌曲id
 */

type DeleteMusic = {
  pid: number | string;
  tracks: number | string;
};

export const deleteMusic = ({ pid, tracks }: DeleteMusic): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    op: 'del',
    pid,
    tracks
  };
  return axios.request({
    url: '/playlist/tracks',
    method: 'get',
    params
  });
};

/**
 * @desc 获取歌单评论列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 * @param { Number } [offset] - 页数
 * @param { Number } [limit] - 每页评论条数，默认20
 * @param { Number } [before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */

type CommentPlayList = {
  id: number;
  offset?: number;
  limit?: number;
  before?: number;
};

export const commentPlayList = ({
  id,
  offset,
  limit,
  before
}: CommentPlayList): AxiosRequest => {
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
 * @desc 新增歌单评论
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 * @param { String } content - 评论内容
 */

type AddComment = {
  id: number;
  content: string;
};

export const addSongSheetComment = ({
  id,
  content
}: AddComment): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    t: 1, // t 1为新增评论
    tpye: 2, // type 2为歌单
    id,
    content
  };
  return axios.request({
    url: `/comment?
      timestamp=${params.timestamp}&t=${params.t}
      &type=${params.tpye}&id=${params.id}&content=${params.content}
    `,
    method: 'get'
  });
};

/**
 * @desc 回复歌单评论
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 * @param { String } content - 评论内容
 * @param { Number } commentId - 内容id
 */

type ReplyComment = {
  id: number;
  content: string;
  commentId: number;
};

export const replySongSheetComment = ({
  id,
  content,
  commentId
}: ReplyComment): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    t: 2, // t 1为回复评论
    tpye: 2, // type 2为歌单
    id,
    content,
    commentId
  };
  return axios.request({
    url: `/comment?
      timestamp=${params.timestamp}&t=${params.t}&type=${params.tpye}&id=${params.id}
      &content=${params.content}&commentId=${params.commentId}
    `,
    method: 'get'
  });
};

/**
 * @desc 删除歌单评论
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 * @param { Number } commentId - 内容id
 */

type DeleteComment = {
  id: number;
  commentId: number;
};

export const deleteSongSheetComment = ({
  id,
  commentId
}: DeleteComment): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    t: 0, // t 0为删除
    tpye: 2, // type 2为歌单
    id,
    commentId
  };
  return axios.request({
    url: `/comment?
      timestamp=${params.timestamp}&t=${params.t}&type=${params.tpye}
      &id=${params.id}&commentId=${params.commentId}
    `,
    method: 'get'
  });
};

/**
 * @desc 歌单评论点赞
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 * @param { Number } cid - 评论id
 * @param { Number } t - 是否点赞 ,1 为点赞 ,0 为取消点赞
 */

type SongSheetLike = {
  id: number;
  cid: number;
  t: number;
};

export const songSheetLike = ({ id, cid, t }: SongSheetLike): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    tpye: 2, // type 2为歌单
    id,
    cid,
    t
  };
  return axios.request({
    url: `/comment/like?
      timestamp=${params.timestamp}&type=${params.tpye}
      &id=${params.id}&cid=${params.cid}&t=${params.t}
    `,
    method: 'get'
  });
};

/**
 * @desc 获取播放url
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 * @param { Number } [br] - 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 */

type GetPlayMusicUrl = {
  id: number | string;
  br?: number | string;
};

export const getPlayMusicUrl = ({ id, br }: GetPlayMusicUrl): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    br
  };
  return axios.request({
    url: '/song/url',
    method: 'get',
    params
  });
};

type GetLyric = {
  id: number | string;
};

// 获取歌词
export const getLyric = ({ id }: GetLyric): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/lyric',
    method: 'get',
    params
  });
};
