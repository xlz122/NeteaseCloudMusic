<template>
  <div class="sub-menu">
    <div class="sub-menu-warp" v-if="menuIndex === 0">
      <ul class="nav">
        <li
          class="item"
          v-for="(item, index) in subMenu"
          :key="index"
          :class="[
            { 'active-item': index === subMenuIndex },
            { 'song-sheet': index === 2 }
          ]"
          @click="subMenuChange(item, index)"
        >
          <span class="link">
            {{ item?.title }}
          </span>
          <i class="white-icon" v-if="index === 2"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

type SubMenuItem = {
  title: string;
  link: string;
};

export default defineComponent({
  name: 'SubMenu',
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    const menuIndex = computed<number>(() => $store.getters.menuIndex);
    const subMenuIndex = computed<number>(() => $store.getters.subMenuIndex);

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
        link: '/home-new-disc'
      }
    ]);

    function subMenuChange(item: SubMenuItem, index: number): void {
      $router.push({ path: item.link });
      $store.commit('setSubMenuIndex', index);
    }

    watch(
      () => $route.path,
      (path: string) => {
        const index = subMenu.value.findIndex(
          (item: SubMenuItem) => item.link === path
        );
        if (index !== -1) {
          $store.commit('setSubMenuIndex', index);
        }
      },
      {
        immediate: true
      }
    );

    return {
      menuIndex,
      subMenuIndex,
      subMenu,
      subMenuChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './sub-menu.less';
</style>
