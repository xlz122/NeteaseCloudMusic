<template>
  <div class="my-singer">
    <div class="title">
      <span class="text">我的歌手({{ options?.mySinger?.count }})</span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in singerList" :key="index">
        <div class="cover" @click="jumpSingerDetail(item?.id)">
          <template v-if="item?.picUrl">
            <img class="img" :src="`${item?.picUrl}?param=80y80`" alt="" />
          </template>
          <template v-else>
            <img class="img" src="" alt="" />
          </template>
        </div>
        <div class="info">
          <h4 class="info-name" @click="jumpSingerDetail(item?.id)">
            {{ item?.name }}
          </h4>
          <p class="info-album">{{ item?.albumSize }}专辑</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';
import { subPlayList } from '@api/my-music';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['handleOptions'],
  setup(props, { emit }) {
    const $store = useStore();

    const singerList = ref<unknown[]>([]);

    // 获取歌手列表
    function getSingerList(): void {
      subPlayList()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerList.value = res?.data || [];

            emit('handleOptions', {
              type: 'mySinger',
              data: {
                visible: true,
                count: res?.count
              }
            });
          }
        })
        .catch(() => ({}));
    }
    getSingerList();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    return {
      timeStampToDuration,
      singerList,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scopde>
@import './my-singer.less';
</style>
