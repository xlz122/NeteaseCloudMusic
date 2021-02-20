<template>
  <div class="content">
    <div class="group">
      <div class="list-title">
        <span class="title">热门推荐</span>
        <ul class="tab">
          <li class="item first-item">华语</li>
          <li class="item">流行</li>
          <li class="item">摇滚</li>
          <li class="item">民谣</li>
          <li class="item last-item">电子</li>
        </ul>
        <span class="more">更多</span>
      </div>
      <ul class="list-content">
        <!-- 未登录展示5条推荐歌单，登录后，后3条替换未个性化推荐 -->
        <li
          class="item"
          v-for="(item, index) in songListData"
          :key="index"
          :class="{ 'last-item': songListData.length > 2 && index === 3 }"
        >
          <div class="item-top">
            <img class="img" :src="`${item?.picUrl}?param=140y140`" alt="" />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom" :title="item?.name">
            {{ item?.name }}
          </div>
        </li>
        <!-- 登录后展示个性化推荐 -->
        <template v-if="isLogin">
          <li
            class="item"
            v-for="(item, index) in individualizatData"
            :key="index"
            :class="{ 'last-item': index === 1 }"
          >
            <div class="item-top">
              <img class="img" :src="`${item?.picUrl}?param=140y140`" alt="" />
              <div class="info">
                <i class="info-icon"></i>
                <span class="num">{{ item?.playcount }}</span>
                <i class="info-icon-right"></i>
              </div>
            </div>
            <div class="item-bottom" :title="item?.name">
              {{ item?.name }}
            </div>
          </li>
        </template>
        <!-- 推荐电台部分 -->
        <li
          class="item"
          v-for="(item, index) in djprogramData"
          :key="index"
          :class="{ 'last-item': index === 2 }"
        >
          <div class="item-top">
            <img class="img" :src="`${item?.picUrl}?param=140y140`" alt="" />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.program?.adjustedPlayCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom" :title="item?.name">
            <span class="radio-station"></span>
            {{ item?.name }}
          </div>
        </li>
      </ul>
    </div>
    <!-- 个性化推荐 -->
    <div class="group" v-if="isLogin">
      <div class="list-title">
        <span class="title">个性化推荐</span>
      </div>
      <ul class="list-content">
        <li class="item individualization">
          <div class="item-top">
            <i class="img"></i>
            <span class="head">{{ weekText }}</span>
            <span class="head-text">{{ dateText }}</span>
            <span class="mask"></span>
          </div>
          <div class="item-bottom" title="每日歌曲推荐">每日歌曲推荐</div>
          <em class="item-like">根据你的口味生成，每天6:00更新</em>
        </li>
        <li
          class="item individualization"
          v-for="(item, index) in individualizatData"
          :key="index"
          :class="{ 'last-item': index === individualizatData.length - 1 }"
        >
          <div class="item-top">
            <img class="img" :src="`${item?.picUrl}?param=140y140`" alt="" />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playcount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom" :title="item?.name">
            {{ item?.name }}
          </div>
          <em class="item-like">{{ item?.copywriter }}</em>
          <button class="disable-like">不感兴趣</button>
        </li>
      </ul>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">新碟上架</span>
        <span class="more">更多</span>
      </div>
      <album-newest />
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">榜单</span>
        <span class="more">更多</span>
      </div>
      <song-list />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
// 新碟上架
import AlbumNewest from './album-newest/AlbumNewest.vue';
// 榜单
import SongList from './song-list/SongList.vue';
import {
  recommendSongList,
  recommendDjprogram,
  recommendResource
} from '@api/home';
import { ResponseType } from '@/types/types';
import { getWeekDate, formatDateTime } from '@utils/utils';

export default defineComponent({
  components: {
    AlbumNewest,
    SongList
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 监听登录，重新获取各项数据
    watch(
      () => isLogin.value,
      (curVal: boolean) => {
        if (curVal) {
          getSongList();
          getIndividualizat();
        }
      }
    );

    // 获取热门推荐 - 推荐歌单数据
    const songListData = ref<unknown[]>([]);
    function getSongList() {
      // 已登录只获取两条，未登录获取5条
      let limit = 0;
      if (isLogin.value) {
        limit = 2;
      } else {
        limit = 5;
      }
      recommendSongList({ limit }).then((res: ResponseType) => {
        if (res.code === 200) {
          songListData.value = res?.result;
        }
      });
    }
    getSongList();

    // 获取热门推荐 - 推荐电台数据
    const djprogramData = ref<unknown[]>([]);
    function getDjprogram() {
      recommendDjprogram().then((res: ResponseType) => {
        if (res.code === 200) {
          // 截取前三项
          djprogramData.value = res?.result.slice(0, 3);
        }
      });
    }
    getDjprogram();

    const individualizatData = ref<unknown[]>([]);
    // 获取个性化推荐歌单数据
    function getIndividualizat(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      recommendResource().then((res: ResponseType) => {
        if (res.code === 200) {
          // 截取前三项
          individualizatData.value = res?.recommend.slice(0, 3);
        }
      });
    }
    getIndividualizat();

    // 获取当前星期几
    const weekText = ref<string>('');
    weekText.value = getWeekDate();

    // 获取当前日期
    const dateText = ref<string>('');
    dateText.value = formatDateTime(new Date().getTime() / 1000, 'dd');
    return {
      isLogin,
      songListData,
      djprogramData,
      individualizatData,
      weekText,
      dateText
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
