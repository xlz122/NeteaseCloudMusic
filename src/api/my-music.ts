import axios from '@utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取用户歌单，收藏，mv, dj 数量
 * @param { Number } timestamp - 防止接口缓存
 */
export const userSubcount = (): AxiosPromise => {
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
export const subPlayList = (): AxiosPromise => {
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
export const MyVideoSbulist = (): AxiosPromise => {
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
export const userPlayList = ({ uid }: { uid: number }): AxiosPromise => {
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
export const addPlayList = ({ name }: { name: string }): AxiosPromise => {
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
export const deletePlayList = ({ id }: { id: number }): AxiosPromise => {
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
export const playListDetail = ({ id }: { id: number }): AxiosPromise => {
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
 * @description 添加歌曲到歌单
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } op - 添加歌曲到歌单 add, 删除为 del
 * @param { Number } pid: 歌单 id
 * @param { Number } id - 歌曲id
 */

type CollectMusic = {
  pid: number | string;
  tracks: number | string;
};

export const collectMusic = ({ pid, tracks }: CollectMusic): AxiosPromise => {
  const params = {
    timestamp: new Date().getTime(),
    op: 'add',
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
 * @description 删除歌单歌曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } op - 添加歌曲到歌单 add, 删除为 del
 * @param { Number } pid: 歌单 id
 * @param { Number } id - 歌曲id
 */

type DeleteMusic = {
  pid: number | string;
  tracks: number | string;
};

export const deleteMusic = ({ pid, tracks }: DeleteMusic): AxiosPromise => {
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

export const getPlayMusicUrl = ({ id, br }: GetPlayMusicUrl): AxiosPromise => {
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
export const getLyric = ({ id }: GetLyric): AxiosPromise => {
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
