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
      <div class="song-title">{{ playMusic.name }}</div>
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
                <span v-if="ind !== item.ar.length - 1">
                  /
                </span>
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
        <ul class="list" ref="lyricUL">
          <li class="item" ref="lyric" :class="{'active':lyricIndex === index }" v-for="(item,index) in lyricsObjArr" :data-time="item.time" :key="item.uid">{{item.lyric}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // @ts-nockeck
  import { getLyric } from '@api/my-music';
  import {defineComponent, reactive, ref, toRefs, watch,onMounted} from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  props: ({
    playListShow: {
      type: Boolean,
      default: false
    },
    playMusicList: {
      type: Array,
      default: []
    },
    playMusicId: {
      type: Number,
      default: 0
    },
    playMusic: {
      type: Object,
      default: {}
    },
    timeStamp: {
      type:Number,
      default:''
    },
    lyricString:{
      type:String,
      default:'',
    },
  } as unknown) as undefined,
  setup(props: { playMusicId: number,timeStamp:string,lyricString:String }, { emit }) {
    const state:any = reactive({
      lyricsObjArr:[],
      lyricIndex:0,
    })
    const lyricUL = ref<HTMLElement>();
    watch(
            ()=>props.timeStamp,
            (curvAL)=>{
              getWatch(props,curvAL);
            },
    )
    watch(
            ()=>props.lyricString,
            (curvAL)=>{
              setLyricFun(props.lyricString);
            },
    )

    function getWatch(value,curvAL){
      let timeStamp=value.timeStamp;
      // 匹配歌词
      for (let i = 0; i < state.lyricsObjArr.length; i++) {
        if (timeStamp > (parseInt(state.lyricsObjArr[i].time))) {
          state.lyricIndex=i;
          if(curvAL){
            state.lyricIndex?setTimeout(()=>{
              (lyricUL.value as HTMLElement).scrollTop=(32 * (state.lyricIndex + 1))-110
            },750):'';
          }
        }
      }
    }
    function setLyricFun(res:any) {
      state.lyricsObjArr=[];
      const regNewLine = /\n/;
      const lineArr = res.lrc.lyric.split(regNewLine); // 每行歌词的数组
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      lineArr.forEach((item:any) => {
        if (item === '') return
        let obj={
          lyric:'',
          time:0,
          uid:'',
        }
        let time = item.match(regTime)

        obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim()
        obj.time = time ? formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0
        obj.uid = Math.random().toString().slice(-6)
        if (obj.lyric === '') {
          console.log('这一行没有歌词')
        } else {
          state.lyricsObjArr.push(obj)
        }
      })
    }
    function formatLyricTime (time:any) { // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/
      const regSec = /:.*\./
      const regMs = /\./

      const min = parseInt(time.match(regMin)[0].slice(0, 2))
      let sec = parseInt(time.match(regSec)[0].slice(1, 3))
      const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3)
      if (min !== 0) {
        sec += min * 60
      }
      return Number(sec + '.' + ms)
    }

    const $store = useStore();
    // 清除列表
    function emptyMusicList(): void {
      $store.commit('emptyPlayMusicList');
    }

    // 列表项删除
    function deleteMusicList(id: number, event: MouseEvent): void {
      event.stopPropagation();
      $store.commit('deletePlayMusicList', id);
    }

    // 列表项点击
    function playlistItem(id: number): void {
      emit('playlistItem', id);
    }

    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }

    const toRefsData=toRefs(state)

    return {
      ...toRefsData,
      timeStampToDuration,
      emptyMusicList,
      deleteMusicList,
      playlistItem,
      closePlayList,
      lyricUL,
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
