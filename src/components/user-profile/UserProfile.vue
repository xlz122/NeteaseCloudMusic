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
    <div
      class="user-record"
      v-if="
        currentUserInfo?.profile?.userType === 0 ||
        currentUserInfo?.profile?.userType === 4
      "
    >
      <UserRecord />
    </div>
    <div class="song-sheet">
      <SongSheetList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import findCityZipCode from './city';
import { userDetail } from '@api/user';
import { ResponseType } from '@/types/types';
import UserInfo from '@/components/user-profile/user-info/UserInfo.vue';
import UserRecord from '@components/user-profile/user-record/UserRecord.vue';
import SongSheetList from '@/components/user-profile/song-sheet-list/SongSheetList.vue';

export default defineComponent({
  components: {
    UserInfo,
    UserRecord,
    SongSheetList
  },
  setup() {
    const $store = useStore();

    const userInfo = computed(() => $store.getters.userInfo);
    const userId = computed<number>(() => $store.getters.userId);

    watch(
      () => userId.value,
      curVal => {
        if (curVal) {
          getUserDetail();
        }
      },
      {
        immediate: true
      }
    );

    const currentUserInfo = ref({});
    // 省、市
    const provinceName = ref<string>('');
    const cityName = ref<string>('');

    // 获取当前用户详情
    function getUserDetail() {
      userDetail({ uid: userId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            currentUserInfo.value = res;
            if (res?.profile?.province) {
              provinceName.value = findCityZipCode(res?.profile?.province || 0);
              cityName.value = findCityZipCode(res?.profile?.city || 0);
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    onMounted(() => {
      $store.commit('setHeaderActiveIndex', -1);
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      userId,
      userInfo,
      currentUserInfo,
      provinceName,
      cityName
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-profile.less';
</style>
