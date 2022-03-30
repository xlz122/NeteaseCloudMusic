<template>
  <div class="content">
    <div class="group">
      <div class="list-title">
        <span class="title" @click="songSheetMore">热门推荐</span>
        <ul class="tab">
          <li class="item first-item" @click="jumpSongSheet('华语')">华语</li>
          <li class="item" @click="jumpSongSheet('流行')">流行</li>
          <li class="item" @click="jumpSongSheet('摇滚')">摇滚</li>
          <li class="item" @click="jumpSongSheet('民谣')">民谣</li>
          <li class="item last-item" @click="jumpSongSheet('电子')">电子</li>
        </ul>
        <span class="more" @click="songSheetMore">更多</span>
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
            <img
              class="img"
              :src="`${item.picUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item?.name"
            @click="jumpSongSheetDetail(item.id)"
          >
            {{ item?.name }}
          </div>
        </li>
        <!-- 登录后展示个性化推荐 -->
        <template v-if="isLogin">
          <li
            class="item"
            v-for="(item, index) in individualizatSongSheet"
            :key="index"
            :class="{ 'last-item': index === 1 }"
          >
            <div class="item-top">
              <img
                class="img"
                :src="`${item.picUrl}?param=140y140`"
                alt=""
                @click="jumpSongSheetDetail(item.id)"
              />
              <div class="info">
                <i class="info-icon"></i>
                <span class="num">{{ item?.playcount }}</span>
                <i class="info-icon-right"></i>
              </div>
            </div>
            <div
              class="item-bottom"
              :title="item?.name"
              @click="jumpSongSheetDetail(item.id)"
            >
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
            <img
              class="img"
              :src="`${item.picUrl}?param=140y140`"
              alt=""
              @click="jumpDjprogramDetail(item.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.program?.adjustedPlayCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item.name"
            @click="jumpDjprogramDetail(item.id)"
          >
            <span class="radio-station"></span>
            {{ item?.name }}
          </div>
        </li>
      </ul>
    </div>
    <!-- 个性化推荐 -->
    <div class="group" v-if="isLogin">
      <div class="list-title">
        <span class="title individualization-title">个性化推荐</span>
      </div>
      <ul class="list-content">
        <li class="item individualization">
          <div class="item-top" @click="jumpRecommend">
            <i class="img"></i>
            <span class="head">{{ weekText }}</span>
            <span class="head-text">{{ dateText }}</span>
            <span class="mask"></span>
          </div>
          <div class="item-bottom" title="每日歌曲推荐" @click="jumpRecommend">
            每日歌曲推荐
          </div>
          <em class="item-like" title="根据你的口味生成,每天6:00更新">
            根据你的口味生成,每天6:00更新
          </em>
        </li>
        <li
          class="item individualization"
          v-for="(item, index) in individualizatData?.slice(0, 3)"
          :key="index"
          :class="{
            'last-item': index === individualizatData?.slice(0, 3).length - 1
          }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item.picUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playcount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item?.name"
            @click="jumpSongSheetDetail(item.id)"
          >
            {{ item?.name }}
          </div>
          <div class="like-text">
            <em class="item-like">{{ item?.copywriter }}</em>
            <button
              class="disable-like"
              :title="item?.copywriter"
              @click="uninterested(index)"
            >
              不感兴趣
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title" @click="albumNewestMore">新碟上架</span>
        <span class="more" @click="albumNewestMore">更多</span>
      </div>
      <album-newest
        @jumpAlbumDetail="jumpAlbumDetail"
        @jumpSingerDetail="jumpSingerDetail"
      />
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title" @click="songListMore">榜单</span>
        <span class="more" @click="songListMore">更多</span>
      </div>
      <song-list />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineAsyncComponent,
  defineComponent,
  ref,
  computed,
  watch
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// 新碟上架
const AlbumNewest = defineAsyncComponent(
  () => import('./album-newest/AlbumNewest.vue')
);
// 榜单
const SongList = defineAsyncComponent(() => import('./song-list/SongList.vue'));
import {
  recommendSongList,
  recommendDjprogram,
  recommendResource
} from '@api/home';
import { LoopType, ResponseType } from '@/types/types';
import { getWeekDate, formatDateTime, bigNumberTransform } from '@utils/utils';

