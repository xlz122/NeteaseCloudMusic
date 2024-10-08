<template>
  <HeaderView />
  <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
    <keep-alive :include="['DownloadView']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
  <FooterView />
  <BackTop />
</template>

<script lang="ts" setup>
import HeaderView from '@/views/header/Header.vue';
import FooterView from '@/views/footer/Footer.vue';
import BackTop from '@/components/back-top/BackTop.vue';
</script>
