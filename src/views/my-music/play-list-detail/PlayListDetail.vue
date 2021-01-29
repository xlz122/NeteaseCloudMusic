<template>
  <div class="play-list-main">
    <!-- 个人信息部分 -->
    <div class="main-header">
      <div class="header-info">
        <div class="info-img">
          <img class="img" :src="playDetailData?.playlist?.coverImgUrl" />
          <i class="icon"></i>
        </div>
        <div class="info-right">
          <div class="title">
            <i class="icon-title"></i>
            <h2 class="title-text">{{ playDetailData?.playlist?.name }}</h2>
          </div>
          <div class="user-info">
            <img
              class="user-avatar"
              :src="playDetailData?.playlist?.creator?.avatarUrl"
            />
            <span class="user-name">
              {{ playDetailData?.playlist?.creator?.nickname }}
            </span>
            <span class="user-time">
              {{
                formatDateTime(
                  playDetailData?.playlist?.createTime / 1000,
                  'yyyy-MM-dd'
                )
              }}
              创建
            </span>
          </div>
          <div class="operate-btn">
            <div
              class="play"
              :class="{
                'disable-play': playDetailData?.playlist?.tracks.length === 0
              }"
              @click="playTitleMusic"
            >
              <span class="icon-play">播放</span>
            </div>
            <div
              class="play-add"
              :class="{
                'disable-play-add':
                  playDetailData?.playlist?.tracks.length === 0
              }"
            ></div>
            <div class="other collection">
              <span class="icon">收藏</span>
            </div>
            <div
              class="other share"
              :class="{
                'disable-share': playDetailData?.playlist?.tracks.length === 0
              }"
            >
              <span class="icon">分享</span>
            </div>
            <div
              class="other download"
              :class="{
                'disable-download':
                  playDetailData?.playlist?.tracks.length === 0
              }"
            >
              <span class="icon">下载</span>
            </div>
            <div
              class="other comment"
              :class="{
                'disable-comment': playDetailData?.playlist?.tracks.length === 0
              }"
            >
              <span class="icon">评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ playDetailData?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="playDetailData?.playlist?.tracks.length > 0"
      >
        播放:
        <span class="eye-catching">{{
          playDetailData?.playlist?.playCount
        }}</span>
        次
      </div>
    </div>
    <!-- 歌曲列表部分 -->
    <table
      class="play-list-table"
      v-if="playDetailData?.playlist?.tracks.length > 0"
    >
      <thead>
        <tr>
          <th class="th first-th">
            <i class="icon"></i>
          </th>
          <th class="th two-th">
            <i class="icon"></i>
          </th>
          <th class="th three-th">
            <i class="icon"></i>
          </th>
          <th class="th four-th">
            <i class="icon"></i>
          </th>
          <th class="th five-th">
            <i class="icon"></i>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in playDetailData?.playlist?.tracks"
          :key="index"
          :class="[
            { 'even-tr': (index + 1) % 2 },
            { 'no-copyright': isCopyright(item.id) }
          ]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playListMusic(item.id, item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">
                <span class="title">{{ item.name }}</span>
                <span class="no-click" v-if="item.alia[0]">
                  - {{ item.alia[0] }}
                </span>
              </span>
              <i class="icon-play" v-if="item.mv > 0"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item.dt / 1000) }}
              </span>
              <div class="operate-btn">
                <i class="icon add"></i>
                <i class="icon collect"></i>
                <i class="icon share"></i>
                <i class="icon download"></i>
                <i class="icon delete" @click="deleteMusicShow(item.id)"></i>
              </div>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <span class="text" v-for="(i, ind) in item.ar" :key="ind">
                {{ i.name }}
                <span class="line" v-if="ind !== item.ar.length - 1">/</span>
              </span>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">{{ item.al.name }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 音乐列表空时展示 -->
    <div
      class="no-list-data"
      v-if="playDetailData?.playlist?.tracks.length === 0"
    >
      <div class="title">
        <i class="icon"></i>
        <h3 class="text">暂无音乐！</h3>
      </div>
      <p class="desc">
        <span class="text">点击</span>
        <span class="icon"></span>
        <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
        <span class="text go">马上去</span>
        <span class="link">发现音乐</span>
      </p>
    </div>
    <!-- 评论 -->
    <comment
      v-if="playDetailData?.playlist?.tracks.length > 0"
      :playDetailData="playDetailData"
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
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';
import Comment from '@views/my-music/play-list-detail/Comment.vue';
import { timeStampToDuration, formatDateTime } from '@utils/utils.ts';
import { deleteMusic } from '@api/my-music';
import { LoopType } from '@/types/types';

export default defineComponent({
  components: {
    Comment,
    MyDialog
  },
  setup() {
    const $store = useStore();

    // 详情数据
    const playDetailData = computed(() => $store.getters.playDetailData);
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters.playMusicId);

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = playDetailData.value?.privileges.find(
        (item: LoopType) => item.id === id
      );
      if (privilege?.cp === 0) {
        return true;
      } else {
        return false;
      }
    }

    // 头部播放 - 默认播放列表第一项
    function playTitleMusic() {
      if (playDetailData.value?.playlist?.tracks.length > 0) {
        // 当前播放音乐id
        $store.commit(
          'setPlayMusicId',
          playDetailData.value?.playlist?.tracks[0].id
        );
        // 播放音乐数据
        $store.commit(
          'setPlayMusicList',
          playDetailData.value?.playlist?.tracks[0]
        );
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
      $store.commit('setPlayMusicId', id);
      // 播放音乐数据
      $store.commit('setPlayMusicList', item);
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
        pid: playDetailData.value.playlist.id,
        tracks: deleteMuiscId.value
      }).then(() => {
        const index = playDetailData.value?.playlist?.tracks?.findIndex(
          (item: LoopType) => item.id === deleteMuiscId.value
        );
        playDetailData.value?.playlist?.tracks?.splice(index, 1);
      });
    }

    // 删除歌曲 - 取消
    function deleteMusicCancel(): void {
      deleteMusicDialog.value = false;
    }
    return {
      timeStampToDuration,
      formatDateTime,
      playDetailData,
      playMusicId,
      isCopyright,
      playTitleMusic,
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
