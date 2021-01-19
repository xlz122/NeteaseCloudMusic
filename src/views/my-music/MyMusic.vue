<template>
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <option-list :optionsCount="optionsCount" />
      </div>
      <div class="my-music-main">
        <my-mv v-if="myMusicDetail.myMv" />
        <play-list-detail v-if="myMusicDetail.playListDetail" />
      </div>
    </div>
  </div>
  <div class="my-music" v-else>
    <div class="my-music-login">
      <div class="login-content">
        <button class="login-btn" @click="openLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import OptionList from '@views/my-music/option-list/OptionList.vue';
import MyMv from '@views/my-music/my-mv/MyMv.vue';
import PlayListDetail from '@views/my-music/play-list/PlayListDetail.vue';
import { userSubcount } from '@api/my-music';

interface ResponseType {
  [key: string]: any;
}

interface OptionsCount {
  myMvCount: number;
  createdPlayCount: number;
}

export default defineComponent({
  components: {
    OptionList,
    MyMv,
    PlayListDetail
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 详情显示
    const myMusicDetail = computed(() => $store.getters.myMusicDetail);

    const optionsCount = reactive<OptionsCount>({
      myMvCount: 0, // 我的视频数量
      createdPlayCount: 0 // 创建歌单数量
    });

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      userSubcount().then((res: ResponseType) => {
        optionsCount.myMvCount = res.mvCount || 0;
        optionsCount.createdPlayCount = res.createdPlaylistCount || 0;
      });
    }
    getUserSubcount();

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      myMusicDetail,
      optionsCount,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
