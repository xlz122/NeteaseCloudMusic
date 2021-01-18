<template>
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <h2
          class="music-my-mv"
          :class="{ 'music-my-mv-active': myMvActive }"
          @click="getMyMvSbulist"
        >
          我的视频({{ myMvCount }})
        </h2>
        <play-list
          :createdPlayCount="createdPlayCount"
          @playListOption="playListOption"
        />
      </div>
      <div class="my-music-main">
        <my-mv v-if="false" :myMvList="myMvList" :myMvCount="myMvCount" />
        <play-list-main :playDetailData="playDetailData" />
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
import PlayList from '@views/my-music/PlayList.vue';
import PlayListMain from '@views/my-music/PlayListMain.vue';
import { userSubcount, myMvSbulist } from '@api/my-music';

interface ResponseType {
  [key: string]: any;
}

export default defineComponent({
  components: {
    MyMv,
    PlayList,
    PlayListMain
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 我的视频数量
    const myMvCount = ref<number>(0);
    // 创建歌单数量
    const createdPlayCount = ref<number>(0);

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      userSubcount().then((res: ResponseType) => {
        myMvCount.value = res.mvCount || 0;
        createdPlayCount.value = res.createdPlaylistCount || 0;
      });
    }
    getUserSubcount();

    // 获取我的视频列表
    const myMvList = ref<unknown[]>([]);
    const myMvActive = ref<boolean>(false);
    function getMyMvSbulist(): void {
      myMvActive.value = true;
      myMvSbulist().then((res: ResponseType) => {
        if (res.code == 200) {
          myMvCount.value = res.count || 0;
          myMvList.value = res.data;
        }
      });
    }

    // 创建歌单项点击
    const playDetailData = ref<unknown>({});
    function playListOption(detailData: unknown): void {
      playDetailData.value = detailData;
      // 我的视频取消选中
      myMvActive.value = false;
    }

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      myMvActive,
      myMvList,
      myMvCount,
      createdPlayCount,
      getMyMvSbulist,
      playDetailData,
      playListOption,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
