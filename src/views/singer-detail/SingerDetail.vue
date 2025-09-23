<template>
  <div class="singer-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="singer-info">
          <h2
            class="singer-username"
            :title="`${singerDetail.artist?.name} - ${singerDetail.artist?.englishName}`"
          >
            {{ singerDetail.artist?.name }}
          </h2>
          <h3
            :title="`${singerDetail.artist?.name} - ${singerDetail.artist?.englishName}`"
            class="singer-english-name"
          >
            {{ singerDetail.artist?.englishName }}
          </h3>
          <img
            v-if="singerDetail.artist?.cover"
            class="singer-avatar"
            :src="`${singerDetail.artist?.cover}?param=640y300`"
            alt=""
          />
          <img v-else class="singer-avatar" src="" alt="" />
          <i
            class="artist-home"
            v-if="singerDetail.user"
            @click="jumpUserProfile(singerDetail.user?.userId)"
          ></i>
          <template v-if="singerDetail.user?.followed">
            <i class="artist-sub collected" @click="setArtistSub(singerDetail.user?.followed)"></i>
          </template>
          <template v-if="!singerDetail.user?.followed">
            <i class="artist-sub" @click="setArtistSub(singerDetail.user?.followed)"></i>
          </template>
        </div>
        <ul class="singer-tabs">
          <li
            class="item"
            v-for="(item, index) in singerTabs"
            :key="index"
            :class="[{ 'first-item': index === 0 }, { 'active-item': index === singerTabIndex }]"
            @click="tabChange(index)"
          >
            <span class="text">{{ item.title }}</span>
          </li>
        </ul>
        <template v-if="singerTabIndex === 0">
          <SingerSong :singerDetail="singerDetail" />
        </template>
        <template v-if="singerTabIndex === 1">
          <SingerAlbum :singerDetail="singerDetail" />
        </template>
        <template v-if="singerTabIndex === 2">
          <SingerMv :singerDetail="singerDetail" />
        </template>
        <template v-if="singerTabIndex === 3">
          <SingerIntroduce :singerDetail="singerDetail" />
        </template>
      </div>
      <div class="detail-side">
        <SingerSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { artistDetail, artistSub } from '@/api/singer-detail';
import type { ResponseType } from '@/types';
import SingerSide from './singer-side/SingerSide.vue';
import SingerSong from './singer-song/SingerSong.vue';
import SingerAlbum from './singer-album/SingerAlbum.vue';
import SingerMv from './singer-mv/SingerMv.vue';
import SingerIntroduce from './singer-introduce/SingerIntroduce.vue';

type SingerDetail = {
  artist?: {
    name?: string;
    englishName?: string;
    cover?: string;
  };
  user?: {
    userId: number;
    followed: boolean;
  };
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const singerTabIndex = computed(() => store.getters.singerTabIndex);

// 获取歌手详情
const singerDetail = ref<SingerDetail>({});

function getSingerDetail(): void {
  artistDetail({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      // 处理英文名
      const briefDesc = res.data?.artist?.briefDesc ?? '';
      if (briefDesc.indexOf('（') && briefDesc.indexOf('）')) {
        res.data.artist.englishName = briefDesc.substring(
          briefDesc.indexOf('（') + 1,
          briefDesc.indexOf('）')
        );
      }

      singerDetail.value = res.data ?? {};
    })
    .catch(() => ({}));
}

// 收藏/取消收藏歌手
function setArtistSub(followed?: boolean): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  const t = followed ? 2 : 1;

  artistSub({ id: Number(route.query.id), t })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: res?.message });
        return;
      }

      if (t === 1) {
        Object.assign(singerDetail.value, {
          ...singerDetail.value.user,
          followed: true
        });
        setMessage({ type: 'info', title: '收藏成功' });
      }

      if (t === 2) {
        Object.assign(singerDetail.value, {
          ...singerDetail.value.user,
          followed: false
        });
        setMessage({ type: 'info', title: '取消收藏成功' });
      }
    })
    .catch(() => ({}));
}

const singerTabs = reactive([
  {
    title: '热门作品',
    component: 'SingerSong'
  },
  {
    title: '所有专辑',
    component: 'SingerAlbum'
  },
  {
    title: '相似MV',
    component: 'SingerMv'
  },
  {
    title: '艺人介绍',
    component: 'SingerIntroduce'
  }
]);

function tabChange(index: number): void {
  store.commit('setSingerTabIndex', index);
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

watch(
  () => route.query.id,
  () => {
    getSingerDetail();
  },
  { immediate: true }
);

onMounted(() => {
  store.commit('setMenuIndex', 0);
  store.commit('setSubMenuIndex', -1);
  store.commit('setSingerTabIndex', 0);
});
</script>

<style lang="less" scoped>
@import url('./singer-detail.less');
</style>
