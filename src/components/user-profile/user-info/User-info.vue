<template>
  <div class="user-info-container">
    <img class="avatarUrl" :src="userInfo?.profile?.avatarUrl" />
    <div class="info-right">
      <div class="info-1">
        <span class="title">{{ userInfo?.profile?.nickname }}</span>
        <span class="level display-overflow">
          {{ userInfo?.level || 0 }}
          <i class="wei display-overflow"></i>
        </span>
        <i
          class="sex display-overflow"
          v-if="userInfo?.profile?.gender === 1"
        ></i>
        <i class="sex female display-overflow" v-else></i>
        <div class="edit-btn display-overflow" v-if="isLogOnUser">
          <i class="wei display-overflow edit">编辑个人资料</i>
        </div>
      </div>
      <ul class="info-2">
        <li>
          <div class="val">{{ userInfo?.profile?.eventCount }}</div>
          <div class="dec">动态</div>
        </li>
        <li>
          <div class="val">{{ userInfo?.profile?.follows }}</div>
          <div class="dec">关注</div>
        </li>
        <li>
          <div class="val">{{ userInfo?.profile?.followeds }}</div>
          <div class="dec">粉丝</div>
        </li>
      </ul>
      <div class="introduce">个人介绍：{{ userInfo?.profile?.signature }}</div>
      <div class="info-3">
        <span>所在地区：{{ provinceName }}-{{ cityName }}</span>
      </div>
      <div class="info-4">
        社交网络：
        <i class="weibo display-overflow"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { userDetail } from '@api/user';
import findCityZipCode from './city';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const $store = useStore();

    // 用户uid
    const uid = computed(() => $store.getters.userId);
    // 监听路由传参，获取用户详情、歌单列表
    watch(
      () => $route.params,
      curVal => {
        // 传入
        if (curVal.id) {
          $store.commit('setUserId', Number(curVal.id));
          getUserDetail();
        }
        // 刷新
        if (uid.value) {
          getUserDetail();
        }
      },
      {
        immediate: true
      }
    );

    // 传入的uid是否是当前登录用户
    const isLogOnUser = computed(
      () => $store.getters.userInfo?.profile.userId === uid.value
    );

    // 用户详情
    const userInfo = ref({});
    // 省
    const provinceName = ref<string>('');
    // 市
    const cityName = ref<string>('');

    // 获取用户详情
    function getUserDetail() {
      userDetail({ uid: uid.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            userInfo.value = res;
            provinceName.value = findCityZipCode(res?.profile?.province || 0);
            cityName.value = findCityZipCode(res?.profile?.city || 0);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    return {
      isLogOnUser,
      userInfo,
      provinceName,
      cityName
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-info.less';
</style>
