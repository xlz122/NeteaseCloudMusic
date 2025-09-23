<template>
  <div class="side-container">
    <h3 class="title">
      更多节目
      <span class="title-all" @click="jumpDjradioDetail(rid)">全部></span>
    </h3>
    <ul class="program-side-list">
      <li class="item" v-for="(item, index) in programList" :key="index">
        <div class="item-cover" @click="jumpProgramDetail(item.id)">
          <img class="cover-img" :src="`${item.coverUrl}?param=50y50`" alt="" />
        </div>
        <div class="item-info">
          <p class="info-title" :title="item.name" @click="jumpProgramDetail(item.id)">
            {{ item.name }}
          </p>
          <div class="info-desc">
            <span class="text" :title="String(item.serialNum)"> Vol.{{ item.serialNum }} </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { djProgramList } from '@/api/program-detail';
import type { ResponseType } from '@/types';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type ProgramItem = {
  id: number;
  name: string;
  coverUrl: string;
  serialNum: number;
};

const props = defineProps({
  rid: {
    type: Number,
    default: 0
  }
});

const router = useRouter();

// 获取电台节目列表
const programList = ref<ProgramItem[]>([]);

function getProgramList(): void {
  djProgramList({ rid: props.rid })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      programList.value = res.programs?.slice?.(0, 5) ?? [];
    })
    .catch(() => ({}));
}

watch(
  () => props.rid,
  () => {
    if (!props.rid) {
      return;
    }

    getProgramList();
  },
  { immediate: true }
);

function jumpDjradioDetail(id: number): void {
  router.push({ path: '/djradio-detail', query: { id } });
}

function jumpProgramDetail(id: number): void {
  router.push({ path: '/program-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./program-side.less');
</style>
