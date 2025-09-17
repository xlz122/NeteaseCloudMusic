<template>
  <div class="album-newest">
    <div class="warp">
      <div class="content">
        <ul class="list" ref="listRef" :style="listStyle">
          <li class="item" v-for="(item, index) in album" :key="index">
            <div class="item-img">
              <img
                class="img"
                :src="`${item.picUrl}?param=100y100`"
                @click="jumpAlbumDetail(item.id)"
                alt=""
              />
              <i class="icon" @click="albumToPlaylistPlay(item.id)"></i>
            </div>
            <div class="title" :title="item.name" @click="jumpAlbumDetail(item.id)">
              {{ item.name }}
            </div>
            <div class="name-list">
              <template v-for="(i, ind) in item.artists" :key="ind">
                <span class="name" :title="i.name" @click="jumpSingerDetail(i.id)">
                  {{ i.name }}
                </span>
                <span class="line" v-if="item.artists && ind !== item.artists?.length - 1">
                  /
                </span>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <button class="btn left-btn" @click="albumPrev"></button>
      <button class="btn right-btn" @click="albumNext"></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { throttle } from '@/utils/utils';
import { albumNewest } from '@/api/home';
import type { ResponseType } from '@/types';

type AlbumItem = {
  id: number;
  name: string;
  picUrl: string;
  artists: {
    id: number;
    name: string;
  }[];
};

const emits = defineEmits(['albumToPlaylistPlay', 'jumpAlbumDetail', 'jumpSingerDetail']);

// 获取专辑
const album = ref<AlbumItem[]>([]);

function getAlbumNewest(): void {
  albumNewest()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      // 替换前五项和后五项位置
      const first = res.albums?.slice?.(0, 5);
      const last = res.albums?.slice?.(5, 10);
      album.value = [...last, ...first];
      // 复制为二倍模板
      album.value.unshift(...album.value);
    })
    .catch(() => ({}));
}
getAlbumNewest();

// 列表偏移、样式
const listOffest = reactive({
  index: 0,
  transform: 0,
  duration: 0
});

const listStyle = computed(() => {
  return {
    transform: `translate3d(-${listOffest.transform}px, 0, 0)`,
    transition: `${listOffest.duration}s`
  };
});

const listRef = ref<HTMLElement>();

// 上一轮
const albumPrev = throttle(function () {
  const ul = listRef.value as HTMLElement;
  const li = ul.children[0];

  if (listOffest.index === 0) {
    // 返回二倍模板
    listOffest.index = 2;
    listOffest.duration = 0;

    setTimeout(() => {
      listOffest.index--;
      listOffest.duration = 1.2;
      listOffest.transform = li.clientWidth * listOffest.index * 5;
    });
  } else {
    listOffest.index--;
    listOffest.duration = 1.2;
  }

  listOffest.transform = li.clientWidth * listOffest.index * 5;
}, 1200);

// 下一轮
const albumNext = throttle(function () {
  const ul = listRef.value as HTMLElement;
  const li = ul.children[0];

  // 返回二倍模板
  if (listOffest.index === 2) {
    listOffest.index = 0;
    listOffest.duration = 0;

    setTimeout(() => {
      listOffest.index++;
      listOffest.duration = 1.2;
      listOffest.transform = li.clientWidth * listOffest.index * 5;
    });
  } else {
    listOffest.index++;
    listOffest.duration = 1.2;
  }

  listOffest.transform = li.clientWidth * listOffest.index * 5;
}, 1200);

// 专辑添加到播放列表并播放
function albumToPlaylistPlay(id: number): void {
  emits('albumToPlaylistPlay', id);
}

function jumpAlbumDetail(id: number): void {
  emits('jumpAlbumDetail', id);
}

function jumpSingerDetail(id: number): void {
  emits('jumpSingerDetail', id);
}
</script>

<style lang="less" scoped>
@import url('./album-newest.less');
</style>
