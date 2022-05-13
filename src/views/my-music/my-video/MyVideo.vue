<template>
  <div class="my-video">
    <div class="title">
      <span class="text">我的视频({{ options?.myVideo?.count }})</span>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in myVideoList"
        :key="index"
        @click="jumpVideoDetail(item?.type, item?.vid)"
      >
        <div class="cover">
          <template v-if="item?.coverUrl">
            <img class="img" :src="item?.coverUrl" alt="" />
          </template>
          <template v-else>
            <img class="img" src="" alt="" />
          </template>
          <div class="play-volume">
            <i class="icon-play"></i>
            <span class="text">{{ item?.playTime }}</span>
          </div>
          <div class="duration">
            {{ timeStampToDuration(item?.durationms / 1000) }}
          </div>
        </div>
        <div class="item-title" :title="item?.title">
          <i class="icon-mv" v-if="item?.type === 0"></i>
          {{ item?.title }}
        </div>
        <div class="item-name">
          <span class="text" v-if="item?.type === 1">by</span>
          <span class="name" @click="jumpUserProfile(item?.creator[0]?.userId)">
            {{ item?.creator[0]?.userName }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';
import { MyVideoSbulist } from '@api/my-music';
import { ResponseType } from '@/types/types';

export default defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['handleOptions'],
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    const myVideoList = ref<unknown[]>([]);

    // 获取视频列表
    function getMyVideoList(): void {
      MyVideoSbulist()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            myVideoList.value = res?.data || [];

            emit('handleOptions', {
              type: 'myVideo',
              data: {
                visible: true,
                count: res?.count
              }
            });
          }
        })
        .catch(() => ({}));
    }
    getMyVideoList();

    // 跳转视频详情
    function jumpVideoDetail(type: number, id: number): void {
      // type 0为mv, 1为视频
      if (type === 0) {
        $router.push({ name: 'mv-detail', params: { id } });
      }
      if (type === 1) {
        $router.push({ name: 'video-detail', params: { id } });
      }
      $store.commit('video/setVideo', { id, url: '' });
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      timeStampToDuration,
      myVideoList,
      jumpVideoDetail,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scopde>
@import './my-video.less';
</style>
