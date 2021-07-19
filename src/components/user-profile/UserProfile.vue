<template>
  <div class="user-profile-container">
    <!-- 个人信息 -->
    <div class="content">
      <div class="top-info">
        <img class="avatarUrl" :src="userInfo?.profile?.avatarUrl" />
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
        <div class="introduce">
          个人介绍：{{ userInfo?.profile?.signature }}
        </div>
        <div class="info-3">
          <span>所在地区：{{ provinceName }}-{{ cityName }}</span>
        </div>
        <div class="info-4">
          社交网络：
          <i class="weibo display-overflow"></i>
        </div>
      </div>
    </div>
    <!-- 歌单 -->
    <div class="song-sheet">
      <!-- 创建的歌单 -->
      <template v-if="songSheetList.createSongList.length > 0">
        <div class="title">
          <span class="text">
            <span v-if="isLogOnUser">我创建的歌单</span>
            <span v-else>{{ userInfo?.profile?.nickname }}创建的歌单</span>
            <i class="icon-r"></i>
          </span>
          <span class="text-length">
            ({{ songSheetList.createSongList.length }})
          </span>
        </div>
        <ul class="song-sheet-list">
          <li
            class="list-item"
            v-for="(item, index) in songSheetList.createSongList"
            :key="index"
            :class="{ 'first-list-item': !(index % 5) }"
            @click="jumpSongSheetDetail(item.id)"
          >
            <div class="item-cover" :title="item.title">
              <img
                class="cover-img"
                :src="`${item.coverImgUrl}?param=140y140`"
                alt="cover-img"
              />
              <div class="cover-bottom">
                <i class="info-icon"></i>
                <span class="num">{{ item.playCount }}</span>
                <i class="info-icon-right"></i>
              </div>
            </div>
            <p class="item-desc" :title="item.title">{{ item.name }}</p>
          </li>
        </ul>
      </template>
      <!-- 收藏的歌单 -->
      <template v-if="songSheetList.collectionSongList.length > 0">
        <div class="title">
          <span class="text">
            <span v-if="isLogOnUser">我收藏的歌单</span>
            <span v-else>{{ userInfo?.profile?.nickname }}收藏的歌单</span>
            <i class="icon-r"></i>
          </span>
          <span class="text-length">
            ({{ songSheetList.collectionSongList.length }})
          </span>
        </div>
        <ul class="song-sheet-list">
          <li
            class="list-item"
            v-for="(item, index) in songSheetList.collectionSongList"
            :key="index"
            :class="{ 'first-list-item': index === 0 }"
            @click="jumpSongSheetDetail(item.id)"
          >
            <div class="item-cover" :title="item.title">
              <img
                class="cover-img"
                :src="`${item.coverImgUrl}?param=140y140`"
                alt="cover-img"
              />
              <div class="cover-bottom">
                <i class="info-icon"></i>
                <span class="num">{{ item.playCount }}</span>
                <i class="info-icon-right"></i>
              </div>
            </div>
            <p class="item-desc" :title="item.title">{{ item.name }}</p>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { userDetail } from '@api/user';
import { userPlayList } from '@api/my-music';
import findCityZipCode from './city';
import { SongList, ResponseType, LoopType } from '@/types/types';
import { bigNumberTransform } from '@utils/utils';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    const uid = ref<number>(-1);
    // 监听路由传参，获取用户详情、歌单列表
    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          uid.value = Number(curVal.id);
          getUserDetail();
          getUserPlayList();
        }
      },
      {
        immediate: true
      }
    );

    // 传入的uid是否是当前登录用户
    const profileInfo = computed(() => $store.getters.userInfo?.profile || {});
    const isLogOnUser = computed(() => profileInfo.value.userId === uid.value);

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

    // 获取歌单列表
    const songSheetList = reactive<SongList>({
      createSongList: [], // 创建的歌单
      collectionSongList: [] // 收藏的歌单
    });
    function getUserPlayList(): void {
      userPlayList({
        uid: uid.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 列表数据
            res.playlist.forEach((item: LoopType) => {
              // 喜欢的音乐处理
              if (isLogOnUser.value && item.name.includes('喜欢的音乐')) {
                item.name = '我喜欢的音乐';
              }
              // 收藏列表判断
              if (!item.subscribed) {
                songSheetList.createSongList.push(item);
              } else {
                songSheetList.collectionSongList.push(item);
              }
              // 统计处理
              item.playCount = bigNumberTransform(item.playCount);
            });
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { id } });
    }

    return {
      isLogOnUser,
      userInfo,
      provinceName,
      cityName,
      songSheetList,
      jumpSongSheetDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-profile.less';
</style>
