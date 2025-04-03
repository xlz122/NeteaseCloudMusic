<template>
  <div class="user-profile-container">
    <div class="user-info">
      <UserInfo
        :currentUserInfo="currentUserInfo"
        :provinceName="provinceName"
        :cityName="cityName"
      />
    </div>
    <div class="user-record" v-if="currentUserInfo.peopleCanSeeMyPlayRecord">
      <UserRecord :listenSongs="currentUserInfo.listenSongs" />
    </div>
    <div class="song-sheet">
      <SongSheet />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import findCityZipCode from './city';
import { userDetail } from '@/api/user';
import type { ResponseType } from '@/types';
import UserInfo from './user-info/UserInfo.vue';
import UserRecord from './user-record/UserRecord.vue';
import SongSheet from './song-sheet/SongSheet.vue';

type CurrentUserInfo = {
  peopleCanSeeMyPlayRecord?: boolean;
  listenSongs?: number;
};

const route = useRoute();
const store = useStore();

// 获取当前用户详情
const currentUserInfo = ref<CurrentUserInfo>({});
const provinceName = ref('');
const cityName = ref('');

function getUserDetail(): void {
  userDetail({ uid: Number(route.query.id) })
    .then((res: ResponseType & CurrentUserInfo) => {
      if (res?.code !== 200) {
        return;
      }

      currentUserInfo.value = res;
      // 省、市
      if (res.profile?.province) {
        provinceName.value = findCityZipCode(res.profile?.province);
        cityName.value = findCityZipCode(res.profile?.city);
      }
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getUserDetail();
  },
  { immediate: true }
);

onMounted(() => {
  store.commit('setMenuIndex', -1);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./user-profile.less');
</style>
