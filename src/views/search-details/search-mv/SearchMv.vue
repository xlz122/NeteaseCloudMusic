<template>
  <ul class="search-mv-list">
    <li
      class="search-mv-item"
      v-for="(item, index) in mvData.list"
      :key="index"
      :class="{ 'first-item': index % 5 }"
    >
      <div class="cover">
        <img class="img" :src="item?.coverUrl" alt="" />
        <div class="play-volume">
          <span class="icon-play"></span>
          <span class="text">{{ bigNumberTransform(item?.playTime) }}</span>
        </div>
        <div class="duration">
          {{ timeStampToDuration(item?.durationms / 1000) }}
        </div>
      </div>
      <div class="item-title">
        <i class="icon" v-if="item?.type === 0"></i>
        <span :title="item?.title">{{ item?.title }}</span>
      </div>
      <div class="item-name">
        <span class="text" v-if="item?.type !== 0">by</span>
        <span class="name" @click="jumpSingerDetail(item?.creator[0].userId)">
          {{ item?.creator[0].userName }}
        </span>
      </div>
    </li>
  </ul>
  <Page
    v-if="mvData.total > mvData.limit"
    :page="mvData.offset"
    :pageSize="mvData.limit"
    :total="mvData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { bigNumberTransform, timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type MvData = {
  offset: number;
  limit: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    searchDetailText: {
      type: String,
      default: ''
    }
  },
  emits: ['searchCountChange'],
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const mvData = reactive<MvData>({
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    // 详情搜索回车
    watch(
      () => searchDetailText.value,
      () => {
        getSearchMv();
      }
    );

    // 获取视频列表
    function getSearchMv(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (mvData.offset - 1) * mvData.limit,
        limit: mvData.limit,
        type: 1014
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            mvData.total = res?.result?.videoCount;
            mvData.list = res?.result?.videos;
            emit('searchCountChange', res?.result?.videoCount);
            console.log(mvData.list);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSearchMv();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 分页
    function changPage(current: number): void {
      mvData.offset = current;
      getSearchMv();
    }

    return {
      bigNumberTransform,
      timeStampToDuration,
      userInfo,
      mvData,
      jumpSingerDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-mv.less';
</style>
