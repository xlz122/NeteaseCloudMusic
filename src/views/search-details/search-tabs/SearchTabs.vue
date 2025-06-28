<template>
  <ul class="search-tabs">
    <li
      class="item-tab"
      v-for="(item, index) in tab"
      :key="index"
      :class="{ 'item-active-tab': item.type === Number(route.query.type) }"
      @click="tabChange(item.type)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tab = ref([
  {
    title: '单曲',
    type: 1
  },
  {
    title: '歌手',
    type: 100
  },
  {
    title: '专辑',
    type: 10
  },
  {
    title: '视频',
    type: 1014
  },
  {
    title: '歌词',
    type: 1006
  },
  {
    title: '歌单',
    type: 1000
  },
  {
    title: '声音主播',
    type: 1009
  },
  {
    title: '用户',
    type: 1002
  }
]);

function tabChange(type: number): void {
  router.push({
    name: 'search-details',
    query: { keyword: route.query.keyword, type }
  });
}
</script>

<style lang="less" scoped>
@import url('./search-tabs.less');
</style>
