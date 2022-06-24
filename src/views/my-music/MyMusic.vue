<template>
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
  onMounted,
  onUnmounted,
  nextTick
} from 'vue';
import { useStore } from 'vuex';
import { userSubcount } from '@api/my-music';
import type { ResponseType } from '@/types/types';
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

    function handleOptions(params: Record<string, any>): void {
      for (const value in options) {
        options[value].visible = false;
      }

      options[params.type] = { ...options[params.type], ...params.data };
    }

    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }

    watch(
      () => isLogin.value,
      () => {
        // 处理样式
        nextTick(() => {
          const footerDom = document.querySelector('.footer') as HTMLElement;
          if (isLogin.value) {
            footerDom.style.display = 'none';
            getUserSubcount();
          } else {
            footerDom.style.display = 'block';
          }
        });
      }
    );

    onMounted(() => {
      const footerDom = document.querySelector('.footer') as HTMLElement;
      if (isLogin.value) {
        footerDom.style.display = 'none';
        getUserSubcount();
      } else {
        footerDom.style.display = 'block';
      }
    });

    onUnmounted(() => {
      const footerDom = document.querySelector('.footer') as HTMLElement;
      footerDom.style.display = 'block';
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
