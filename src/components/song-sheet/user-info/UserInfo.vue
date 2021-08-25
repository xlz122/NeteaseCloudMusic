<template>
  <div class="song-sheet-user-info">
    <div class="header-info">
      <div class="info-img">
        <img
          class="img"
          :src="`${songSheetDetail?.playlist?.coverImgUrl}?param=200y200`"
        />
        <i class="icon"></i>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">{{ songSheetDetail?.playlist?.name }}</h2>
        </div>
        <div class="info">
          <img
            class="user-avatar"
            :src="songSheetDetail?.playlist?.creator?.avatarUrl"
            @click="jumpUserProfile(songSheetDetail?.playlist?.creator?.userId)"
            alt=""
          />
          <span
            class="user-name"
            @click="jumpUserProfile(songSheetDetail?.playlist?.creator?.userId)"
          >
            {{ songSheetDetail?.playlist?.creator?.nickname }}
          </span>
          <span class="user-time">
            {{
              formatDateTime(
                songSheetDetail?.playlist?.createTime / 1000,
                'yyyy-MM-dd'
              )
            }}
            创建
          </span>
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="playTitleMusic"
          >
            <span class="icon-play">播放</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-play-add': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="setAddPlayList"
          ></div>
          <!-- 自己的歌单，不可收藏/取消收藏 -->
          <template
            v-if="
              songSheetDetail?.playlist?.userId === userInfo?.profile?.userId
            "
          >
            <div class="other collection disable-collection">
              <span
                class="icon"
                v-if="songSheetDetail?.playlist?.subscribedCount > 0"
              >
                ({{ songSheetDetail?.playlist?.subscribedCount }})
              </span>
              <span class="icon" v-else>收藏</span>
            </div>
          </template>
          <!-- 其他人歌单，可收藏/取消收藏 -->
          <template v-else>
            <div
              class="other collection"
              :class="{
                'disable-collection': songSheetDetail?.playlist?.subscribed
              }"
              @click="collectionClick(songSheetDetail?.playlist?.subscribed)"
            >
              <template v-if="songSheetDetail?.playlist?.subscribedCount === 0">
                <span class="icon">收藏</span>
              </template>
              <template v-else>
                <span class="icon">
                  ({{ songSheetDetail?.playlist?.subscribedCount }})
                </span>
              </template>
            </div>
          </template>
          <div
            class="other share"
            :class="{
              'disable-share': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="shareClick"
          >
            <template v-if="songSheetDetail?.playlist?.shareCount === 0">
              <span class="icon">分享</span>
            </template>
            <template v-else>
              <span class="icon">
                ({{ songSheetDetail?.playlist?.shareCount }})
              </span>
            </template>
          </div>
          <div
            class="other download"
            :class="{
              'disable-download': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="downloadClick"
          >
            <span class="icon">下载</span>
          </div>
          <div
            class="other comment"
            :class="{
              'disable-comment': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="commentClick"
          >
            <template v-if="songSheetDetail?.playlist?.commentCount === 0">
              <span class="icon">评论</span>
            </template>
            <template v-else>
              <span class="icon">
                ({{ songSheetDetail?.playlist?.commentCount }})
              </span>
            </template>
          </div>
        </div>
        <div class="tags" v-if="songSheetDetail?.playlist?.tags.length > 0">
          <b class="title">标签：</b>
          <ul class="list">
            <li
              class="item"
              v-for="(item, index) in songSheetDetail?.playlist?.tags"
              :key="index"
              @click="jumpSongSheet(item)"
            >
              <span class="text">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="desc" v-if="songSheetDetail?.playlist?.description">
          <b class="title">介绍：</b>
          <p class="content">{{ songSheetDetail?.playlist?.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { playlistSubscribe } from '@api/song-sheet-detail';
import { formatDateTime } from '@utils/utils.ts';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  emit: ['commentClick'],
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 歌单详情数据
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = songSheetDetail.value?.privileges.find(
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
        if (songSheetDetail.value?.playlist?.tracks.length === 0) {
          return false;
        }
        // 播放第一项
        const item = songSheetDetail.value?.playlist?.tracks[0];

        // 处理播放器所需数据
        const musicItem: PlayMusicItem = {
          id: item.id,
          name: item.name,
          picUrl: item.al.picUrl,
          time: item.dt,
          mv: item.mv,
          singerList: []
        };

        item?.ar?.forEach((item: LoopType) => {
          musicItem.singerList.push({
            id: item.id,
            name: item.name
          });
        });

        // 当前播放音乐id
        $store.commit('music/setPlayMusicId', musicItem.id);
        // 当前播放音乐数据
        $store.commit('music/setPlayMusicItem', musicItem);
        // 开始播放
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          refresh: true
        });

        // 添加播放列表
        songSheetDetail.value?.playlist?.tracks.forEach((item: LoopType) => {
          // 无版权歌曲不添加到播放列表
          if (isCopyright(item.id)) {
            return false;
          }
          // 处理播放器所需数据
          const musicItem: PlayMusicItem = {
            id: item.id,
            name: item.name,
            picUrl: item.al.picUrl,
            time: item.dt,
            mv: item.mv,
            singerList: []
          };

          item?.ar?.forEach((item: LoopType) => {
            musicItem.singerList.push({
              id: item.id,
              name: item.name
            });
          });
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', musicItem);
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): boolean | undefined {
      if (songSheetDetail.value?.playlist?.tracks.length === 0) {
        return false;
      }
      songSheetDetail.value?.playlist?.tracks.forEach((item: LoopType) => {
        // 无版权歌曲不添加到播放列表
        if (isCopyright(item.id)) {
          return false;
        }

        // 处理播放器所需数据
        const musicItem: PlayMusicItem = {
          id: item.id,
          name: item.name,
          picUrl: item.al.picUrl,
          time: item.dt,
          mv: item.mv,
          singerList: []
        };

        item?.ar?.forEach((item: LoopType) => {
          musicItem.singerList.push({
            id: item.id,
            name: item.name
          });
        });

        // 播放音乐数据
        $store.commit('music/setPlayMusicList', musicItem);
      });
    }

    // 收藏
    function collectionClick(subscribed: boolean): void {
      // 1:收藏 2:取消收藏
      const t = subscribed ? 2 : 1;
      playlistSubscribe({
        id: songSheetDetail.value?.playlist?.id,
        t
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            if (t === 1) {
              $store.commit('setMessage', {
                type: 'info',
                title: '收藏成功'
              });
              songSheetDetail.value.playlist.subscribed = true;
            }
            if (t === 2) {
              $store.commit('setMessage', {
                type: 'info',
                title: '取消收藏'
              });
              songSheetDetail.value.playlist.subscribed = false;
            }

            // 更新歌单详情
            $store.commit('music/setSongSheetDetail', songSheetDetail.value);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
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
      emit('commentClick');
    }

    // 跳转用户资料
    function jumpUserProfile(userId: number) {
      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);
      $router.push({ name: 'user-profile', params: { userId } });
    }

    // 跳转歌单
    function jumpSongSheet(name: string): void {
      $router.push({ name: 'home-song-sheet', params: { name } });
    }

    return {
      formatDateTime,
      userInfo,
      songSheetDetail,
      playMusicId,
      isCopyright,
      playTitleMusic,
      setAddPlayList,
      collectionClick,
      shareClick,
      downloadClick,
      commentClick,
      jumpUserProfile,
      jumpSongSheet
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-info.less';
</style>
