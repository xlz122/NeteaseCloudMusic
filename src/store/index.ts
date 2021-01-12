import { createStore } from 'vuex';
import state from '@store/state';
import getters from '@store/getters';
import mutations from '@store/mutations';
import actions from '@store/actions';

export default createStore({
  state,
  getters,
  mutations,
  actions
});
