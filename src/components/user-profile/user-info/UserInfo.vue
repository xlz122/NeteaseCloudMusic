<template>
  <div class="user-info-container">
    <img class="avatarUrl" :src="currentUserInfo?.profile?.avatarUrl" />
    <div class="info-right">
      <div class="info-1">
        <span class="title">{{ currentUserInfo?.profile?.nickname }}</span>
        <span class="level display-overflow">
          {{ currentUserInfo?.level || 0 }}
          <i class="wei display-overflow"></i>
        </span>
        <i
          class="sex display-overflow"
          v-if="currentUserInfo?.profile?.gender === 1"
        ></i>
        <i class="sex female display-overflow" v-else></i>
        <div
          class="edit-btn display-overflow"
          v-if="userInfo?.profile?.userId === userId"
        >
          <i class="wei display-overflow edit">编辑个人资料</i>
        </div>
      </div>
      <ul class="info-2">
        <li>
          <div class="val">{{ currentUserInfo?.profile?.eventCount }}</div>
          <div class="dec">动态</div>
        </li>
        <li>
          <div class="val">{{ currentUserInfo?.profile?.follows }}</div>
          <div class="dec">关注</div>
        </li>
        <li>
          <div class="val">{{ currentUserInfo?.profile?.followeds }}</div>
          <div class="dec">粉丝</div>
        </li>
      </ul>
      <div class="introduce">
        个人介绍：{{ currentUserInfo?.profile?.signature }}
      </div>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserInfoView',
  props: {
    userId: {
      type: Number,
      default: 0
    },
    userInfo: {
      type: Object,
      default: () => ({})
    },
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
  }
});
</script>

<style lang="less" scoped>
@import './user-info.less';
</style>
