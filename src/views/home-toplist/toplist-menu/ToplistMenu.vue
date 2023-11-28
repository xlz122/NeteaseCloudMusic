<template>
  <div class="toplist-menu">
    <h2 class="menu-title">云音乐特色榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': songSheetId === item?.id }"
        v-for="(item, index) in character"
        :key="index"
        @click="menuChange(item?.id, item?.updateFrequency)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item?.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item?.name }}</div>
          <div class="info-desc">{{ item?.updateFrequency }}</div>
        </div>
      </li>
    </ul>
    <h2 class="menu-title">全球媒体榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': songSheetId === item?.id }"
        v-for="(item, index) in media"
        :key="index"
        @click="menuChange(item?.id, item?.updateFrequency)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item?.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item?.name }}</div>
          <div class="info-desc">{{ item?.updateFrequency }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

type ItemType = {
  id: number;
  name?: string;
  updateFrequency: string;
  coverImgUrl?: string;
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

const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);

function menuChange(id: number, updateFrequency: string): void {
  emits('menuChange', id, updateFrequency);
}
</script>

<style lang="less">
@import url('./toplist-menu.less');
</style>
