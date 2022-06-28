<template>
  <i class="icon-doubt"></i>
  <div class="lyric" v-if="playMusicId">
    <div class="not-lyric" v-if="lyric.noData">
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

<script lang="ts">
import { defineComponent, reactive, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getLyric } from '@api/my-music';
import type { ResponseType } from '@/types/types';
import type { PlayLyrics } from '@store/music/state';

type Lyric = {
  noData: boolean;
  isScroll: boolean;
  list: PlayLyrics[];
  index: number;
};

export default defineComponent({
  name: 'LyricView',
  setup() {
    const $store = useStore();

    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 歌词数据
    const lyric = reactive<Lyric>({
      noData: false, // 无歌词
      isScroll: true, // 是否支持滚动
      list: [], // 列表
      index: 0 // 当前播放索引
    });

    // 初始化获取歌词
    const playLyrics = computed<PlayLyrics[]>(
      () => $store.getters['music/playLyrics']
    );
    onMounted(() => {
      // 当前播放id不存在
      if (!playMusicId.value) {
        return false;
      }
      // 重置播放索引
      lyric.index = 0;
      // 本地歌词存在
      if (Object.keys(playLyrics.value).length > 0) {
        lyric.list = playLyrics.value;
      }
      // 本地歌词不存在，获取歌词
      if (Object.keys(playLyrics.value).length <= 0) {
        getLyricData();
      }
    });

    // 播放id变化，重新获取歌词
    watch(
      () => playMusicId.value,
      () => {
        // 重置播放索引
        lyric.index = 0;
        getLyricData();
      },
      {
        immediate: true
      }
    );

    // 获取歌词
    function getLyricData() {
      getLyric({
        id: playMusicId.value
      })
        .then((res: ResponseType) => {
          lyric.noData = false;

          // 重置歌词滚动高度
          const lyricDom = document.querySelector('.lyric') as HTMLElement;
          lyricDom.scrollTo(0, 0);

          // 没有歌词
          if (res.nolyric) {
            // 清空歌词
            lyric.list = [];
            // 显示暂无歌词
            lyric.noData = true;
            // 清空存储歌词
            $store.commit('music/setLyrics', []);
            return false;
          }

          try {
            handlerLyric(res.lrc.lyric);
          } catch {
            lyric.noData = true;
          }
        })
        .catch(() => ({}));
    }

    // 处理歌词数据
    function handlerLyric(lyricStr: string): void {
      // 清空歌词
      lyric.list = [];
      // 重置滚动
      lyric.isScroll = true;

      const regNewLine = /\n/;
      // 每行歌词的数组
      const lineArr = lyricStr.split(regNewLine);
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;

      lineArr.forEach((item: string) => {
        if (item === '') return;
        const obj = {
          lyric: '',
          time: -1
        };
        const time = item.match(regTime);

        // 歌词不支持滚动
        if (!time) {
          lyric.isScroll = false;

          obj.lyric = item;
          obj.time = -1;
          lyric.list.push(obj);
          return false;
        }

        obj.lyric =
          item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
        obj.time = time
          ? formatLyricTime(time[0].slice(1, time[0].length - 1))
          : 0;
        lyric.list.push(obj);
      });
      // 歌词存储
      $store.commit('music/setLyrics', lyric.list);
    }

    // 格式化歌词的时间 转换成 sss:ms
    function formatLyricTime(time: any): number {
      const regMin = /.*:/;
      const regSec = /:.*\./;
      const regMs = /\./;

      const min = parseInt(time.match(regMin)[0].slice(0, 2));
      let sec = parseInt(time.match(regSec)[0].slice(1, 3));
      const ms = time.slice(
        time.match(regMs).index + 1,
        time.match(regMs).index + 3
      );

      if (min !== 0) {
        sec += min * 60;
      }

      return Number(sec + '.' + ms);
    }

    // 播放进度数据
    const musicPlayProgress = computed(
      () => $store.getters['music/musicPlayProgress']
    );

    // 监听播放时间，歌词滚动
    watch(
      () => musicPlayProgress.value.currentTime,
      () => {
        // 歌词未加载
        if (lyric.list.length === 0) {
          return false;
        }

        // 歌词不支持滚动
        if (!lyric.isScroll) {
          return false;
        }

        // 当前播放时间
        const currentTime = musicPlayProgress.value.currentTime;

        // 重新播放,回到顶部
        if (currentTime < 1) {
          lyric.index = 0;
          const lyricDom = document.querySelector('.lyric') as HTMLElement;
          lyricDom.scrollTo(0, 0);
        }

        // 获取当前播放索引
        lyric.list.forEach((item, index) => {
          // 大于当前时间
          const itemTime = Math.floor(item.time || 0);
          if (lyric.list[index + 1] && itemTime <= currentTime) {
            lyric.index = index;
          }

          // 最后一项
          if (!lyric.list[index + 1] && itemTime <= currentTime) {
            lyric.index = lyric.list.length - 1;
          }
        });
      }
    );

    // 监听播放索引更新
    watch(
      () => lyric.index,
      () => {
        // 歌词滚动
        roll();
      }
    );

    // 滚动函数
    function roll(): boolean | undefined {
      // 歌词未加载
      if (lyric.list.length === 0) {
        return false;
      }
      // 第五行歌词开始滚动
      if (lyric.index < 3) {
        return false;
      }
      scrollAnimation();
    }

    // 过渡动画函数
    function scrollAnimation(): boolean | undefined {
      const lyricDom = document.querySelector('.lyric') as HTMLElement;
      let timer = 0;
      // 定时器存在，清空定时器
      if (timer) {
        clearInterval(timer);
      }
      // 一行高度32，定时器执行70次(对应歌词颜色过渡时间0.7s)
      const once = 32 / 70;
      // 累计高度
      let total = 0;

      // 滚动到底部
      if (total >= lyricDom.scrollTop + lyricDom.offsetHeight) {
        return false;
      }

      timer = setInterval(() => {
        if (total >= 32) {
          clearInterval(timer);
          return false;
        }
        total += once;
        lyricDom.scrollTo(0, Number(32 * (lyric.index - 4)) + total);
      }, 10);
    }

    return {
      playMusicId,
      lyric
    };
  }
});
</script>

<style lang="less" scoped>
@import './lyric.less';
</style>
