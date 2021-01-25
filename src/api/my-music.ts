import axios from '@utils/axios';

/**
 * @desc 获取用户信息 , 歌单，收藏，mv, dj 数量
 * @param { Number } timestamp - 防止接口缓存
 */
export const userSubcount = () => {
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
 * @desc 获取我的视频列表
 * @param { Number } timestamp - 防止接口缓存
 */
export const myMvSbulist = () => {
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
 */
export const userPlayList = ({ uid }: { uid: string }) => {
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
export const addPlayList = ({ name }: { name: string }) => {
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
export const deletePlayList = ({ id }: { id: number }) => {
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

/* @desc 获取用户歌单详情
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌单id
 */
export const playListDetail = ({ id }: { id: number }) => {
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

/* @desc 获取播放url
 * @param { Number } timestamp - 防止接口缓存
 * @param { Number } id - 歌曲id，可多个，id1，id2 用逗号隔开
 */

interface GetPlayMusicUrl {
  id: number | string;
  br?: number | string;
}

export const getPlayMusicUrl = ({ id, br }: GetPlayMusicUrl) => {
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

/* @desc 删除歌单歌曲
 * @param { Number } timestamp - 防止接口缓存
 * @param { String } op - 从歌单增加单曲为 add, 删除为 del
 * @param { Number } pid: 歌单 id
 * @param { Number } id - 歌曲id，可多个，id1，id2 用逗号隔开
 */

interface DeleteMusic {
  pid: number | string;
  tracks: number | string;
}

export const deleteMusic = ({ pid, tracks }: DeleteMusic) => {
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
