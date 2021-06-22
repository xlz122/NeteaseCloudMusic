<template>
  <div class="container">
    <div class="content">
      <div class="top-info">
        <img class="avatarUrl" :src="profileInfo.avatarUrl" />
        <div class="info-1">
          <span class="title">{{ profileInfo.nickname }}</span>
          <span class="level display-overflow">
            {{ profileInfo.level || 0 }}
            <i class="wei display-overflow"></i>
          </span>
          <i class="sex display-overflow"></i>
          <div class="edit-btn display-overflow">
            编辑个人资料
            <i class="wei display-overflow"></i>
          </div>
        </div>
        <ul class="info-2">
          <li>
            <div class="val">{{ profileInfo.eventCount }}</div>
            <div class="dec">动态</div>
          </li>
          <li>
            <div class="val">{{ profileInfo.follows }}</div>
            <div class="dec">关注</div>
          </li>
          <li>
            <div class="val">{{ profileInfo.followeds }}</div>
            <div class="dec">粉丝</div>
          </li>
        </ul>
        <div class="introduce">个人介绍：{{ profileInfo.signature }}</div>
        <div class="info-3">
          <span>所在地区：{{ provinceName }}-{{ cityName }}</span>
        </div>
        <div class="info-4">
          社交网络：
          <i class="weibo display-overflow"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import findCityZipCode from './city';

export default defineComponent({
  setup() {
    const $store = useStore();
    // 用户信息
    const profileInfo = computed(() => $store.getters.userInfo.profile || {});
    // 省
    const provinceName = findCityZipCode(profileInfo.value.province);
    // 市
    const cityName = findCityZipCode(profileInfo.value.city);
    // $store.getters.userInfo.level 等级
    // gender 性别
    return {
      profileInfo,
      provinceName,
      cityName
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-home-page.less';
</style>
