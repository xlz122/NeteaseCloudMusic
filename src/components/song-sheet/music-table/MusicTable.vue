<template>
  <div class="music-table-container">
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table
      class="play-list-table"
      v-if="!loading && songSheetDetail?.playlist?.tracks.length > 0"
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
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playSingleMusic(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item?.id)">
                <span class="title" :title="`${item?.name}`">
                  {{ item?.name }}
                </span>
                <span class="no-click" v-if="item?.alia[0]">
                  - {{ item?.alia[0] }}
                </span>
              </span>
              <i
                class="icon-mv"
                v-if="item?.mv > 0"
                @click="jumpVideoDetail(item?.mv)"
              ></i>
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
                  @click="singleMusicToPlayList(item)"
                ></i>
                <i
                  class="icon collect"
                  title="收藏"
                  @click="handleCollection(item?.id)"
                ></i>
                <i class="icon share" title="分享" @click="handleShare"></i>
                <i
                  class="icon download"
                  title="下载"
                  @click="handleDownload"
                ></i>
                <!-- 用户自己才有删除按钮 -->
                <i
                  class="icon delete"
                  v-if="
                    songSheetDetail?.playlist?.creator?.userId ===
                    userInfo?.profile?.userId
                  "
                  title="删除"
                  @click="deleteMusicShow(item?.id)"
                ></i>
              </div>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <div class="text" v-for="(i, ind) in item?.ar" :key="ind">
                <span
                  class="name"
                  :title="i?.name"
                  @click="jumpSingerDetail(i?.id)"
                >
                  {{ i?.name }}
                </span>
                <span class="line" v-if="ind !== item?.ar?.length - 1">/</span>
              </div>
            </div>
          </td>
          <td class="tbody-td" @click="jumpAlbumDetail(item?.al?.id)">
            <div class="hd">
              <span class="text" :title="item?.al?.name">
                {{ item?.al?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
        <router-link class="link" to="/">发现音乐</router-link>
      </p>
    </div>
    <my-dialog
      class="no-copyright-dialog"
      :visible="noCopyrightDialog"
      :confirmtext="'知道了'"
      showConfirmButton
      @confirm="noCopyrightConfirm"
    >
      <p class="content">由于版权保护，您所在的地区暂时无法使用。</p>
    </my-dialog>
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { handleAudioSong } from '@/common/audio.ts';
import { timeStampToDuration } from '@utils/utils.ts';
import { deleteMusic } from '@api/my-music';
import { LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  components: {
    MyDialog
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    const playMusicId = computed(() => $store.getters['music/playMusicId']);
    // 歌单详情数据
    const songSheetDetail = computed(() => $store.getters.songSheetDetail);

    // 歌曲是否有版权
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

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Record<string, any>): void {
      const musicItem: PlayMusicItem = handleAudioSong(item);

      $store.commit('music/setPlayMusicList', musicItem);
    }

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 播放单个歌曲
    const noCopyrightDialog = ref<boolean>(false);
    function playSingleMusic(item: Record<string, any>): boolean | undefined {
      // 无版权处理
      if (isCopyright(item.id)) {
        noCopyrightDialog.value = true;
        return false;
      }

      const musicItem: PlayMusicItem = handleAudioSong(item);

      // 当前播放音乐
      $store.commit('music/setPlayMusicItem', musicItem);
      // 添加到播放列表
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function handleDownload(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
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
      })
        .then(() => {
          const index = songSheetDetail.value?.playlist?.tracks?.findIndex(
            (item: LoopType) => item.id === deleteMuiscId.value
          );
          songSheetDetail.value?.playlist?.tracks?.splice(index, 1);
        })
        .catch(() => ({}));
    }

    // 删除歌曲 - 取消
    function deleteMusicCancel(): void {
      deleteMusicDialog.value = false;
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number): void {
      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('video/setVideo', { id, url: '' });
    }

    const loading = ref<boolean>(true);

    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
      }, 200);
    });

    return {
      timeStampToDuration,
      userInfo,
      playMusicId,
      songSheetDetail,
      isCopyright,
      singleMusicToPlayList,
      handleCollection,
      noCopyrightDialog,
      noCopyrightConfirm,
      playSingleMusic,
      handleShare,
      handleDownload,
      deleteMusicDialog,
      deleteMusicShow,
      deleteMusicConfirm,
      deleteMusicCancel,
      jumpAlbumDetail,
      jumpSingerDetail,
      jumpSongDetail,
      jumpVideoDetail,
      loading
    };
  }
});
</script>

<style lang="less" scoped>
@import './music-table.less';
</style>
