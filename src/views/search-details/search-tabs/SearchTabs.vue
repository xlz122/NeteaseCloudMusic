<template>
  <ul class="search-tabs">
    <li
      class="item-tab"
      v-for="(item, index) in tabList"
      :key="index"
      :class="{ 'item-active-tab': searchIndex === index }"
      @click="changeActiveIndex(item, index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  emits: ['changeTab'],
  setup(props, { emit }) {
    const $store = useStore();

    const tabList = ref<string[]>([
      '单曲',
      '歌手',
      '专辑',
      '视频',
      '歌词',
      '歌单',
      '声音主播',
      '用户'
    ]);

    // 选中
    const searchIndex = computed<number>(() => $store.getters.searchIndex);
    function changeActiveIndex(item: string, index: number): void {
      $store.commit('setSearchIndex', index);
      emit('changeTab', item, index);
    }

    return {
      tabList,
      searchIndex,
      changeActiveIndex
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-tabs.less';
</style>
