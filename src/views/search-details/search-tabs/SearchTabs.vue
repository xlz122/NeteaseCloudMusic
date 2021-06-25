<template>
  <ul class="search-tabs">
    <li
      class="item-tab"
      v-for="(item, index) in tabList"
      :key="index"
      :class="{ 'item-active-tab': activeIndex === index }"
      @click="changeActiveIndex(index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
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
    const activeIndex = ref<number>(0);
    function changeActiveIndex(index: number): void {
      if (index !== 0) {
        $store.commit('setMessage', {
          type: 'error',
          title: '该功能暂未开发'
        });
      }
      activeIndex.value = index;
      emit('changeTab', index);
    }

    return {
      tabList,
      activeIndex,
      changeActiveIndex
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-tabs.less';
</style>
