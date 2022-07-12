<template>
  <div class="singer-introduce">
    <h2 class="desc-title">
      <i class="desc-line"></i>
      <span>{{ singerDetail?.artist?.name }}简介</span>
    </h2>
    <p class="desc-content">{{ singerDesc?.briefDesc }}</p>
    <ul class="introduce-list">
      <li
        class="item"
        v-for="(item, index) in singerDesc?.introduction"
        :key="index"
      >
        <h2 class="title">{{ item?.ti }}</h2>
        <div class="content">
          <pre class="text">{{ item?.txt }}</pre>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { artistDesc } from '@api/singer-detail';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  props: {
    singerDetail: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const $store = useStore();

    const singerId = computed<number>(() => $store.getters.singerId);

    const singerDesc = ref({});

    // 获取歌手描述
    function getArtistDetail(): void {
      artistDesc({ id: singerId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            singerDesc.value = res;
          }
        })
        .catch(() => ({}));
    }
    getArtistDetail();

    return {
      singerDesc
    };
  }
});
</script>

<style lang="less" scoped>
.singer-introduce {
  width: 100%;
  margin-top: 30px;
  text-align: left;

  .desc-title {
    margin: 28px 0 8px;
    font-size: 14px;
    color: #333;

    .desc-line {
      display: inline-block;
      width: 3px;
      height: 14px;
      margin-right: 7px;
      vertical-align: middle;
      background: #c10d0c;
    }
  }

  .desc-content {
    line-height: 25px;
    color: #666;
    text-indent: 24px;
  }

  .introduce-list {
    .item {
      .title {
        margin: 28px 0 8px;
        font-size: 14px;
        color: #333;
      }

      .content {
        line-height: 25px;
        color: #666;

        .text {
          width: 100%;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
          color: #666;
          word-wrap: break-word;
          white-space: pre-wrap;
          white-space: -moz-pre-wrap;
          white-space: -pre-wrap;
          white-space: -o-pre-wrap;
        }
      }
    }
  }
}
</style>
