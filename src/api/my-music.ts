import axios from '@utils/axios';
import { AxiosRequest } from '@/types/types';

/**
 * @description 获取用户歌单，收藏，mv, dj 数量
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
 * @description 获取我的歌手列表
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
 * @description 获取我的视频列表
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
 * @description 获取用户歌单列表
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
 * @description 新增用户歌单
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
 * @description 删除用户歌单
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
 * @description 获取用户歌单详情
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
 * @description 删除歌单歌曲
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
 * @description 获取播放url
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
