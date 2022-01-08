<template>
  <div class="app-wrap">
    <Header />
    <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
      <keep-alive :include="['DownloadView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <Footer />
    <JumpTop />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import Header from '@views/header/Header.vue';
import Footer from '@views/footer/Footer.vue';
import JumpTop from '@components/jump-top/JumpTop.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    Header,
    Footer,
    JumpTop
  },
  setup() {
    const sUserAgent = navigator.userAgent.toLowerCase();

    nextTick(() => {
      if (
        /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(
          sUserAgent
        )
      ) {
        // 移动端
        nextTick(() => {
          const appwrap = document.querySelector('.app-wrap') as HTMLElement;
          appwrap.style.height = 'auto';
        });
      } else {
        // pc
        const appwrap = document.querySelector('.app-wrap') as HTMLElement;
        appwrap.style.height = '100vh';
      }
    });
  }
});
</script>
