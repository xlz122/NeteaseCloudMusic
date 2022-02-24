<template>
  <div class="music-table-container">
    <!-- loading -->
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <!-- 歌曲列表部分 -->
    <table
      class="play-list-table"
      v-if="songSheetDetail?.playlist?.tracks.length > 0"
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
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in songSheetDetail?.playlist?.tracks"
          :key="index"
          :class="[
            { 'even-tr': (index + 1) % 2 },
            { 'no-copyright': isCopyright(item.id) }
          ]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i class="icon-new"></i>
            </div>
          </td>
          <td class="tbody-td" :class="{ song: index < 3 }">
            <div class="hd">
              <template v-if="index < 3">
                <img
                  class="song-img"
                  :src="item.al.picUrl"
                  alt=""
                  @click="jumpSongDetail(item.id)"
                />
              </template>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playListMusic(item)"
              ></i>
              <span class="text" @click="jumpSongDetail(item.id)">
                <span class="title" :title="item.name">{{ item.name }}</span>
                <span class="no-click" v-if="item.alia[0]">
                  - {{ item.alia[0] }}
                </span>
              </span>
              <i class="icon-mv" v-if="item.mv > 0"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item.dt / 1000) }}
              </span>
              <div class="operate-btn">
                <i
                  class="icon add"
                  title="添加到播放列表"
                  @click="setAddSinglePlayList(item)"
                ></i>
                <i
                  class="icon collect"
                  title="收藏"
                  @click="collectMusic(item.id)"
                ></i>
                <i class="icon share" title="分享"></i>
                <i class="icon download" title="下载"></i>
                <!-- 用户自己才有删除按钮 -->
                <i
                  class="icon delete"
                  v-if="
                    songSheetDetail?.playlist?.creator?.userId ===
                    userInfo?.profile?.userId
                  "
                  title="删除"
                  @click="deleteMusicShow(item.id)"
                ></i>
              </div>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <div class="text" v-for="(i, ind) in item.ar" :key="ind">
                <span
                  class="name"
                  :title="i.name"
                  @click="jumpSingerDetail(i.id)"
                >
                  {{ i.name }}
                </span>
                <span class="line" v-if="ind !== item.ar.length - 1">/</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 音乐列表空时展示 -->
    <div
      class="no-list-data"
      v-if="!loading && songSheetDetail?.playlist?.tracks.length === 0"
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
import { defineComponent, ref, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';
import { timeStampToDuration } from '@utils/utils.ts';
import { deleteMusic } from '@api/my-music';
import { LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  components: {
    MyDialog
  },
  props: {
    songSheetDetail: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { songSheetDetail } = toRefs(props);

    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    const loading = ref<boolean>(true);
    watch(
      () => songSheetDetail.value,
      () => {
        loading.value = false;
      }
    );

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

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

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(item: Record<string, any>): void {
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
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 播放列表音乐
    const noCopyrightDialog = ref<boolean>(false);
    function playListMusic(item: Record<string, any>): boolean | undefined {
      // 无版权处理
      if (isCopyright(item.id)) {
        noCopyrightDialog.value = true;
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

      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', musicItem.id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', musicItem);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 收藏歌曲
    function collectMusic(id: number): void {
      $store.commit('music/collectPlayMusic', {
        visible: true,
        songId: id
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
        pid: songSheetDetail.value.playlist.id,
        tracks: deleteMuiscId.value
      }).then(() => {
        const index = songSheetDetail.value?.playlist?.tracks?.findIndex(
          (item: LoopType) => item.id === deleteMuiscId.value
        );
        songSheetDetail.value?.playlist?.tracks?.splice(index, 1);
      });
    }

    // 删除歌曲 - 取消
    function deleteMusicCancel(): void {
      deleteMusicDialog.value = false;
    }
    return {
      timeStampToDuration,
      userInfo,
      playMusicId,
      loading,
      jumpSongDetail,
      isCopyright,
      jumpSingerDetail,
      setAddSinglePlayList,
      collectMusic,
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
@import './toplist-song.less';
</style>
