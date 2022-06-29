<template>
  <div class="program-side-container">
    <h3 class="title">
      更多节目
      <span class="title-all"> 全部> </span>
    </h3>
    <ul class="program-side-list">
      <li class="item" v-for="(item, index) in list" :key="index">
        <div class="item-cover">
          <img
            class="cover-img"
            :src="`${item?.coverUrl}?param=50y50`"
            alt=""
            @click="jumpProgramDetail(item?.id)"
          />
        </div>
        <div class="item-info">
          <p
            class="info-title"
            :title="item?.name"
            @click="jumpProgramDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="info-desc">
            <span class="text" :title="item?.serialNum">
              Vol.{{ item?.serialNum }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { programList } from '@api/program-detail';
import type { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  props: {
    rid: {
      typs: Number,
      default: 0
    }
  },
  setup(props) {
    const $router = useRouter();
    const $store = useStore();

    const list = ref([]);
    // 获取电台节目列表
    function getProgramList(): void {
      programList({ rid: props?.rid })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            list.value = res?.programs?.slice(0, 5);
          }
        })
        .catch(() => ({}));
    }

    watch(
      () => props.rid,
      () => {
        if (props.rid) {
          getProgramList();
        }
      },
      {
        immediate: true
      }
    );

    // 跳转电台节目详情
    function jumpProgramDetail(id: number): void {
      $router.push({ name: 'program-detail', params: { programId: id } });
      $store.commit('setProgramId', id);
    }

    return {
      list,
      jumpProgramDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './program-side.less';
</style>
