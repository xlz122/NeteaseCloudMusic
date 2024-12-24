<template>
  <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-else></router-view>
</template>
