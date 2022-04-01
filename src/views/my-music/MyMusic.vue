<template>
  <!-- 登录展示 -->
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <OptionList :options="options" @handleOptions="handleOptions" />
      </div>
      <div class="my-music-main">
        <MySinger
          v-if="options.mySinger.visible"
          :options="options"
          @handleOptions="handleOptions"
        />
        <MyVideo
          v-if="options.myVideo.visible"
          :options="options"
          @handleOptions="handleOptions"
        />
        <SongSheetDetail v-if="options.songSheet.visible" />
      </div>
    </div>
  </div>
  <!-- 未登录展示 -->
  <div class="my-music" v-else>
    <div class="my-music-login">
      <div class="login-content">
        <button class="login-btn" @click="openLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  watch,
  onUnmounted,
  onMounted
} from 'vue';
import { useStore } from 'vuex';
import { userSubcount } from '@api/my-music';
import { ResponseType } from '@/types/types';
import OptionList from '@views/my-music/option-list/OptionList.vue';
import MySinger from '@/views/my-music/my-singer/MySinger.vue';
import MyVideo from '@/views/my-music/my-video/MyVideo.vue';
import SongSheetDetail from '@/views/my-music/song-sheet-detail/SongSheetDetail.vue';

export default defineComponent({
  name: 'my-music',
  components: {
    OptionList,
    MySinger,
    MyVideo,
    SongSheetDetail
  },
  setup() {
    const $store = useStore();

    const isLogin = computed(() => $store.getters.isLogin);

    const options = reactive({
      mySinger: {
        visible: false,
        count: 0
      },
      myVideo: {
        visible: false,
        count: 0
      },
      songSheet: {
        visible: true,
        createCount: 0,
        collectionCount: 0
      }
    });

    // 获取统计数量
    function getUserSubcount(): void {
      userSubcount()
        .then((res: ResponseType) => {
          options.mySinger.count = res?.artistCount || 0;
          options.myVideo.count = res?.mvCount || 0;
          options.songSheet.createCount = res?.createdPlaylistCount || 0;
          options.songSheet.collectionCount = res?.subPlaylistCount || 0;
        })
        .catch(() => ({}));
    }
    getUserSubcount();

    function handleOptions(params: Record<string, any>): void {
      for (const value in options) {
        options[value].visible = false;
      }

      options[params.type] = { ...options[params.type], ...params.data };
    }

    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }

    // 登录后样式设置
    watch(
      () => isLogin.value,
      (curVal: boolean) => {
        if (curVal) {
          const appDom = document.getElementById('app') as HTMLElement;
          const footerDom = document.querySelector('.footer') as HTMLElement;
          if (appDom && footerDom) {
            footerDom.style.display = 'none';
          }
        }
      }
    );

    onMounted(() => {
      if (isLogin.value) {
        const footerDom = document.querySelector('.footer') as HTMLElement;
        footerDom.style.display = 'none';
      }
    });

    onUnmounted(() => {
      if (isLogin.value) {
        const footerDom = document.querySelector('.footer') as HTMLElement;
        footerDom.style.display = 'block';
      }
    });

    return {
      isLogin,
      options,
      handleOptions,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
