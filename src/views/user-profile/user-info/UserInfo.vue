<template>
  <div class="user-info-container">
    <img class="avatar-url" :src="currentUserInfo.profile?.avatarUrl" />
    <div class="info-right">
      <div class="info-1">
        <span class="title">{{ currentUserInfo.profile?.nickname }}</span>
        <template v-if="vipInfo.redVipLevelIcon">
          <img class="vip-level" :src="vipInfo.redVipLevelIcon" alt="" />
        </template>
        <span class="level display-overflow">
          <span class="level-text">{{ currentUserInfo.level }}</span>
          <i class="wei display-overflow"></i>
        </span>
        <i class="sex display-overflow" v-if="currentUserInfo.profile?.gender === 1"></i>
        <i class="sex female display-overflow" v-else></i>
        <div
          class="edit-btn display-overflow"
          v-if="userInfo.profile?.userId === Number(route.query.id)"
        >
          <i class="wei display-overflow edit">编辑个人资料</i>
        </div>
      </div>
      <ul class="info-2">
        <li>
          <div class="val">{{ currentUserInfo.profile?.eventCount }}</div>
          <div class="dec">动态</div>
        </li>
        <li>
          <div class="val">{{ currentUserInfo.profile?.follows }}</div>
          <div class="dec">关注</div>
        </li>
        <li>
          <div class="val">{{ currentUserInfo.profile?.followeds }}</div>
          <div class="dec">粉丝</div>
        </li>
      </ul>
      <div class="introduce">个人介绍：{{ currentUserInfo.profile?.signature }}</div>
      <div class="info-3" v-if="provinceName">
        <span>所在地区：{{ provinceName }}-{{ cityName }}</span>
      </div>
      <div class="info-4" v-if="false">
        社交网络：
        <i class="weibo display-overflow"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { userVipInfo } from '@/api/user';
import type { ResponseType } from '@/types';

type VipInfo = {
  redVipLevelIcon?: string;
};

defineProps({
  currentUserInfo: {
    type: Object,
    default: () => ({})
  },
  provinceName: {
    type: String,
    default: ''
  },
  cityName: {
    type: String,
    default: ''
  }
});

const route = useRoute();
const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

// 获取用户vip信息
const vipInfo = ref<VipInfo>({});

function getUserVipInfo(): void {
  userVipInfo()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      vipInfo.value = res.data ?? {};
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    if (userInfo.value.profile?.userId !== Number(route.query.id)) {
      return;
    }

    getUserVipInfo();
  }
);
</script>

<style lang="less" scoped>
@import url('./user-info.less');
</style>
