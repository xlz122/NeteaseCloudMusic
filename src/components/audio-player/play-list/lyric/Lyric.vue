<template>
  <i class="icon-doubt"></i>
  <div class="lyric" v-if="playSongId">
    <div class="not-lyric" v-if="lyric.nolyric">
      <span>暂时没有歌词</span>
      <span class="feed-lyric">求歌词</span>
    </div>
    <ul class="lyric-list">
      <!-- 可滚动 -->
      <template v-if="lyric.isScroll">
        <li
          class="item"
          v-for="(item, index) in lyric.list"
          :key="index"
          :class="{ 'active-item': index === lyric.index }"
        >
          {{ item.lyric }}
        </li>
      </template>
      <!-- 不可滚动 -->
      <template v-else>
        <li class="item">
          *该歌词不支持自动滚动*
          <span class="text">求滚动歌词</span>
        </li>
        <li class="item" v-for="(item, index) in lyric.list" :key="index">
          {{ item.lyric }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { getLyric } from '@/api/my-music';
import type { ResponseType } from '@/types';

type Lyric = {
  nolyric: boolean;
  isScroll: boolean;
  index: number;
  list: {
    lyric: string;
    time: number;
  }[];
};

type PlayProgress = {
  value?: {
    currentTime: number;
  };
};

const store = useStore();
const playSongId = computed(() => store.getters['music/playSongId']);

// 获取歌词
const lyric = reactive<Lyric>({
  nolyric: false, // 无歌词
  isScroll: true, // 是否支持滚动
  index: 0, // 播放索引
  list: []
});

watch(
  () => playSongId.value,
  () => {
    lyric.nolyric = false;
    lyric.isScroll = true;
    lyric.index = 0;
    lyric.list = [];

    getLyricData();
  },
  { immediate: true }
);

function getLyricData(): void {
  getLyric({ id: playSongId.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      // 无歌词
      if (res.nolyric) {
        lyric.nolyric = true;
        lyric.list = [];
        return;
      }

      // 重置滚动高度
      const lyricElement = document.querySelector('.lyric') as HTMLElement;
      lyricElement.scrollTo(0, 0);

      handlerLyricFormat(res.lrc.lyric);
    })
    .catch(() => ({}));
}

// 处理歌词格式
function handlerLyricFormat(lyricStr: string): void {
  const regLine = /\n/;
  const lyricStrList: string[] = lyricStr.split(regLine);

  const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;

  lyricStrList.forEach?.((item) => {
    if (item === '') {
      return;
    }

    // 歌词不支持滚动
    if (!lyricStrList[0].match(regTime)) {
      lyric.isScroll = false;
    }
    if (!lyric.isScroll) {
      lyric.list.push({
        lyric: item,
        time: -1
      });
      return;
    }

    const obj = {
      lyric: '',
      time: -1
    };
    const time = item.match(regTime);

    obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
    obj.time = time ? lyricTimeFormat(time[0].slice(1, time[0].length - 1)) : 0;

    lyric.list.push(obj);
  });
}

// 处理歌词时间格式, 转换成 s.ms
function lyricTimeFormat(time: string): number {
  const regMin = /.*:/;
  const regSec = /:.*\./;
  const regMs = /\./;

  // 分
  let min = '';
  const rMin = time.match(regMin);
  if (rMin instanceof Array) {
    min = rMin[0].slice(0, 2);
  }
  // 秒
  let second = '';
  const rSec = time.match(regSec);
  if (rSec instanceof Array) {
    second = rSec[0].slice(1, 3);
  }
  // 毫秒
  let ms = '';
  const rMs = time.match(regMs);
  if (rMs?.index) {
    ms = time.slice(rMs.index + 1, rMs.index + 3);
  }

  // 分 + 秒
  if (min && parseInt(min) !== 0) {
    second = (parseInt(min) * 60 + parseInt(second)).toString();
  }

  return Number(second + '.' + ms);
}

// 更新播放索引
const playProgress: PlayProgress = inject('playProgress') ?? {};

watch(
  () => playProgress.value,
  () => {
    if (lyric.list.length === 0) {
      return;
    }

    // 歌词不支持滚动
    if (!lyric.isScroll) {
      return;
    }

    const currentTime = playProgress.value?.currentTime ?? 0;

    // 重新播放, 回到顶部
    if (currentTime < 1) {
      lyric.index = 0;
      const lyricElement = document.querySelector('.lyric') as HTMLElement;
      lyricElement.scrollTo(0, 0);
    }

    // 获取当前播放索引
    lyric.list.forEach?.((item, index) => {
      const itemTime = Math.floor(item.time ?? 0);
      if (lyric.list[index + 1] && itemTime <= currentTime) {
        lyric.index = index;
      }

      if (!lyric.list[index + 1] && itemTime <= currentTime) {
        lyric.index = lyric.list?.length - 1;
      }
    });
  },
  { deep: true }
);

// 歌词滚动
const timer = ref<number | null>(null);

watch(
  () => lyric.index,
  () => {
    if (lyric.list.length === 0) {
      return;
    }
    // 第几行歌词开始滚动
    if (lyric.index < 3) {
      return;
    }

    // 动画执行前清除定时器, 解决歌词抖动
    timer.value && clearInterval(timer.value);

    scrollAnimation();
  }
);

// 动画过渡函数
function scrollAnimation(): void {
  const lyricElement = document.querySelector('.lyric') as HTMLElement;

  // 歌词行高度
  const lineHeight = 32;
  // 动画执行次数
  const executions = 70;
  // 当前高度
  let currentHeight = 0;

  timer.value = setInterval(() => {
    if (currentHeight >= lineHeight) {
      timer.value && clearInterval(timer.value);
      return;
    }

    currentHeight += lineHeight / executions;

    // 滚动高度 - 高亮歌词距离顶部高度
    const scrollTop = lineHeight * lyric.index + currentHeight;
    const higHeight = lineHeight * 3.5;

    lyricElement.scrollTo(0, scrollTop - higHeight);
  }, 10);
}
</script>

<style lang="less" scoped>
@import url('./lyric.less');
</style>
