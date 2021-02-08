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
      <!-- playMusic.name -->
      <div class="song-title">{{ '' }}</div>
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
            :class="{ 'active-item': item.id === curPlayMusicId }"
            @click="playlistItem(item.id)"
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
        <div class="content" ref="lyricUL">
          <ul class="list" :style="listStyle">
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

// 歌词动画需优化，不够完美
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
    const curPlayMusicId = computed<number>(
      () => $store.getters['music/curPlayMusicId']
    );

    // 当前播放音乐时间
    const musicPlayTime = computed<number>(
      () => $store.getters['music/musicPlayTime']
    );

    // 监听播放id更改,获取歌词
    watch(
      () => curPlayMusicId.value,
      () => {
        getLyricFun();
      }
    );

    // 获取歌词
    function getLyricFun() {
      getLyric({
        id: curPlayMusicId.value
      }).then((res: ResponseType) => {
        setLyricFun(res);
      });
    }

    const state: any = reactive({
      lyricsObjArr: [],
      lyricIndex: 0
    });

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

    const lyricUL = ref<HTMLElement>();
    // 获取所有li
    const liRef = ref<HTMLElement[]>([]);
    const getLiRef = (el: HTMLElement) => {
      if (state?.lyricsObjArr.length >= liRef.value.length) {
        liRef.value.push(el);
      }
    };

    // 匹配歌词
    /*
     * 动画思路： 获取ul一半高度，获取有active的li,距离顶部的offsetTop
     * ul一半高度一般减去一行歌词高度，超过ul一半高度，歌词开始滚动
     */
    function getWatch() {
      const ulRef = lyricUL.value as HTMLElement;
      const liArrRef = liRef.value as HTMLElement[];
      // ul已加载
      if (lyricUL.value?.clientHeight) {
        // 获取ul一半高度
        const ulHalfHeight = ulRef.clientHeight / 2;
        // 获取当前选中li的高度
        let liActiveHeight = 0;
        // 当个li高度
        let liClientHeight = 0;
        liArrRef.forEach(item => {
          liClientHeight = item.clientHeight;
          if (item.className === 'item active') {
            liActiveHeight = item.offsetTop;
          }
        });

        // 当前选中即将超过一半，开始滚动
        if (liActiveHeight > ulHalfHeight - liClientHeight) {
          for (let i = 0; i < state.lyricsObjArr.length; i++) {
            if (musicPlayTime.value > parseInt(state.lyricsObjArr[i].time)) {
              state.lyricIndex = i;
            }
          }
          listOffest.transform = liActiveHeight - liClientHeight * 2;
        } else {
          for (let i = 0; i < state.lyricsObjArr.length; i++) {
            if (musicPlayTime.value > parseInt(state.lyricsObjArr[i].time)) {
              state.lyricIndex = i;
            }
          }
        }
      }
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
    function playlistItem(id: number): void {
      // 当前播放音乐id
      $store.commit('music/setCurPlayMusicId', id);
    }

    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }

    return {
      playMusicList,
      curPlayMusicId,
      timeStampToDuration,
      ...toRefs(state),
      lyricUL,
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