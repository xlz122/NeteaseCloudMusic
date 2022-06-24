<template>
  <div class="app-wrap">
    <HeaderView />
    <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
      <keep-alive :include="['DownloadView']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <FooterView />
    <JumpTop />
  </div>
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
      const appwrap = document.querySelector('.app-wrap') as HTMLElement;

      // pc/移动端样式设置
      if (reg.test(userAgent)) {
        appwrap.style.height = 'auto';
      } else {
        appwrap.style.height = '100vh';
      }
    });
  }
});
</script>
