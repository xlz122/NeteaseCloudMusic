<template>
  <div class="message box-border">
    <div class="user-info">
      <div class="user-head">
        <div class="payment">
          <router-link to="">
            本月已下载的付费歌曲
            <i>></i>
          </router-link>
          <router-link to="">
            我购买的单曲
            <i>></i>
          </router-link>
        </div>
        <div class="member dis-flex">
          <div class="avatar">
            <img
              class="avatar-img"
              :src="userInfo?.profile?.avatarUrl"
              alt="头像"
            />
          </div>
          <div class="user-content">
            <div class="dis-flex align-center">
              <div class="f22">{{ userInfo?.profile?.nickname }}</div>
              <template v-if="vipInfo?.redVipLevelIcon">
                <img class="vip-level" :src="vipInfo?.redVipLevelIcon" alt="" />
              </template>
            </div>
            <div class="mt6">当前未开通</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { userVipInfo } from '@api/user';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  name: 'UserView',
  props: {
    msgCode: {
      type: Number,
      required: true
    }
  },
  setup() {
    const $store = useStore();

    const userInfo = computed(() => $store.getters.userInfo);

    const vipInfo = ref({});
    // 获取登录用户vip信息
    function getVipInfo() {
      userVipInfo()
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            vipInfo.value = res?.data;
          }
        })
        .catch(() => ({}));
    }
    getVipInfo();
    return {
      userInfo,
      vipInfo
    };
  }
});
</script>

<style lang="less" scoped>
@import './member.less';
</style>
