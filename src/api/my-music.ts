import axios from '@/utils/axios';
import type { AxiosPromise } from 'axios';

/**
 * @description 获取用户歌单(收藏、mv、dj数量)
 */
export const userSubcount = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/user/subcount',
    method: 'get',
    params
  });
};

/**
 * @description 获取我的歌手列表
 */
export const subPlayList = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/artist/sublist',
    method: 'get',
    params
  });
};

/**
 * @description 获取我的视频列表
 */
export const videoSbulist = (): AxiosPromise => {
  const params = { timestamp: new Date().getTime() };

  return axios.request({
    url: '/mv/sublist',
    method: 'get',
    params
  });
};

/**
 * @description 获取用户歌单列表
 * @param { Object } params
 * @param { number } params.uid - 用户id
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
 * @param { Object } params
 * @param { string } params.name - 歌单名称
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
 * @param { Object } params
 * @param { number } params.id - 歌单id
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
 * @param { Object } params
 * @param { number } params.id - 歌单id
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

type CollectSong = {
  pid: number | string;
  tracks: number | string;
};

/**
 * @description 添加歌曲到歌单
 * @param { Object } params
 * @param { string } params.op - 添加为add, 删除为del
 * @param { (number | string) } params.pid: 歌单id
 * @param { (number | string) } params.tracks - 歌曲id
 */
export const collectSong = ({ pid, tracks }: CollectSong): AxiosPromise => {
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

type DeleteSong = {
  pid: number | string;
  tracks: number | string;
};

/**
 * @description 删除歌单歌曲
 * @param { Object } params
 * @param { string } params.op - 添加为add, 删除为del
 * @param { (number | string) } params.pid: 歌单id
 * @param { (number | string) } params.tracks - 歌曲id
 */
export const deleteSong = ({ pid, tracks }: DeleteSong): AxiosPromise => {
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

type GetSongPlayUrl = {
  id: number | string;
  br?: number | string;
};

/**
 * @description 获取播放url
 * @param { Object } params
 * @param { (number | string) } params.id - 歌曲id
 * @param { number } [params.br] - 码率, 默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 */
export const getSongPlayUrl = ({ id, br }: GetSongPlayUrl): AxiosPromise => {
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

/**
 * @description 获取歌词
 * @param { Object } params
 * @param { number } params.id - 歌曲id
 */
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
