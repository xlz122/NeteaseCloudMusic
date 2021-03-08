<template>
  <div class="play-list" v-if="playListShow">
    <!-- 头部部分 -->
    <div class="play-list-title">
      <h4 class="title">播放列表({{ playMusicList.length }})</h4>
      <div class="add-all">
        <i class="icon"></i>
        <span>收藏全部</span>
      </div>
      <span class="line"></span>
      <div class="clear-all" @click="emptyMusicList">
        <i class="icon"></i>
        <span>清除</span>
      </div>
      <div class="song-title">{{ playMusicItem.name }}</div>
      <i class="clear-icon" @click="closePlayList"></i>
    </div>
    <!-- 内容部分 -->
    <div class="play-list-content">
      <div class="left-content">
        <ul class="list" v-if="playMusicList.length > 0">
          <li
            class="item"
            v-for="(item, index) in playMusicList"
            :key="index"
            :class="{ 'active-item': item.id === playMusicId }"
            @click="playlistItem(item.id, item)"
          >
            <i class="play-icon"></i>
            <span class="text song-title">{{ item.name }}</span>
            <div class="operate-btn">
              <i class="icon collect"></i>
              <i class="icon share"></i>
              <i class="icon download"></i>
              <i
                class="icon delete"
                @click="deleteMusicList(item.id, $event)"
              ></i>
            </div>
            <span class="text name">
              <span v-for="(i, ind) in item?.ar" :key="ind">
                {{ i.name }}
                <span v-if="ind !== item.ar.length - 1"> / </span>
              </span>
            </span>
            <span class="text time">
              {{ timeStampToDuration(item.dt / 1000) }}
            </span>
            <i class="share"></i>
          </li>
        </ul>
        <!-- 列表空时展示 -->
        <div class="no-list-data" v-else>
          <div class="title">
            <i class="icon"></i>
            <span class="text">你还没有添加任何歌曲</span>
          </div>
          <p class="desc">
            <span>去首页</span>
            <span class="link">发现音乐</span>
            <span>，或在</span>
            <span class="link">我的音乐</span>
            <span>收听自己收藏得歌单</span>
          </p>
        </div>
      </div>
      <i class="line" v-if="playMusicList.length === 0"></i>
      <div class="right-content">
        <i class="icon-doubt"></i>
        <div class="content" ref="lyricContentRef">
          <ul class="list" :style="listStyle" ref="lyricUlRef">
            <li
              class="item"
              :ref="getLiRef"
              :class="{ active: lyricIndex === index }"
              v-for="(item, index) in lyricsObjArr"
              :data-time="item.time"
              :key="item.uid"
            >
              {{ item.lyric }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getLyric } from '@api/my-music';
import { defineComponent, reactive, ref, toRefs, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils';
import { ResponseType } from '@/types/types';
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
  setup(props, { emit }) {
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
    const playMusicItem = computed<number>(
      () => $store.getters['music/playMusicItem']
    );

    // 当前播放音乐时间
    const musicPlayTime = computed<number>(
      () => $store.getters['music/musicPlayTime']
    );

    // 监听播放列表,获取歌词
    watch(
      () => playMusicList.value,
      () => {
        // 播放列表长度大于0
        if (playMusicList.value.length > 0) {
          getLyricFun();
        }
      }
    );

    // 获取歌词
    function getLyricFun() {
      getLyric({
        id: playMusicId.value
      }).then((res: ResponseType) => {
        console.log(res);
        setLyricFun(res);
      });
    }

    const state: any = reactive({
      lyricsObjArr: [],
      lyricIndex: 0
    });

    // 初始化获取本地歌词
    const playLyrics = computed(() => $store.getters['music/playLyrics']);
    watch(
      () => playLyrics.value,
      () => {
        state.lyricsObjArr = playLyrics.value;
      },
      {
        immediate: true
      }
    );

    // 格式化歌词
    function setLyricFun(res: any) {
      state.lyricsObjArr = [];
      const regNewLine = /\n/;
      const lineArr = res.lrc.lyric.split(regNewLine); // 每行歌词的数组
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
        if (obj.lyric === '') {
          console.log('这一行没有歌词');
        } else {
          state.lyricsObjArr.push(obj);
        }
      });
      // 歌词存储
      $store.commit('music/setLyrics', state.lyricsObjArr);
    }

    // 格式化歌词的时间 转换成 sss:ms
    function formatLyricTime(time: any) {
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

    // 监听歌曲时间,歌曲滚动
    watch(
      () => musicPlayTime.value,
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
    // 歌词ul
    const lyricUlRef = ref<HTMLElement>();
    // 获取所有li
    const liRef = ref<HTMLElement[]>([]);
    const getLiRef = (el: HTMLElement) => {
      if (state?.lyricsObjArr.length !== liRef.value.length) {
        liRef.value.push(el);
      }
    };

    // 匹配歌词
    function getWatch(): boolean | undefined {
      const contentRef = lyricContentRef.value as HTMLElement;
      // const ulRef = lyricUlRef.value as HTMLElement;
      const liArrRef = liRef.value as HTMLElement[];
      // ul未加载
      if (!contentRef?.clientHeight) {
        return false;
      }
      // li未加载完成
      if (liArrRef.length !== state?.lyricsObjArr.length) {
        return false;
      }
      // // 动态设置ul高度
      // ulRef.style.height = ulRef.clientHeight + 'px';
      // // 获取容器一半高度
      // const contentHalfHeight = contentRef.clientHeight / 2;
      // // 单个li高度
      // let liClientHeight = 0;
      // // 获取当前选中li距离顶部高度
      // let liActiveHeight = 0;
      // liArrRef.forEach(item => {
      //   liClientHeight = item.clientHeight;
      //   if (item.className === 'item active') {
      //     liActiveHeight = item.offsetTop;
      //   }
      // });
      // // 当前选中即将超过一半少一行，开始滚动
      // if (liActiveHeight > contentHalfHeight - liClientHeight) {
      //   for (let i = 0; i < state.lyricsObjArr.length; i++) {
      //     if (musicPlayTime.value > parseInt(state.lyricsObjArr[i].time)) {
      //       state.lyricIndex = i;
      //     }
      //   }
      //   // 设置列表滚动
      //   listOffest.transform = liActiveHeight - liClientHeight * 3;
      //   // 设置滚动条
      //   // // 获取对应比例
      //   // const scale = (liActiveHeight - liClientHeight) / ulRef.clientHeight;
      //   // console.log(scale);
      //   // contentRef.scrollTop = contentRef.clientHeight * scale;
      //   // console.log(contentRef.clientHeight * scale);
      // } else {
      //   for (let i = 0; i < state.lyricsObjArr.length; i++) {
      //     if (musicPlayTime.value > parseInt(state.lyricsObjArr[i].time)) {
      //       state.lyricIndex = i;
      //     }
      //   }
      // }
    }

    // 清除列表
    function emptyMusicList(): void {
      $store.commit('music/emptyPlayMusicList');
    }

    // 列表项删除
    function deleteMusicList(id: number, event: MouseEvent): void {
      event.stopPropagation();
      $store.commit('music/deletePlayMusicList', id);
    }

    // 列表项点击
    function playlistItem(id: number, item: unknown): void {
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }
    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }
    return {
      playMusicList,
      playMusicId,
      playMusicItem,
      timeStampToDuration,
      ...toRefs(state),
      lyricContentRef,
      lyricUlRef,
      getLiRef,
      listStyle,
      emptyMusicList,
      deleteMusicList,
      playlistItem,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
