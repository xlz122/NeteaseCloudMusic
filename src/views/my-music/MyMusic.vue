<template>
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <OptionList :options="options" @handleOptions="handleOptions" />
      </div>
      <div class="my-music-main">
        <MySinger
          v-if="options.mySinger.visible"
          :count="options.mySinger.count"
          @handleOptions="handleOptions"
        />
        <MyVideo
          v-if="options.myVideo.visible"
          :count="options.myVideo.count"
          @handleOptions="handleOptions"
        />
        <SongSheetDetail v-if="options.songSheet.visible" />
      </div>
    </div>
  </div>
  <div class="my-music" v-else>
    <div class="my-music-login">
      <div class="login-content">
        <button class="login-btn" @click="handleLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { userSubcount } from '@/api/my-music';
import type { ResponseType } from '@/types';
import OptionList from './option-list/OptionList.vue';
import MySinger from './my-singer/MySinger.vue';
import MyVideo from './my-video/MyVideo.vue';
import SongSheetDetail from './song-sheet-detail/SongSheetDetail.vue';

type ParamsType = {
  type: string;
  data: (typeof options)[keyof typeof options];
};

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

function handleLogin(): void {
  store.commit('setLoginDialog', true);
}

// 获取统计数量
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

function getUserSubcount(): void {
  userSubcount()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      options.mySinger.count = res.artistCount ?? 0;
      options.myVideo.count = res.mvCount ?? 0;
      options.songSheet.createCount = res.createdPlaylistCount ?? 0;
      options.songSheet.collectionCount = res.subPlaylistCount ?? 0;
    })
    .catch(() => ({}));
}

function handleOptions(params: ParamsType): void {
  for (const value in options) {
    options[value as keyof typeof options].visible = false;
  }

  // @ts-expect-error - unknown
  options[params.type] = { ...options[params.type], ...params.data };
}

// 页脚显隐
watch(
  () => isLogin.value,
  () => {
    nextTick(() => {
      const element: HTMLElement = document.querySelector('.footer')!;

      if (isLogin.value) {
        element.style.display = 'none';
        getUserSubcount();
        return;
      }

      element.style.display = 'block';
    });
  }
);

onMounted(() => {
  const element: HTMLElement = document.querySelector('.footer')!;

  if (isLogin.value) {
    element.style.display = 'none';
    getUserSubcount();
    return;
  }

  element.style.display = 'block';
});

onUnmounted(() => {
  const element: HTMLElement = document.querySelector('.footer')!;
  element.style.display = 'block';
});
</script>

<style lang="less" scoped>
@import url('./my-music.less');
</style>
