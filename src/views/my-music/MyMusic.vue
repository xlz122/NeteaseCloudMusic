<template>
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <h2 class="music-my-mv" @click="getMyMvSbulist">
          我的视频({{ myMvCount }})
        </h2>
      </div>
      <div class="my-music-main">
        <my-mv :myMvList="myMvList" :myMvCount="myMvCount" />
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
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import MyMv from '@views/my-music/MyMv.vue';
import { userSubcount, myMvSbulist } from '@api/my-music';
import { ResponseDataType } from '@/types/types';

interface ClassifyCount {
  [key: string]: any;
}

export default defineComponent({
  components: {
    MyMv
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 我的视频数量
    const myMvCount = ref<number>(0);

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      userSubcount().then((res: ClassifyCount) => {
        console.log(res);
        myMvCount.value = res.mvCount || 0;
      });
    }
    getUserSubcount();

    // 获取我的视频列表
    const myMvList = ref<unknown[]>([]);
    function getMyMvSbulist(): void {
      myMvSbulist().then((res: ResponseDataType) => {
        if (res.code == 200) {
          myMvCount.value = res.count || 0;
          myMvList.value = res.data;
        }
      });
    }

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      myMvList,
      myMvCount,
      getMyMvSbulist,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
