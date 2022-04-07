import { createStore } from 'vuex';
import state from '@store/state';
import getters from '@store/getters';
import mutations from '@store/mutations';
import actions from '@store/actions';
// 音乐模块
import music from '@store/music';
// 视频模块
import video from '@store/video';

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    music,
    video
  }
});
