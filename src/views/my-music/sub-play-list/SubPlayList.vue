<template>
  <div class="sub-play-list">
    <div class="title">
      <span class="text">我的歌手({{ subPlayListCount }})</span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in subPlayListList" :key="index">
        <div class="cover" @click="jumpSingerDetail(item.id)">
          <img class="img" :src="`${item?.picUrl}?param=80y80`" alt="" />
        </div>
        <div class="info">
          <h4 class="info-title" @click="jumpSingerDetail(item.id)">
            {{ item?.name }}
          </h4>
          <p class="desc">{{ item?.albumSize }}专辑</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { subPlayList } from '@api/my-music';
import { ResponseType } from '@/types/types';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 我的视频数量
    const subPlayListCount = ref<number>(0);
    // 获取我的视频列表
    const subPlayListList = ref<unknown[]>([]);
    function getMyMvSbulist(): void {
      subPlayList().then((res: ResponseType) => {
        if (res.code === 200) {
          subPlayListCount.value = res.count || 0;
          subPlayListList.value = res.data;
        }
      });
    }
    getMyMvSbulist();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    return {
      timeStampToDuration,
      subPlayListCount,
      subPlayListList,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scopde>
@import './sub-play-list.less';
</style>
