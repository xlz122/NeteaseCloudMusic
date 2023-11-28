<template>
  <div class="user-profile-container">
    <div class="user-info">
      <UserInfo
        :userId="userId"
        :userInfo="userInfo"
        :currentUserInfo="currentUserInfo"
        :provinceName="provinceName"
        :cityName="cityName"
      />
    </div>
    <div class="user-record" v-if="currentUserInfo?.peopleCanSeeMyPlayRecord">
      <UserRecord :listenSongs="currentUserInfo?.listenSongs" />
    </div>
    <div class="song-sheet">
      <SongSheetList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import findCityZipCode from './city';
import { userDetail } from '@/api/user';
import type { ResponseType } from '@/types/types';
import UserInfo from '@/components/user-profile/user-info/UserInfo.vue';
import UserRecord from '@/components/user-profile/user-record/UserRecord.vue';
import SongSheetList from '@/components/user-profile/song-sheet-list/SongSheetList.vue';

type CurrentUserInfo = {
  peopleCanSeeMyPlayRecord?: boolean;
  listenSongs?: number;
};

const $store = useStore();
const userInfo = computed(() => $store.getters.userInfo);
const userId = computed<number>(() => $store.getters.userId);

watch(
  () => userId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getUserDetail();
  },
  {
    immediate: true
  }
);

// 获取当前用户详情
const currentUserInfo = ref<CurrentUserInfo>({});
const provinceName = ref<string>('');
const cityName = ref<string>('');

function getUserDetail() {
  userDetail({ uid: userId.value })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        currentUserInfo.value = res as CurrentUserInfo;

        // 省、市
        if (res?.profile?.province) {
          provinceName.value = findCityZipCode(res?.profile?.province || 0);
          cityName.value = findCityZipCode(res?.profile?.city || 0);
        }
      }
    })
    .catch(() => ({}));
}

onMounted(() => {
  $store.commit('setMenuIndex', -1);
  $store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./user-profile.less');
</style>
