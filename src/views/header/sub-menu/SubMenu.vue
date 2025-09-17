<template>
  <div class="h-sub-menu">
    <div class="h-sub-menu-warp" v-if="menuIndex === 0">
      <ul class="nav">
        <li
          class="item"
          v-for="(item, index) in subMenu"
          :key="index"
          :class="{ 'active-item': index === subMenuIndex }"
          @click="handleSubMenuChange(item)"
        >
          <p class="link">{{ item.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

type SubMenuItem = {
  title: string;
  link: string;
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const menuIndex = computed(() => store.getters.menuIndex);
const subMenuIndex = computed(() => store.getters.subMenuIndex);

const subMenu = ref<SubMenuItem[]>([
  {
    title: '推荐',
    link: '/'
  },
  {
    title: '排行榜',
    link: '/home-toplist'
  },
  {
    title: '歌单',
    link: '/home-song-sheet'
  },
  {
    title: '主播电台',
    link: '/home-djprogram'
  },
  {
    title: '歌手',
    link: '/home-singer'
  },
  {
    title: '新碟上架',
    link: '/home-album'
  }
]);

function handleSubMenuChange(item: SubMenuItem): void {
  const index = subMenu.value.findIndex?.((v) => v.link === item.link);

  router.push({ path: item.link });
  store.commit('setSubMenuIndex', index);
}

watch(
  () => route.path,
  (path) => {
    const index = subMenu.value.findIndex?.((item) => item.link === path);
    if (index === -1) {
      return;
    }

    store.commit('setSubMenuIndex', index);
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import url('./sub-menu.less');
</style>
