<template>
  <div class="loading" v-if="userData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-user-list" v-if="!userData?.loading">
    <li
      class="search-user-item"
      v-for="(item, index) in userData?.list"
      :key="index"
      :class="{ even: index % 2 }"
    >
      <div
        class="item-cover"
        :title="item?.nickname"
        @click="jumpUserProfile(item?.userId)"
      >
        <img class="img" :src="item?.avatarUrl" alt="" />
      </div>
      <div class="item-title">
        <span
          class="text"
          :title="item?.nickname"
          @click="jumpUserProfile(item?.userId)"
        >
          <template
            v-for="(item, index) in handleMatchString(
              item?.nickname,
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
        <i class="icon-sex male" v-if="item?.gender === 1"></i>
        <i class="icon-sex female" v-if="item?.gender === 2"></i>
      </div>
      <div class="item-follow">
        <template v-if="!item?.followed">
          <button class="follow-btn" @click="follow(item?.userId)">关注</button>
        </template>
        <template v-if="item?.followed">
          <button class="follow-btn followed">已关注</button>
        </template>
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
import { setMessage } from '@/components/message/useMessage';
import { handleMatchString } from '@utils/utils';
import { searchKeywords, followUser } from '@api/search';
import type { ResponseType } from '@/types/types';
import Page from '@components/page/Page.vue';

type AlbumData = {
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
    // 搜索关键词
    const searchText = computed<string>(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const userData = reactive<AlbumData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    watch(
      () => searchDetailText.value,
      () => {
        getSearchUser();
      },
      {
        immediate: true
      }
    );

    // 获取用户列表
    function getSearchUser(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (userData.offset - 1) * userData.limit,
        limit: isLogin.value ? userData.limit : 20,
        type: 1002
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            const total = isLogin.value
              ? res?.result?.userprofileCount
              : res?.result?.userprofiles.length;

            userData.total = total;
            userData.list = res?.result?.userprofiles;
            emit('searchCountChange', total || 0);
          }

          userData.loading = false;
        })
        .catch(() => ({}));
    }

    function follow(userId: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      followUser({ id: userId, t: 1 })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            getSearchUser();
            setMessage({ type: 'info', title: '关注成功' });
          }
          if (res?.code === 250) {
            setMessage({ type: 'error', title: res?.message });
          }
        })
        .catch(() => ({}));
    }

    // 分页
    function changPage(current: number): void {
      userData.offset = current;
      getSearchUser();
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      handleMatchString,
      userData,
      follow,
      changPage,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-user.less';
</style>
