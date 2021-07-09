import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取歌单列表
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } order - 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * @param { String } cat - tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部"
 * @param { Number } offset - 页数，默认为 0
 * @param { Number } limit - 取出数量，默认为 50
 */

type TopPlaylist = {
  order?: string;
  cat?: string;
  offset: number;
  limit: number;
};

export const topPlaylist = ({
  order,
  cat,
  offset,
  limit
}: TopPlaylist): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    order,
    cat,
    offset,
    limit
  };
  return axios.request({
    url: '/top/playlist',
    method: 'get',
    params
  });
};

// 歌单分类： /playlist/catlist
// 热门歌单分类： /playlist/hot
