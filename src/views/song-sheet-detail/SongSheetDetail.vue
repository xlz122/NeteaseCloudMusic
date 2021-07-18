<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <UserInfo class="user-info" />
      </div>
      <div class="song-sheet-side"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { playlistDetail } from '@api/song-sheet-detail';
import { ResponseType } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';

export default defineComponent({
  components: {
    UserInfo
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const songSheetId = ref<number>(-1);
    // 监听路由传参
    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          songSheetId.value = Number(curVal.id);
          getSongDetail();
        }
      },
      {
        immediate: true
      }
    );

    // 获取歌单详情
    function getSongDetail(): void {
      playlistDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            $store.commit('music/setSongListDetailData', res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    return {};
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-detail.less';
</style>
