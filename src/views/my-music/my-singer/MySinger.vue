<template>
  <div class="my-singer">
    <div class="title">
      <span class="text">我的歌手 ({{ count }})</span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in singerList" :key="index">
        <div class="cover" @click="jumpSingerDetail(item.id)">
          <img class="img" :src="`${item.picUrl}?param=80y80`" alt="" />
        </div>
        <div class="info">
          <h4 class="info-name" @click="jumpSingerDetail(item.id)">
            {{ item.name }}
          </h4>
          <p class="info-desc">
            <span v-if="item.albumSize">{{ item.albumSize }}个专辑</span>
            <span class="mv" v-if="item.mvSize">{{ item.mvSize }}个MV</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { subPlayList } from '@/api/my-music';
import type { ResponseType } from '@/types';

type SingerItem = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
  mvSize: number;
};

defineProps({
  count: {
    type: Number,
    default: () => 0
  }
});
const emits = defineEmits(['handleOptions']);

const router = useRouter();

// 获取歌手列表
const singerList = ref<SingerItem[]>([]);

function getSingerList(): void {
  subPlayList()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singerList.value = res.data ?? [];

      emits('handleOptions', {
        type: 'mySinger',
        data: { visible: true, count: res.count ?? 0 }
      });
    })
    .catch(() => ({}));
}
getSingerList();

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scopde>
@import url('./my-singer.less');
</style>
