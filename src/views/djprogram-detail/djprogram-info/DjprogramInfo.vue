<template>
  <div class="djprogram-user-info-container">
    <div class="cover-warp">
      <div class="cover">
        <template v-if="djProgramDetailData?.coverUrl">
          <img
            class="cover-img"
            :src="`${djProgramDetailData?.coverUrl}?param=130y130`"
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
          {{ djProgramDetailData?.name }}
        </h2>
      </div>
      <div class="rdiname">
        <i class="icon"></i>
        <span class="text" :title="djProgramDetailData?.radio?.name">
          {{ djProgramDetailData?.radio?.name }}
        </span>
        <div class="subscribe">
          <i class="subscribe-icon">
            订阅({{ djProgramDetailData?.radio?.subCount }})
          </i>
        </div>
      </div>
    </div>
    <div class="info-bottom">
      <!-- 操作项 -->
      <div class="operate-btn">
        <div class="play" @click="playTitleMusic">
          <span class="icon-play">播放 </span>
        </div>
        <div class="other like" @click="handleLike">
          <template v-if="djProgramDetailData?.likedCount > 0">
            <i class="like-icon"></i>
            <span class="icon"> ({{ djProgramDetailData?.likedCount }}) </span>
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
          <template v-if="djProgramDetailData?.shareCount > 0">
            <span class="icon"> ({{ djProgramDetailData?.shareCount }}) </span>
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
          :href="`https://music.163.com/#/outchain/3/${djprogramId}`"
        >
          生成外链播放器
        </a>
      </div>
    </div>
    <div class="sub">
      <span class="cat">
        {{ djProgramDetailData?.categoryName }}
      </span>
      <strong class="sub-title">
        <span class="title-text" :title="djProgramDetailData?.radio?.name">
          {{ djProgramDetailData?.radio?.name }}
        </span>
        第{{ djProgramDetailData?.serialNum }}期
      </strong>
      <span class="sub-time">
        {{
          formatDateTime(djProgramDetailData?.createTime / 1000, 'yyyy-MM-dd')
        }}
        创建
      </span>
      <div class="title-play-num">
        播放:
        <span class="eye-catching">
          {{ djProgramDetailData?.listenerCount }}
        </span>
        次
      </div>
    </div>
    <div class="simple-description">
      介绍： {{ djProgramDetailData?.description }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { formatDateTime } from '@utils/utils.ts';

export default defineComponent({
  props: {
    djProgramDetailData: {
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
    const djprogramId = computed(() => $store.getters.djprogramId);

    // 喜欢
    function handleLike(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function jumpToComments(): void {
      emit('jumpToComments');
    }

    // 分享
    function handleShare(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function handleDownload(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    return {
      formatDateTime,
      djprogramId,
      handleLike,
      jumpToComments,
      handleShare,
      handleDownload
    };
  }
});
</script>

<style lang="less" scoped>
@import './djprogram-info.less';
</style>
