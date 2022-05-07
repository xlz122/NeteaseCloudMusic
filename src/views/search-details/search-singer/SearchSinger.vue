<template>
  <div class="loading" v-if="singerData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <div class="search-singer" v-if="!singerData?.loading">
    <ul class="search-singer-list">
      <li
        class="search-singer-item"
        v-for="(item, index) in singerData?.list"
        :key="index"
        :class="{ 'first-item': index % 6 }"
      >
        <div
          class="item-cover"
          :title="item?.name"
          @click="jumpSingerDetail(item?.id)"
        >
          <img
            class="item-cover-img"
            :src="`${item?.picUrl}?param=130y130`"
            alt=""
          />
        </div>
        <div class="item-info">
          <span
            class="item-info-text"
            :title="item?.name"
            @click="jumpSingerDetail(item?.id)"
          >
            <template
              v-for="(item, index) in handleMatchString(
                item?.name,
                searchDetailText
              )"
              :key="index"
            >
              <span v-if="item.color" :style="{ color: item.color }">
                {{ item.title }}
              </span>
              <span v-else>
                {{ item.title }}
              </span>
            </template>
          </span>
          <span
            class="item-info-icon"
            v-if="item?.accountId"
            @click="jumpUserProfile(item?.accountId)"
          ></span>
        </div>
      </li>
    </ul>
    <Page
      v-if="singerData.total > singerData.limit"
      :page="singerData.offset"
      :pageSize="singerData.limit"
      :total="singerData.total"
      @changPage="changPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { timeStampToDuration, handleMatchString } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type SingerData = {
  loading: boolean;
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
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    // 搜索关键词
    const searchText = computed<string>(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const singerData = reactive<SingerData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    watch(
      () => searchDetailText.value,
      () => {
        getSearchSinger();
      }
    );

    // 获取歌手列表
    function getSearchSinger(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (singerData.offset - 1) * singerData.limit,
        limit: isLogin.value ? singerData.limit : 20,
        type: 100
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            const total = isLogin.value
              ? res?.result?.artistCount
              : res?.result?.artists.length;

            singerData.total = total;
            singerData.list = res?.result?.artists;

            emit('searchCountChange', total || 0);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }

          singerData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSinger();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 分页
    function changPage(current: number): void {
      singerData.offset = current;
      getSearchSinger();
    }

    return {
      timeStampToDuration,
      handleMatchString,
      userInfo,
      singerData,
      jumpSingerDetail,
      jumpUserProfile,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-singer.less';
</style>
