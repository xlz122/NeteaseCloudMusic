import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取歌曲评论
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id
 * @param { Number } [offset] - 页数
 * @param { Number } [limit] - 每页评论条数，默认20
 * @param { Number } [before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */

export type CommentParams = {
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
}: CommentParams): AxiosRequest => {
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