export default defineComponent({
  name: 'HomeContent',
  components: {
    AlbumNewest,
    SongList
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);

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

    // 热门推荐 - 跳转歌单
    function jumpSongSheet(name: string): void {
      $router.push({ name: 'home-song-sheet', params: { name } });
    }

    // 热门推荐 - 跳转更多歌单
    function songSheetMore(): void {
      $router.push({ name: 'home-song-sheet' });
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

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
      recommendSongList({ limit })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            res?.result.forEach((item: LoopType) => {
              item.playCount = bigNumberTransform(item?.playCount);
            });
            songListData.value = res?.result;
          }
        })
        .catch(() => ({}));
    }
    getSongList();

    // 跳转电台节目详情
    function jumpDjprogramDetail(id: number): void {
      $router.push({ name: 'djprogram-detail', params: { djprogramId: id } });
    }

    // 获取热门推荐 - 推荐电台数据
    const djprogramData = ref<unknown[]>([]);
    function getDjprogram() {
      recommendDjprogram()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            res?.result.forEach((item: LoopType) => {
              item.program.adjustedPlayCount = bigNumberTransform(
                item?.program?.adjustedPlayCount
              );
            });
            // 截取前三项
            djprogramData.value = res?.result.slice(0, 3);
          }
        })
        .catch(() => ({}));
    }
    getDjprogram();

    const individualizatSongSheet = ref<unknown[]>([]);
    const individualizatData = ref<unknown[]>([]);
    // 获取个性化推荐歌单数据
    function getIndividualizat(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      recommendResource()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            res?.recommend.forEach((item: LoopType) => {
              item.playcount = bigNumberTransform(item.playcount);
            });
            // 截取前三项
            individualizatSongSheet.value = JSON.parse(
              JSON.stringify(res?.recommend.slice(0, 3))
            );
            individualizatData.value = JSON.parse(
              JSON.stringify(res?.recommend)
            );
          }
        })
        .catch(() => ({}));
    }
    getIndividualizat();

    // 获取当前星期几
    const weekText = ref<string>('');
    weekText.value = getWeekDate();

    // 获取当前日期
    const dateText = ref<string>('');
    dateText.value = formatDateTime(new Date().getTime() / 1000, 'dd').replace(
      /\b(0+)/gi,
      ''
    );

    // 个性化推荐 - 跳转每日推荐
    function jumpRecommend(): void {
      $router.push({ name: 'home-recommend' });
    }

    // 个性化推荐 - 不感兴趣
    function uninterested(index: number): boolean | undefined {
      if (individualizatData.value.length <= 3) {
        $store.commit('setMessage', {
          type: 'info',
          title: '暂无更多推荐'
        });
        return false;
      }

      individualizatData.value.splice(index, 1, individualizatData.value[3]);
      individualizatData.value.splice(3, 1);
    }

    // 新碟上架 - 跳转专辑
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 新碟上架 - 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 新碟上架 - 更多
    function albumNewestMore(): void {
      $router.push({ name: 'home-new-disc' });
    }

    // 榜单 - 更多
    function songListMore(): void {
      $router.push({ name: 'home-toplist' });
    }

    return {
      isLogin,
      jumpSongSheet,
      songSheetMore,
      jumpSongSheetDetail,
      songListData,
      jumpDjprogramDetail,
      djprogramData,
      individualizatSongSheet,
      individualizatData,
      weekText,
      dateText,
      jumpRecommend,
      uninterested,
      jumpAlbumDetail,
      jumpSingerDetail,
      albumNewestMore,
      songListMore
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
