<template>
  <div class="play-list-main">
    <!-- 个人信息部分 -->
    <UserInfo class="user-info" @commentClick="commentClick" />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="songSheetDetail?.playlist?.tracks.length > 0"
      >
        播放:
        <span class="eye-catching">{{
          songSheetDetail?.playlist?.playCount
        }}</span>
        次
      </div>
    </div>
    <!-- 音乐列表 -->
    <MusicTable class="music-table" />
    <!-- 评论 -->
    <div class="comment-component">
      <comment
        v-if="songSheetDetail?.playlist?.tracks.length > 0"
        :songSheetDetail="songSheetDetail"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@components/comment/Comment.vue';

export default defineComponent({
  components: {
    UserInfo,
    MusicTable,
    Comment
  },
  setup() {
    const $store = useStore();

    // 详情数据
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );

    // 评论
    function commentClick(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      const myMusicDom = document.querySelector('.my-music') as HTMLElement;
      // 标题高度
      myMusicDom.scrollTo(0, Number(commentDom.offsetTop) - 36);
    }

    return {
      songSheetDetail,
      commentClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
