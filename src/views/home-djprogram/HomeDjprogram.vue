<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category @djCategorChange="djCategorChange" />
      <div class="dis-flex justify-between">
        <Recommend />
        <RankiList />
      </div>
      <RadioStation />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setMessage } from '@/components/message/useMessage';
import Category from './category/Category.vue';
import Recommend from './recommend/ReCommend.vue';
import RankiList from './rankiList/RankiList.vue';
import RadioStation from './radioStation/RadioStation.vue';
import { djCatelist, recommendTypeList } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  name: 'home-djprogram',
  components: {
    Category,
    Recommend,
    RankiList,
    RadioStation
  },
  setup() {
    // 分类点击
    function djCategorChange(id: number): void {
      setMessage({ type: 'info', title: `分类id:${id}` });
    }

    function djcateHandle() {
      djCatelist().then((res: ResponseType) => {
        console.log('res1', res);
      });
    }
    djcateHandle();
    function recommendTypeHandle() {
      recommendTypeList({ type: 2 }).then((res: ResponseType) => {
        console.log('res', res);
      });
    }
    recommendTypeHandle();

    return {
      djCategorChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-djprogram.less';
</style>
