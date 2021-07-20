<template>
  <div class="play-list-main">
    <!-- 个人信息部分 -->
    <UserInfo class="user-info" />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ songListDetailData?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="songListDetailData?.playlist?.tracks.length > 0"
      >
        播放:
        <span class="eye-catching">{{
          songListDetailData?.playlist?.playCount
        }}</span>
        次
      </div>
    </div>
    <!-- 音乐列表 -->
    <MusicTable class="music-table" />
    <!-- 评论 -->
    <comment
      v-if="songListDetailData?.playlist?.tracks.length > 0"
      :songListDetailData="songListDetailData"
    />
    <!-- 无版权弹框 -->
    <my-dialog
      class="no-copyright-dialog"
      :visible="noCopyrightDialog"
      :confirmtext="'知道了'"
      showConfirmButton
      @confirm="noCopyrightConfirm"
    >
      <p class="content">由于版权保护，您所在的地区暂时无法使用。</p>
    </my-dialog>
    <!-- 删除歌曲弹框 -->
    <my-dialog
      class="delete-music-dialog"
      :visible="deleteMusicDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm="deleteMusicConfirm"
      @cancel="deleteMusicCancel"
    >
      <p class="content">确定删除歌曲？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { timeStampToDuration, formatDateTime } from '@utils/utils.ts';
import { deleteMusic } from '@api/my-music';
import { LoopType } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@views/my-music/play-list-detail/Comment.vue';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  components: {
    UserInfo,
    MusicTable,
    Comment,
    MyDialog
  },
  setup() {
    const $store = useStore();

    // 详情数据
    const songListDetailData = computed(
      () => $store.getters['music/songListDetailData']
    );
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    const loading = ref<boolean>(false);
    watch(
      () => songListDetailData.value,
      () => {
        if (songListDetailData.value?.code) {
          loading.value = false;
        } else {
          loading.value = true;
        }
      }
    );

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = songListDetailData.value?.privileges.find(
        (item: LoopType) => item.id === id
      );
      if (privilege?.cp === 0) {
        return true;
      } else {
        return false;
      }
    }

    // 头部播放 - 默认播放列表第一项
    const playTitleMusic = throttle(
      function () {
        if (songListDetailData.value?.playlist?.tracks.length > 0) {
          const musicItem = songListDetailData.value?.playlist?.tracks[0];
          // 当前播放音乐id
          $store.commit('music/setPlayMusicId', musicItem.id);
          // 当前播放音乐数据
          $store.commit('music/setPlayMusicItem', musicItem);
          // 开始播放
          $store.commit('music/setMusicPlayStatus', {
            look: true,
            loading: true,
            refresh: true
          });
        }
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): void {
      if (songListDetailData.value?.playlist?.tracks.length > 0) {
        songListDetailData.value?.playlist?.tracks.forEach((item: LoopType) => {
          // 无版权歌曲不添加到播放列表
          if (isCopyright(item.id)) {
            return false;
          }
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', item);
        });
      }
    }

    // 收藏
    function collectionClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function downloadClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function commentClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(id: number): void {
      if (songListDetailData.value?.playlist?.tracks.length > 0) {
        const musicItem = songListDetailData.value?.playlist?.tracks.find(
          (item: LoopType) => item.id === id
        );
        // 播放音乐数据
        $store.commit('music/setPlayMusicList', musicItem);
      }
    }

    // 播放列表音乐
    const noCopyrightDialog = ref<boolean>(false);
    function playListMusic(
      id: number,
      item: Record<string, any>
    ): boolean | undefined {
      // 无版权处理
      if (isCopyright(id)) {
        noCopyrightDialog.value = true;
        return false;
      }
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 无版权弹框 - 确定
    function noCopyrightConfirm(): void {
      noCopyrightDialog.value = false;
    }

    // 删除歌曲弹框
    const deleteMusicDialog = ref<boolean>(false);
    // 即将删除的歌曲id
    const deleteMuiscId = ref<number>(0);
    // 列表 - 删除图标点击
    function deleteMusicShow(id: number): void {
      deleteMusicDialog.value = !deleteMusicDialog.value;
      deleteMuiscId.value = id;
    }

    // 删除歌曲 - 确定
    function deleteMusicConfirm(): void {
      deleteMusicDialog.value = false;
      deleteMusic({
        pid: songListDetailData.value.playlist.id,
        tracks: deleteMuiscId.value
      }).then(() => {
        const index = songListDetailData.value?.playlist?.tracks?.findIndex(
          (item: LoopType) => item.id === deleteMuiscId.value
        );
        songListDetailData.value?.playlist?.tracks?.splice(index, 1);
      });
    }

    // 删除歌曲 - 取消
    function deleteMusicCancel(): void {
      deleteMusicDialog.value = false;
    }
    return {
      timeStampToDuration,
      formatDateTime,
      songListDetailData,
      playMusicId,
      loading,
      isCopyright,
      playTitleMusic,
      setAddPlayList,
      collectionClick,
      shareClick,
      downloadClick,
      commentClick,
      setAddSinglePlayList,
      noCopyrightDialog,
      noCopyrightConfirm,
      playListMusic,
      deleteMusicDialog,
      deleteMusicShow,
      deleteMusicConfirm,
      deleteMusicCancel
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
