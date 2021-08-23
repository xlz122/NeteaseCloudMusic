<template>
  <div class="search-singer">
    <ul class="search-singer-list">
      <li
        class="search-singer-item"
        v-for="(item, index) in singerData.list"
        :key="index"
        :class="{ 'first-item': index % 6 }"
      >
        <div class="item-cover" @click="jumpSingerDetail(item?.id)">
          <img
            class="item-cover-img"
            :src="`${item.picUrl}?param=130y130`"
            alt=""
          />
        </div>
        <div class="item-info">
          <span class="item-info-text" @click="jumpSingerDetail(item?.id)">
            {{ item.name }}
          </span>
          <span class="item-info-icon" v-if="item.accountId"></span>
        </div>
      </li>
    </ul>
    <Page
      v-if="singerData.total"
      :page="singerData.page"
      :pageSize="singerData.pageSize"
      :total="singerData.total"
      @changPage="changPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type SingerData = {
  page: number;
  pageSize: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const singerData = reactive<SingerData>({
      page: 1,
      pageSize: 30,
      total: 0,
      list: []
    });

    // 导航搜索回车
    watch(
      () => searchText.value,
      () => {
        getSearchSinger();
      },
      {
        immediate: true
      }
    );

    // 获取歌手列表
    function getSearchSinger(): void {
      searchKeywords({
        keywords: searchText.value,
        offset: singerData.page - 1,
        limit: singerData.pageSize,
        type: 100
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerData.total = res?.result?.artistCount;
            singerData.list = res?.result?.artists;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

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
      singerData.page = current;
      getSearchSinger();
    }

    return {
      timeStampToDuration,
      userInfo,
      singerData,
      jumpSingerDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-singer.less';
</style>
