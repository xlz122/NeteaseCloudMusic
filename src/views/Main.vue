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
import { defineComponent } from 'vue';
import HeaderView from '@views/header/Header.vue';
import FooterView from '@views/footer/Footer.vue';
import JumpTop from '@components/jump-top/JumpTop.vue';

export default defineComponent({
  name: 'MainView',
  components: {
    HeaderView,
    FooterView,
    JumpTop
  }
});
</script>
