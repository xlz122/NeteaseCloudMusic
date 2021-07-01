<template>
  <!-- 登录展示 -->
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <option-list />
      </div>
      <div class="my-music-main">
        <sub-play-list v-if="musicDetailOptions.subPlayList" />
        <my-mv v-if="musicDetailOptions.myMv" />
        <play-list-detail v-if="musicDetailOptions.playListDetail" />
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
import { defineComponent, computed, watch, onUnmounted, onMounted } from 'vue';
import { useStore } from 'vuex';
import OptionList from '@views/my-music/option-list/OptionList.vue';
import SubPlayList from '@views/my-music/sub-play-list/SubPlayList.vue';
import MyMv from '@views/my-music/my-mv/MyMv.vue';
import PlayListDetail from '@views/my-music/play-list-detail/PlayListDetail.vue';

export default defineComponent({
  name: 'my-music',
  components: {
    OptionList,
    SubPlayList,
    MyMv,
    PlayListDetail
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 详情显示
    const musicDetailOptions = computed(
      () => $store.getters['music/musicDetailOptions']
    );

    // 打开登录对话框
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
            appDom.style.height = '100vh';
            footerDom.style.display = 'none';
          }
        }
      }
    );
    onMounted(() => {
      if (isLogin.value) {
        const appDom = document.getElementById('app') as HTMLElement;
        const footerDom = document.querySelector('.footer') as HTMLElement;
        appDom.style.height = '100vh';
        footerDom.style.display = 'none';
      }
    });
    onUnmounted(() => {
      if (isLogin.value) {
        const appDom = document.getElementById('app') as HTMLElement;
        const footerDom = document.querySelector('.footer') as HTMLElement;
        appDom.style.height = 'auto';
        footerDom.style.display = 'block';
      }
    });
    return {
      isLogin,
      musicDetailOptions,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
