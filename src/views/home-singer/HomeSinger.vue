<template>
  <div class="home-singer">
    <div class="home-singer-container">
      <div class="home-singer-menu">
        <SingerMenu @menuSelete="menuSelete" />
      </div>
      <div class="home-singer-content">
        <SingerContent
          :title="singer.title"
          :sort="singer.sort"
          :main="singer.main"
          :second="singer.second"
          @screenChange="screenChange"
          @jumpSingerDetail="jumpSingerDetail"
          @jumpUserProfile="jumpUserProfile"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { topArtists, artistList } from '@/api/home-singer';
import type { ResponseType } from '@/types';
import SingerMenu from './singer-menu/SingerMenu.vue';
import SingerContent from './singer-content/SingerContent.vue';

const router = useRouter();
const store = useStore();

const singer = reactive({
  title: '热门歌手',
  sort: false,
  main: [],
  second: []
});

// 菜单选择
const params = reactive({
  area: -1,
  type: -1,
  initial: ''
});

function menuSelete(title: string, area: number, type: number) {
  singer.title = title;

  // 推荐歌手
  if (area === -8 && type === 1) {
    singer.title = '热门歌手';
    singer.sort = false;
    getTopArtists();
    return;
  }
  // 入驻歌手
  if (area === -8 && type === 2) {
    singer.sort = false;
    singer.main = [];
    singer.second = [];
    setMessage({ type: 'error', title: '入驻歌手暂无接口' });
    return;
  }

  singer.sort = true;
  params.area = area;
  params.type = type;
  getArtistList();
}

// 获取热门歌手
function getTopArtists(): void {
  topArtists({ offset: 0, limit: 100 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singer.main = res.artists?.slice?.(0, 10) ?? [];
      singer.second = res.artists?.slice?.(10) ?? [];
    })
    .catch(() => ({}));
}
getTopArtists();

// 字母选择
function screenChange(small: string): void {
  params.initial = small;
  getArtistList();
}

// 获取分类列表
function getArtistList(): void {
  artistList({ ...params })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singer.main = res.artists?.slice?.(0, 10) ?? [];
      singer.second = res.artists?.slice?.(10) ?? [];
    })
    .catch(() => ({}));
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

onMounted(() => {
  store.commit('setMenuIndex', 0);
});
</script>

<style lang="less">
@import url('./home-singer.less');
</style>
