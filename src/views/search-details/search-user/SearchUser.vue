<template>
  <div class="loading" v-if="userData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <ul class="search-user-list" v-if="!userData.loading">
    <li
      class="search-user-item"
      v-for="(item, index) in userData.list"
      :key="index"
      :class="{ even: index % 2 }"
    >
      <div class="item-cover" :title="item.nickname" @click="jumpUserProfile(item.userId)">
        <img class="img" :src="item.avatarUrl" alt="" />
      </div>
      <div class="item-title">
        <span class="text" :title="item.nickname" @click="jumpUserProfile(item.userId)">
          <span v-html="handleMatchString(item.nickname, String(route.query.keyword))"></span>
        </span>
        <i class="icon-sex male" v-if="item.gender === 1"></i>
        <i class="icon-sex female" v-if="item.gender === 2"></i>
      </div>
      <div class="item-follow">
        <template v-if="!item.followed">
          <button class="follow-btn" @click="follow(item.userId)">关注</button>
        </template>
        <template v-if="item.followed">
          <button class="follow-btn followed">已关注</button>
        </template>
      </div>
      <div class="item-text">歌单：{{ item.playlistCount }}</div>
      <div class="item-text">粉丝：{{ item.followeds }}</div>
    </li>
  </ul>
  <Page
    v-if="userData.total > userData.limit"
    :page="userData.offset"
    :pageSize="userData.limit"
    :total="userData.total"
    @onChange="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords, followUser } from '@/api/search';
import type { ResponseType } from '@/types';
import Page from '@/components/page/Page.vue';

type UserData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    gender: number;
    followed: boolean;
    playlistCount: number;
    followeds: number;
  }[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取用户列表
const userData = reactive<UserData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchUser(): void {
  userData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (userData.offset - 1) * userData.limit,
    limit: isLogin.value ? userData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        userData.total = res.result?.userprofiles?.length ?? 0;
      }
      if (isLogin.value) {
        userData.total = res.result?.userprofileCount ?? 0;
      }
      userData.list = res.result?.userprofiles ?? [];
      userData.loading = false;

      emits('searchCountChange', userData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    userData.offset = 1;
    getSearchUser();
  },
  { immediate: true }
);

function follow(userId: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  followUser({ id: userId, t: 1 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      getSearchUser();
      setMessage({ type: 'info', title: '关注成功' });
    })
    .catch((error) => {
      if (error.response?.data?.code === -462) {
        store.commit('setVerifyDialog', {
          visible: true,
          token: error.response?.data?.data?.verifyToken,
          vid: error.response?.data?.data?.verifyId,
          type: error.response?.data?.data?.verifyType,
          evid: error.response?.data?.data?.params?.event_id,
          sign: error.response?.data?.data?.params?.sign
        });
      }
    });
}

function handlePageChange(current: number): void {
  userData.offset = current;
  getSearchUser();
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-user.less');
</style>
