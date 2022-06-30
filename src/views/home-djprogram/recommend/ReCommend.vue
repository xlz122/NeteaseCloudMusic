<template>
  <div class="recommend">
    <div class="title dis-flex justify-between align-end">
      <router-link to="" class="text-gray3 f24 txt">推荐节目</router-link>
      <router-link to="" class="text-gray6 f12 more">更多 ></router-link>
    </div>
    <div class="recommend-list">
      <div
        class="item dis-flex align-center"
        v-for="item in recommendList"
        :key="item.id"
      >
        <div class="item-lf dis-flex">
          <div class="cover-img">
            <img :src="item?.coverUrl" alt="" />
            <i class="play"></i>
          </div>
          <div class="item-content">
            <div class="f12 text-gray3 ellipsis">
              {{ item?.mainSong?.name }}
            </div>
            <div class="f12 text-gray9 ellipsis">
              {{ item?.dj?.brand }}
            </div>
          </div>
        </div>
        <div class="item-ri">
          {{ item?.radio?.category }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { programRecommend } from '@api/home-recommend';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const recommendList = ref([]);
    function recommendHandle() {
      programRecommend().then((res: ResponseType) => {
        console.log(res);
        if (res.code === 200) {
          recommendList.value = res?.programs || [];
        }
      });
    }
    recommendHandle();
    return {
      recommendList
    };
  }
});
</script>
<style lang="less" scoped>
@import './recommend.less';
</style>
