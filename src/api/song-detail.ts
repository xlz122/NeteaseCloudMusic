import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取歌曲详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } ids - 歌曲id
 */
export const songDetail = ({ ids }: { ids: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    ids
  };
  return axios.request({
    url: '/song/detail',
    method: 'get',
    params
  });
};

/**
 * @desc 获取歌曲评论
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 * @param { Number } [offset] - 页数
 * @param { Number } [limit] - 每页评论条数，默认20
 * @param { Number } [before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */

type CommentMusic = {
  id: number;
  offset?: number;
  limit?: number;
  before?: number;
};

export const commentMusic = ({
  id,
  offset,
  limit,
  before
}: CommentMusic): AxiosRequest => {
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
 * @desc 获取歌曲的相似歌单
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 */
export const simiPlaylist = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/simi/playlist',
    method: 'get',
    params
  });
};

/**
 * @desc 获取相似歌曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 */
export const simiSong = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/simi/song',
    method: 'get',
    params
  });
};
