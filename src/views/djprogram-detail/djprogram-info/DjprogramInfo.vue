<template>
  <div class="djprogram-user-info-container">
    <div class="cover-warp">
      <div class="cover">
        <img
          class="cover-img"
          :src="`${djProgramDetailData?.coverUrl}?param=130y130`"
          alt=""
        />
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
        <div class="other like" @click="likeClick">
          <template v-if="djProgramDetailData?.likedCount > 0">
            <icon class="like-icon"></icon>
            <span class="icon"> ({{ djProgramDetailData?.likedCount }}) </span>
          </template>
          <template v-else>
            <icon class="like-icon"></icon>
            <span class="icon">喜欢</span>
          </template>
        </div>
        <div class="other comment" @click="commentClick">
          <template v-if="commentTotal > 0">
            <span class="icon"> ({{ commentTotal }}) </span>
          </template>
          <template v-else>
            <span class="icon">评论</span>
          </template>
        </div>
        <div class="other share" @click="shareClick">
          <template v-if="djProgramDetailData?.shareCount > 0">
            <span class="icon"> ({{ djProgramDetailData?.shareCount }}) </span>
          </template>
          <template v-else>
            <span class="icon">分享</span>
          </template>
        </div>
        <div class="other download" @click="downloadClick">
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
  emits: ['commentClick'],
  setup(props, { emit }) {
    const $store = useStore();

    // 电台节目id
    const djprogramId = computed(() => $store.getters.djprogramId);

    // 喜欢
    function likeClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function commentClick(): void {
      emit('commentClick');
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function downloadClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    return {
      formatDateTime,
      djprogramId,
      likeClick,
      commentClick,
      shareClick,
      downloadClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './djprogram-info.less';
</style>
