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
      <div class="clear-all">
        <i class="icon"></i>
        <span>清除</span>
      </div>
      <div class="song-title">{{ playMusic.name}}</div>
      <i class="clear-icon" @click="closePlayList"></i>
    </div>
    <!-- 内容部分 -->
    <div class="play-list-content">
      <div class="left-content">
        <ul class="list">
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
              <i class="icon delete"></i>
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
      </div>
      <i class="line"></i>
      <div class="right-content">
        <i class="icon-doubt"></i>
        <ul class="list">
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
          <li class="item">测试歌词 测试歌词</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    }
  } as unknown) as undefined,
  setup(props, { emit }) {
    // 列表项点击
    function playlistItem(id: number): void {
      emit('playlistItem', id);
    }
    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }
    return {
      timeStampToDuration,
      playlistItem,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
