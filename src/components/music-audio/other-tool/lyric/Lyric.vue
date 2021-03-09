<template>
  <i class="icon-doubt"></i>
  <div class="content" ref="lyricContentRef">
    <ul class="list" :style="listStyle" ref="lyricUlRef">
      <li
        class="item"
        :ref="getlyricLiRef"
        :class="{ active: lyricIndex === index }"
        v-for="(item, index) in lyricsArr"
        :data-time="item.time"
        :key="item.uid"
      >
        {{ item.lyric }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
  computed,
  onMounted
} from 'vue';
import { useStore } from 'vuex';
import { getLyric } from '@api/my-music';
import { ResponseType } from '@/types/types';
import { timeStampToDuration } from '@utils/utils';

interface ListOffest {
  transform: number;
  duration: number;
}

// 歌词动画需优化
// 歌词容器高度需调整
// 歌曲播放完，滚动条bug
export default defineComponent({
  props: ({
    playListShow: {
      type: Boolean,
      default: false
    }
  } as unknown) as undefined,
  setup() {
    const $store = useStore();

    // 播放列表数据
    const playMusicList = computed<unknown[]>(
      () => $store.getters['music/playMusicList']
    );

    // 当前播放音乐id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 当前播放音乐数据
    const playMusicItem = computed(() => $store.getters['music/playMusicItem']);

    const state: any = reactive({
      lyricsArr: [], // 歌词数组
      lyricIndex: 0
    });

    // 初始化获取歌词
    const playLyrics = computed(() => $store.getters['music/playLyrics']);
    onMounted(() => {
      // 播放列表没有歌曲
      if (playMusicList.value.length === 0) {
        return false;
      }
      // 本地歌词存在
      if (Object.keys(playLyrics.value).length > 0) {
        state.lyricsArr = playLyrics.value;
      }
      // 本地歌词不存在，获取歌词
      if (Object.keys(playLyrics.value).length <= 0) {
        getLyricFun();
      }
    });

    // 播放id变化，重新获取歌词
    watch(
      () => playMusicId.value,
      () => {
        getLyricFun();
      }
    );

    // 获取歌词
    function getLyricFun() {
      getLyric({
        id: playMusicId.value
      }).then((res: ResponseType) => {
        console.log(res);
        setLyricFun(res.lrc.lyric);
      });
    }

    // 格式化歌词
    function setLyricFun(lyric: string): void {
      state.lyricsArr = [];
      const regNewLine = /\n/;
      const lineArr = lyric.split(regNewLine); // 每行歌词的数组
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      lineArr.forEach((item: any) => {
        if (item === '') return;
        const obj = {
          lyric: '',
          time: 0,
          uid: ''
        };
        const time = item.match(regTime);
        obj.lyric =
          item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
        obj.time = time
          ? formatLyricTime(time[0].slice(1, time[0].length - 1))
          : 0;
        obj.uid = Math.random()
          .toString()
          .slice(-6);
        state.lyricsArr.push(obj);
      });
      // 歌词存储
      $store.commit('music/setLyrics', state.lyricsArr);
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
        getWatch();
      }
    );

    // 列表偏移样式
    const listOffest = reactive<ListOffest>({
      transform: 0,
      duration: 0.7
    });

    const listStyle = computed(() => {
      return {
        transform: `translate3d(0, -${listOffest.transform}px, 0)`,
        transition: `all ${listOffest.duration}s linear`
      };
    });

    // 歌词容器
    const lyricContentRef = ref<HTMLElement>();
    // 歌词列表容器
    const lyricUlRef = ref<HTMLElement>();
    // 歌词列表li
    const lyricLiRef = ref<HTMLElement[]>([]);
    const getlyricLiRef = (el: HTMLElement) => {
      if (state?.lyricsArr.length !== lyricLiRef.value.length) {
        lyricLiRef.value.push(el);
      }
    };

    // 匹配歌词
    function getWatch(): boolean | undefined {
      const contentRef = lyricContentRef.value as HTMLElement;
      const ulRef = lyricUlRef.value as HTMLElement;
      const liRef = lyricLiRef.value as HTMLElement[];
      // 歌词容器未加载
      if (!contentRef?.clientHeight) {
        return false;
      }
      // 歌词列表容器未加载
      if (!ulRef?.clientHeight) {
        return false;
      }
      // 歌词列表li未加载完成
      if (liRef.length !== state?.lyricsArr.length) {
        return false;
      }
      // 动态设置ul高度
      ulRef.style.height = ulRef.clientHeight + 'px';
      // 获取容器一半高度
      const contentHalfHeight = contentRef.clientHeight / 2;
      // 单个li高度
      let liClientHeight = 0;
      // 获取当前选中li距离顶部高度
      let liActiveHeight = 0;
      liRef.forEach(item => {
        liClientHeight = item.clientHeight;
        if (item.className === 'item active') {
          liActiveHeight = item.offsetTop;
        }
      });

      // 当前播放时间
      const currentTime = musicPlayProgress.value.currentTime;
      // 当前选中即将超过一半少一行，开始滚动
      if (liActiveHeight > contentHalfHeight - liClientHeight) {
        for (let i = 0; i < state.lyricsArr.length; i++) {
          if (currentTime > parseInt(state.lyricsArr[i].time)) {
            state.lyricIndex = i;
          }
        }
        // 设置列表滚动
        listOffest.transform = liActiveHeight - liClientHeight * 3;
        // 设置滚动条
        // 获取对应比例
        const scale =
          musicPlayProgress.value.progress / contentRef.clientHeight;
        console.log(musicPlayProgress.value.progress);
        console.log(contentRef.clientHeight);
        console.log(scale);
        console.dir(contentRef);
        // contentRef.scrollTop = scale * 1000;
      } else {
        for (let i = 0; i < state.lyricsArr.length; i++) {
          if (currentTime > parseInt(state.lyricsArr[i].time)) {
            state.lyricIndex = i;
          }
        }
      }
    }

    return {
      playMusicList,
      playMusicId,
      playMusicItem,
      timeStampToDuration,
      ...toRefs(state),
      lyricContentRef,
      lyricUlRef,
      getlyricLiRef,
      listStyle
    };
  }
});
</script>

<style lang="less" scoped>
@import './lyric.less';
</style>
