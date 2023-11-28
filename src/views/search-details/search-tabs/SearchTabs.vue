<template>
  <ul class="search-tabs">
    <li
      class="item-tab"
      v-for="(item, index) in tab"
      :key="index"
      :class="{ 'item-active-tab': searchIndex === index }"
      @click="tabChange(item, index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const emits = defineEmits(['tabChange']);

const $store = useStore();
const searchIndex = computed<number>(() => $store.getters.searchIndex);

const tab = ref<string[]>([
  '单曲',
  '歌手',
  '专辑',
  '视频',
  '歌词',
  '歌单',
  '声音主播',
  '用户'
]);

function tabChange(item: string, index: number): void {
  $store.commit('setSearchIndex', index);
  emits('tabChange', item, index);
}
</script>

<style lang="less" scoped>
@import url('./search-tabs.less');
</style>
