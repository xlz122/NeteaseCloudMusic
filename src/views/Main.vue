<template>
  <Header />
  <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
    <keep-alive :include="['DownloadView']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  <Footer />
  <JumpTop />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@views/header/Header.vue';
import Footer from '@views/footer/Footer.vue';
import JumpTop from '@components/jump-top/JumpTop.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    Header,
    Footer,
    JumpTop
  }
});
</script>
