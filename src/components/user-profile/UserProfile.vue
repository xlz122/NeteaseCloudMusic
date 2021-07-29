<template>
  <div class="user-profile-container">
    <div class="user-info">
      <UserInfo />
    </div>
    <div class="song-sheet">
      <SongSheetList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import UserInfo from '@components/user-profile/user-info/User-info.vue';
import SongSheetList from '@/components/user-profile/song-sheet-list/SongSheetList.vue';

export default defineComponent({
  components: {
    UserInfo,
    SongSheetList
  },
  setup() {
    const $store = useStore();

    onMounted(() => {
      // 取消头部导航选中
      $store.commit('setHeaderActiveIndex', -1);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });
  }
});
</script>

<style lang="less" scoped>
@import './user-profile.less';
</style>
