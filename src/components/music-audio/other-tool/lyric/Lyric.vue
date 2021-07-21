<template>
  <i class="icon-doubt"></i>
  <div class="lyric">
    <ul class="lyric-list">
      <li
        class="item"
        v-for="(item, index) in lyric.list"
        :key="index"
        :class="{ 'active-item': index === lyric.index }"
      >
        {{ item.lyric }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getLyric } from '@api/my-music';
import { ResponseType } from '@/types/types';

type Lyric = {
  list: List[];
  index: number;
};

type List = {
  lyric: string;
  time: number;
};

export default defineComponent({
  setup() {
    const $store = useStore();

    // 当前播放音乐id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 歌词数据
    const lyric = reactive<Lyric>({
      list: [], // 列表
      index: 0 // 当前播放索引
    });

    // 初始化获取歌词
    const playLyrics = computed(() => $store.getters['music/playLyrics']);
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
      }
    );

    // 获取歌词
    function getLyricData() {
      getLyric({
        id: playMusicId.value
      }).then((res: ResponseType) => {
        handlerLyric(res.lrc.lyric);
      });
    }

    // 处理歌词数据
    function handlerLyric(lyricStr: string): void {
      // 清空歌词
      lyric.list = [];

      const regNewLine = /\n/;
      // 每行歌词的数组
      const lineArr = lyricStr.split(regNewLine);
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      lineArr.forEach((item: any) => {
        if (item === '') return;
        const obj = {
          lyric: '',
          time: -1
        };
        const time = item.match(regTime);
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
        // 当前播放时间
        const currentTime = Math.floor(musicPlayProgress.value.currentTime);
        // 获取当前播放索引
        lyric.list.forEach((item, index) => {
          // 大于最后一项
          if (index + 1 > lyric.list.length - 1) {
            return false;
          }
          // 大于当前时间，小于下一项时间
          const itemTime = Math.floor(item.time);
          if (
            itemTime <= currentTime &&
            currentTime < Math.floor(lyric.list[index + 1].time)
          ) {
            lyric.index = index;
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
    function roll() {
      // 歌词未加载
      if (lyric.list.length === 0) {
        return false;
      }
      // 第五行歌词开始滚动
      if (lyric.index < 3) {
        return false;
      }

      const lyricDom = document.querySelector('.lyric') as HTMLElement;
      lyricDom.scrollTo(0, Number(32 * (lyric.index - 3)));
      // scrollAnimation(Number(32 * lyric.index - 5), currentY);
    }

    // function scrollAnimation(currentY: any, targetY: any) {
    // console.log(currentY);
    // console.log(targetY);
    // const lyricDom = document.querySelector('.lyric') as HTMLElement;
    // // 获取当前位置方法
    // // 计算需要移动的距离
    // let needScrollTop = targetY - currentY;
    // let _currentY = currentY;
    // setTimeout(() => {
    //   // 一次调用滑动帧数，每次调用会不一样
    //   const dist = Math.ceil(needScrollTop / 10);
    //   _currentY += dist;
    //   lyricDom.scrollTo(_currentY, currentY);
    //   // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    //   if (needScrollTop > 10 || needScrollTop < -10) {
    //     scrollAnimation(_currentY, targetY);
    //   } else {
    //     lyricDom.scrollTo(_currentY, targetY);
    //   }
    // }, 1);
    // }

    return {
      lyric
    };
  }
});
</script>

<style lang="less" scoped>
@import './lyric.less';
</style>
