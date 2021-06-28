<template>
  <div class="container">
    <!-- 个人信息部分 -->
    <div class="content">
      <div class="top-info">
        <img class="avatarUrl" :src="profileInfo.avatarUrl" />
        <div class="info-1">
          <span class="title">{{ profileInfo.nickname }}</span>
          <span class="level display-overflow">
            {{ level || 0 }}
            <i class="wei display-overflow"></i>
          </span>
          <i class="sex display-overflow" v-if="profileInfo.gender === 1"></i>
          <i class="sex female display-overflow" v-else></i>
          <div class="edit-btn display-overflow">
            <i class="wei display-overflow">编辑个人资料</i>
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
    <div class="song-sheet">
      <!-- 创建的歌单 -->
      <div class="title">
        <span class="text">
          我创建的歌单({{ songList.createSongList.length }})
          <i class="icon-r"></i>
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songList.createSongList"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
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
      <!-- 收藏的歌单 -->
      <div class="title">
        <span class="text">
          我收藏的歌单({{ songList.collectionSongList.length }})
          <i class="icon-r"></i>
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songList.collectionSongList"
          :key="index"
          :class="{ 'first-list-item': index === 0 }"
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import findCityZipCode from './city';
import { userPlayList } from '@api/my-music';
import { SongList, ResponseType, LoopType } from '@/types/types';
import { bigNumberTransform } from '@utils/utils';

export default defineComponent({
  setup() {
    const $store = useStore();
    // 用户信息
    const profileInfo = computed(() => $store.getters.userInfo.profile || {});
    // 用户等级
    const level = computed(() => $store.getters.userInfo.level || 0);
    // 省
    const provinceName = findCityZipCode(profileInfo.value.province);
    // 市
    const cityName = findCityZipCode(profileInfo.value.city);

    // 获取歌单列表
    const songList = reactive<SongList>({
      createSongList: [], // 创建的歌单
      collectionSongList: [] // 收藏的歌单
    });
    function getUserPlayList(): void {
      // 账户数据
      const accountInfo = computed(() => $store.getters.accountInfo);
      userPlayList({
        uid: accountInfo.value.id
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 列表数据
          res.playlist.forEach((item: LoopType) => {
            // 喜欢的音乐处理
            if (item.name.includes('喜欢的音乐')) {
              item.name = '我喜欢的音乐';
            }
            // 收藏列表判断
            if (!item.subscribed) {
              songList.createSongList.push(item);
              songList.createSongList.push(item);
            } else {
              songList.collectionSongList.push(item);
            }
            // 数量处理
            item.playCount = bigNumberTransform(item.playCount);
          });
        }
      });
    }
    getUserPlayList();

    return {
      profileInfo,
      level,
      provinceName,
      cityName,
      songList
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-home-page.less';
</style>
