<template>
  <div class="toplist-menu">
    <h2 class="menu-title">云音乐特色榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': Number(route.query.id) === item.id }"
        v-for="(item, index) in character"
        :key="index"
        @click="menuChange(item.id)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item.name }}</div>
          <div class="info-desc">{{ item.updateFrequency }}</div>
        </div>
      </li>
    </ul>
    <h2 class="menu-title">全球媒体榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': item.id === Number(route.query.id) }"
        v-for="(item, index) in media"
        :key="index"
        @click="menuChange(item.id)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item.name }}</div>
          <div class="info-desc">{{ item.updateFrequency }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

type ItemType = {
  id: number;
  name: string;
  coverImgUrl: string;
  updateFrequency: string;
};

defineProps({
  character: {
    type: Array as () => ItemType[],
    default: () => []
  },
  media: {
    type: Array as () => ItemType[],
    default: () => []
  }
});
const emits = defineEmits(['menuChange']);

const route = useRoute();

function menuChange(id: number): void {
  emits('menuChange', id);
}
</script>

<style lang="less">
@import url('./toplist-menu.less');
</style>
