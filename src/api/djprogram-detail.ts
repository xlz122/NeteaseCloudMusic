import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取电台节目详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } rid 电台节目id
 */
export const djProgramDetail = ({ id }: { id: number }): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id
  };
  return axios.request({
    url: '/dj/program/detail',
    method: 'get',
    params
  });
};

/**
 * @desc 获取电台节目评论列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 专辑id
 * @param { Number } [offset] - 页数
 * @param { Number } [limit] - 每页评论条数，默认20
 * @param { Number } [before] - 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */

type CommentDjprogram = {
  id: number;
  offset?: number;
  limit?: number;
  before?: number;
};

export const commentDjprogram = ({
  id,
  offset,
  limit,
  before
}: CommentDjprogram): AxiosRequest => {
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
