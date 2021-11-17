<template>
  <ul class="search-user-list">
    <li
      class="search-user-item"
      v-for="(item, index) in userData.list"
      :key="index"
      :class="{ even: index % 2 }"
    >
      <div class="item-cover" @click="jumpUserProfile(item?.userId)">
        <img class="img" :src="item?.avatarUrl" alt="" />
      </div>
      <div class="item-title">
        <span class="text" @click="jumpUserProfile(item?.userId)">
          {{ item?.nickname }}
        </span>
        <i class="icon-sex male" v-if="item?.gender === 1"></i>
        <i class="icon-sex female" v-if="item?.gender === 2"></i>
      </div>
      <div class="item-follow">
        <button class="follow-btn" @click="follow">关注</button>
      </div>
      <div class="item-text">歌单：{{ item?.playlistCount }}</div>
      <div class="item-text">粉丝：{{ item?.followeds }}</div>
    </li>
  </ul>
  <Page
    v-if="userData.total > userData.limit"
    :page="userData.offset"
    :pageSize="userData.limit"
    :total="userData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type AlbumData = {
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

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    const { searchDetailText } = toRefs(props);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const userData = reactive<AlbumData>({
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    // 详情搜索回车
    watch(
      () => searchDetailText.value,
      () => {
        getSearchUser();
      }
    );

    // 获取用户列表
    function getSearchUser(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (userData.offset - 1) * userData.limit,
        limit: userData.limit,
        type: 1002
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            userData.total = res?.result?.userprofileCount;
            userData.list = res?.result?.userprofiles;
            emit('searchCountChange', res?.result?.userprofileCount);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSearchUser();

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 关注
    function follow(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分页
    function changPage(current: number): void {
      userData.offset = current;
      getSearchUser();
    }

    return {
      userData,
      jumpUserProfile,
      follow,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-user.less';
</style>
