<template>
  <div class="djradio-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="dis-flex detail-top">
          <div class="cover-dj">
            <img :src="djradioDetail.picUrl" :alt="djradioDetail.name" />
          </div>
          <div class="cnt">
            <div class="hd dis-flex">
              <div class="icon"></div>
              <div class="tit">{{ djradioDetail.name }}</div>
            </div>
            <div class="user dis-flex align-center">
              <div class="face">
                <img :src="djradioDetail.dj?.avatarUrl" alt="头像" />
              </div>
              <div class="name">
                <span @click="jumpUserProfile(djradioDetail.dj?.userId)">
                  {{ djradioDetail.dj?.nickname }}
                </span>
              </div>
            </div>
            <div class="btns">
              <button type="button" class="btn subscribe">
                <i>订阅({{ djradioDetail.subCount }})</i>
              </button>
              <button type="button" class="btn play">
                <i>播放全部</i>
              </button>
              <button type="button" class="btn share" @click="handleShare">
                <i>分享({{ djradioDetail.shareCount }})</i>
              </button>
            </div>
            <div class="intr inline-block">
              <div class="cat">
                <span class="category">{{ djradioDetail.category }}</span>
                <pre class="f12 text-gray6" :class="{ 'ellipsis-lines-4': !toggleShow }">
                  {{ djradioDetail.desc }}
                </pre>
              </div>
              <div class="toggledesc pointer" @click="toggle">
                {{ !toggleShow ? '展开' : '收起' }}
                <i class="icon" :class="{ 'open-desc': !toggleShow }"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="song">
          <div class="title dis-flex justify-between align-center">
            <div class="lf dis-flex">
              <div class="f20">节目列表</div>
              <div class="f12 text-gray9 sub">共{{ programs.count }}期</div>
            </div>
            <div class="ri dis-flex">
              <div class="out">
                <i></i>
                <a class="ml5" :href="`https://music.163.com/#/outchain/4/${route.query.id}`">
                  生成外链播放器
                </a>
              </div>
              <div class="sort dis-flex align-center">
                <div
                  class="btn desc"
                  :class="{ 'btn-active': sort }"
                  title="降序"
                  @click="sortChange(true)"
                ></div>
                <div
                  class="btn asc"
                  :class="{ 'btn-active': !sort }"
                  title="升序"
                  @click="sortChange(false)"
                ></div>
              </div>
            </div>
          </div>
          <table class="list" cellpadding="0" cellspacing="0">
            <tr v-for="item in programs.list" :key="item.id">
              <td class="dis-flex justify-between align-center">
                <span>{{ item.serialNum }}</span>
                <i @click="playSingleSong(item.mainSong)"></i>
              </td>
              <td class="">
                <div class="name ellipsis">{{ item.name }}</div>
                <div class="ic dis-flex">
                  <i class="icon u-icn1" @click="singleSongToPlaylist(item.mainSong)"></i>
                  <i class="icon u-icn2"></i>
                  <i class="icon u-icn3"></i>
                </div>
              </td>
              <td>
                播放{{
                  item.listenerCount / 10000 > 10
                    ? (item.listenerCount / 10000).toFixed(0) + '万'
                    : item.listenerCount
                }}
              </td>
              <td>赞{{ item.likedCount }}</td>
              <td>
                {{ formatTimestamp(item.scheduledPublishTime, 'YYYY-MM-DD') }}
              </td>
              <td>{{ timeStampToDuration(item.duration / 1000) }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="detail-side">
        <DjradioSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatTimestamp, timeStampToDuration } from '@/utils/utils';
import { djDetail, djProgram } from '@/api/home-djprogram';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import DjradioSide from './djradio-side/DjradioSide.vue';

type DjradioDetail = {
  name?: string;
  category?: string;
  desc?: string;
  dj?: {
    userId: number;
    nickname: string;
    avatarUrl: string;
  };
  picUrl?: string;
  subCount?: number;
  shareCount?: number;
};

type Programs = {
  list: {
    id: number;
    name: string;
    mainSong: SongType;
    serialNum: number;
    listenerCount: number;
    likedCount: number;
    scheduledPublishTime: number;
    duration: number;
  }[];
  count: number;
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 展开/收缩简介
const toggleShow = ref(false);

function toggle(): void {
  toggleShow.value = !toggleShow.value;
}

// 获取电台详情
const djradioDetail = ref<DjradioDetail>({});

function getDjradioDetail(): void {
  djDetail({ rid: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      djradioDetail.value = res.data ?? {};
    })
    .catch(() => ({}));
}

// 获取电台节目列表
const sort = ref(true);
const programs = reactive<Programs>({
  list: [],
  count: 0
});

function getDjradioPrograms(): void {
  djProgram({ rid: Number(route.query.id), asc: sort.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      programs.list = res.programs ?? [];
      programs.count = res.count ?? 0;
    })
    .catch(() => ({}));
}

function sortChange(value: boolean): void {
  sort.value = value;
  getDjradioPrograms();
}

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(item: SongType): void {
  useSongAddPlaylist(item);
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpUserProfile(id: number | undefined): void {
  router.push({ path: '/user-profile', query: { id } });
}

watch(
  () => route.query.id,
  () => {
    getDjradioDetail();
    getDjradioPrograms();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import url('@/assets/style/base.less');
@import url('./djradio-detail.less');
</style>
