<template>
  <HeaderView />
  <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
    <keep-alive :include="['DownloadView']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  <FooterView />
  <JumpTop />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import HeaderView from '@views/header/Header.vue';
import FooterView from '@views/footer/Footer.vue';
import JumpTop from '@components/jump-top/JumpTop.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    HeaderView,
    FooterView,
    JumpTop
  },
  setup() {
    const userAgent = navigator.userAgent.toLowerCase();

    onMounted(() => {
      const reg =
        /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
      const header = document.querySelector('.header') as HTMLElement;
      const munuBg = document.querySelector('.h-top-bg') as HTMLElement;
      const subMenuBg = document.querySelector('.sub-menu-bg') as HTMLElement;
      const audioBg = document.querySelector(
        '.music-audio-playbar'
      ) as HTMLElement;

      // 解决pc端滚动条跳动样式,在移动端需还原样式
      if (reg.test(userAgent)) {
        header.style.width = '100%';
        munuBg.style.width = '100%';
        subMenuBg.style.width = '100%';
        audioBg.style.width = '100%';
      }
    });
  }
});
</script>
