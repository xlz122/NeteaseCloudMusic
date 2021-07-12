import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @desc 获取歌单详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单 id
 * @param { Number } s - 歌单最近的 s 个收藏者,默认为8
 */
export const playlistDetail = ({
  id,
  s
}: {
  id: number;
  s?: number;
}): AxiosRequest => {
  const params = {
    timestamp: new Date().getTime(),
    id,
    s
  };
  return axios.request({
    url: '/playlist/detail',
    method: 'get',
    params
  });
};
