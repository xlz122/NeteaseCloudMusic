<template>
  <div class="program-user-info-container">
    <div class="cover-warp">
      <div class="cover">
        <template v-if="detail?.coverUrl">
          <img
            class="cover-img"
            :src="`${detail?.coverUrl}?param=130y130`"
            alt=""
          />
        </template>
        <template v-else>
          <img class="cover-img" src="" alt="" />
        </template>
        <span class="cover-img-bg"></span>
      </div>
    </div>
    <div class="info-right">
      <div class="title">
        <i class="icon-title"></i>
        <h2 class="title-text">
          {{ detail?.name }}
        </h2>
      </div>
      <div class="rdiname">
        <i class="icon"></i>
        <span class="text" :title="detail?.radio?.name">
          {{ detail?.radio?.name }}
        </span>
        <div class="subscribe">
          <i class="subscribe-icon">订阅({{ detail?.radio?.subCount }})</i>
        </div>
      </div>
    </div>
    <div class="info-bottom">
      <div class="operate-btn">
        <div class="play">
          <span class="icon-play">播放 </span>
        </div>
        <div class="other like" @click="handleLike">
          <template v-if="detail?.likedCount > 0">
            <i class="like-icon"></i>
            <span class="icon"> ({{ detail?.likedCount }}) </span>
          </template>
          <template v-else>
            <i class="like-icon"></i>
            <span class="icon">喜欢</span>
          </template>
        </div>
        <div class="other comment" @click="jumpToComments">
          <template v-if="commentTotal > 0">
            <span class="icon"> ({{ commentTotal }}) </span>
          </template>
          <template v-else>
            <span class="icon">评论</span>
          </template>
        </div>
        <div class="other share" @click="handleShare">
          <template v-if="detail?.shareCount > 0">
            <span class="icon"> ({{ detail?.shareCount }}) </span>
          </template>
          <template v-else>
            <span class="icon">分享</span>
          </template>
        </div>
        <div class="other download" @click="handleDownload">
          <span class="icon">下载</span>
        </div>
      </div>
      <div class="out">
        <i class="icon"></i>
        <a
          class="link"
          :href="`https://music.163.com/#/outchain/3/${programId}`"
        >
          生成外链播放器
        </a>
      </div>
    </div>
    <div class="sub">
      <span class="cat">
        {{ detail?.categoryName }}
      </span>
      <strong class="sub-title">
        <span class="title-text" :title="detail?.radio?.name">
          {{ detail?.radio?.name }}
        </span>
        第{{ detail?.serialNum }}期
      </strong>
      <span class="sub-time">
        {{ formatDateTime(detail?.createTime / 1000, 'yyyy-MM-dd') }}
        创建
      </span>
      <div class="title-play-num">
        播放:
        <span class="eye-catching">
          {{ detail?.listenerCount }}
        </span>
        次
      </div>
    </div>
    <div class="simple-description">介绍：{{ detail?.description }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { formatDateTime } from '@utils/utils';

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => ({})
    },
    commentTotal: {
      typs: Number,
      default: 0
    }
  },
  emits: ['jumpToComments'],
  setup(props, { emit }) {
    const $store = useStore();

    // 电台节目id
    const programId = computed<number>(() => $store.getters.programId);

    // 喜欢
    function handleLike(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 评论
    function jumpToComments(): void {
      emit('jumpToComments');
    }

    // 分享
    function handleShare(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 下载
    function handleDownload(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    return {
      formatDateTime,
      programId,
      handleLike,
      jumpToComments,
      handleShare,
      handleDownload
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./program-info.less');
</style>
