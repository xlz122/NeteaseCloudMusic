<template>
  <div class="user-profile-container">
    <div class="user-info">
      <UserInfo
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
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
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

const $route = useRoute();
const $store = useStore();

// 获取当前用户详情
const currentUserInfo = ref<CurrentUserInfo>({});
const provinceName = ref<string>('');
const cityName = ref<string>('');

function getUserDetail() {
  userDetail({ uid: Number($route.query.id) })
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

watch(
  () => $route.query.id,
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

onMounted(() => {
  $store.commit('setMenuIndex', -1);
  $store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./user-profile.less');
</style>
