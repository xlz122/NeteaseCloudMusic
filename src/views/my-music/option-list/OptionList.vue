<template>
  <h2
    class="music-my-mv"
    :class="{ 'music-my-mv-active': myMusicDetail.myMv }"
    @click="myMvClick"
  >
    我的视频({{ optionsCount.myMvCount }})
  </h2>
  <div class="music-play-list">
    <div class="title">
      <div class="title-left" @click="createPlayList">
        <i class="icon-arrow" :class="{ 'icon-arrow-down': createPlayListShow }"></i>
        <h2 class="text">创建的歌单</h2>
        <h2 class="text-num">({{ optionsCount.createdPlayCount }})</h2>
      </div>
      <div class="title-right" @click="playAddDialog">新建</div>
    </div>
    <ul class="list" v-if="createPlayListShow">
      <li
        class="item"
        :class="{ 'active-item': index === activeIndex }"
        v-for="(item, index) in playListData"
        :key="index"
        @click="playListClick(item.id, index)"
      >
        <div class="item-left">
          <img class="img" :src="item.coverImgUrl" alt="" />
        </div>
        <div class="item-right">
          <span class="name">{{ item.name }}</span>
          <span class="num">{{ item.trackCount }}首</span>
        </div>
        <div class="item-operate" v-if="index !== 0">
          <i class="operate-icon operate-edit"></i>
          <i
            class="operate-icon operate-delete"
            @click="playDeleteDialog(item.id, $event)"
          ></i>
        </div>
      </li>
    </ul>
  </div>
  <div class="music-play-list">
    <div class="title">
      <div class="title-left" @click="collectionPlayList">
        <i class="icon-arrow" :class="{ 'icon-arrow-down': collectionPlayListShow }"></i>
        <h2 class="text">收藏的歌单</h2>
        <h2 class="text-num">({{ optionsCount.collectionPlayCount }})</h2>
      </div>
      <div class="title-right" @click="playAddDialog" style="visibility: hidden;">新建</div>
    </div>
    <ul class="list" v-if="false">
      <li
        class="item"
        :class="{ 'active-item': index === activeIndex }"
        v-for="(item, index) in playListData"
        :key="index"
        @click="playListClick(item.id, index)"
      >
      <!-- subscribed收藏 -->
      <!-- subscribedCount 收藏数量 -->
        <template v-if="item.subscribed">
          <div class="item-left">
            <img class="img" :src="item.coverImgUrl" alt="" />
          </div>
          <div class="item-right">
            <span class="name">{{ item.name }}</span>
            <span class="num">{{ item.trackCount }}首</span>
          </div>
          <div class="item-operate" v-if="index !== 0">
            <!-- <i class="operate-icon operate-edit"></i> -->
            <i
              class="operate-icon operate-delete"
              @click="playDeleteDialog(item.id, $event)"
            ></i>
          </div>
        </template>
      </li>
    </ul>
  </div>
  <teleport to="#modal">
    <create-play-dialog
      :playDialogeData="playDialogeData"
      @dialogConfirm="dialogConfirm"
    />
  </teleport>
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { userPlayList, playListDetail } from '@api/my-music';
import CreatePlayDialog from './createPlayDialog.vue';
import { ResponseType, LoopType } from '@/types/types';

interface PlayDialogData {
  visible: boolean;
  type: string;
  title: string;
  confirmtext: string;
  name: string;
  id: number;
}

export default defineComponent({
  components: {
    CreatePlayDialog
  },
  props: ({
    optionsCount: {
      type: Object,
      default: {}
    }
  } as unknown) as undefined,
  emits: ['playListClick'],
  setup() {
    const $store = useStore();

    // 详情显示
    const myMusicDetail = computed(() => $store.getters.myMusicDetail);

    // 创建歌单选中
    const activeIndex = ref<number>(0);

    // 我的视频点击
    function myMvClick(): void {
      const musicDetail = JSON.parse(JSON.stringify(myMusicDetail.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.myMv = true;
      $store.commit('setMyMusicDetail', musicDetail);

      // 创建歌单取消选中
      activeIndex.value = -1;
    }

    // 创建的歌单显隐
    const createPlayListShow = ref<boolean>(true);
    function createPlayList(): void {
      createPlayListShow.value = !createPlayListShow.value;
      if (createPlayListShow.value) {
        getUserPlayList();
      }
    }

    // 获取创建歌单列表
    const playListData = ref<ResponseType[]>([]);
    function getUserPlayList(): void {
      // 账户数据
      const accountInfo = computed(() => $store.getters.accountInfo);
      userPlayList({
        uid: accountInfo.value.id
      }).then((res: ResponseType) => {
        if (res.code == 200) {
          playListData.value = res.playlist;
          // 初始化获取第一项创建歌单详情
          const musicDetail = JSON.parse(JSON.stringify(myMusicDetail.value));
          for (const value in musicDetail) {
            musicDetail[value] = false;
          }
          musicDetail.playListDetail = true;
          $store.commit('setMyMusicDetail', musicDetail);
          getPlayListDetail(playListData.value[activeIndex.value].id);
        }
      });
    }
    getUserPlayList();

    // 获取创建歌单详情
    function getPlayListDetail(id: number): void {
      playListDetail({ id }).then((res: ResponseType) => {
        if (res.code === 200) {
          $store.commit('setPlayDetailData', res);
        }
      });
    }

    // 创建歌单项点击
    function playListClick(id: number, index: number): void {
      const musicDetail = JSON.parse(JSON.stringify(myMusicDetail.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.playListDetail = true;
      $store.commit('setMyMusicDetail', musicDetail);
      
      if (index !== activeIndex.value) {
        // 创建歌单选中
        activeIndex.value = index;

        // 获取歌单详情
        getPlayListDetail(id);
      }
    }

    // 创建歌单 - 对话框数据
    const playDialogeData = reactive<PlayDialogData>({
      visible: false,
      type: 'add',
      title: '提示',
      confirmtext: '确定',
      name: '', // 歌单名称
      id: 0 // 歌单id
    });

    // 创建歌单 - 打开新建对话框
    function playAddDialog(): void {
      playDialogeData.visible = true;
      playDialogeData.title = '新建歌单';
      playDialogeData.confirmtext = '新建';
      playDialogeData.type = 'add';
      playDialogeData.name = '';
    }

    // 创建歌单 - 打开删除对话框
    function playDeleteDialog(id: number, event: MouseEvent): void {
      event.stopPropagation();
      playDialogeData.visible = true;
      playDialogeData.title = '提示';
      playDialogeData.confirmtext = '确定';
      playDialogeData.type = 'delete';
      playDialogeData.id = id;
    }

    // 创建歌单 - 对话框确定
    function dialogConfirm(params: { type: string; id: number }): void {
      // 添加 - 到歌单第二项
      if (params.type === 'add') {
        // 刷新选项栏
        getUserPlayList();
        // 获取歌单详情
        playListClick(params.id, 1);
      }

      // 删除 - 刷新为上一项数据
      if (params.type === 'delete') {
        // 获取上一项id
        const index = playListData.value.findIndex(
          (item: LoopType) => item .id === params.id
        );
        params.id = playListData.value[index - 1].id;
        // 刷新选项栏
        getUserPlayList();
        // 获取歌单详情
        playListClick(params.id, index - 1);
      }
    }

    // 收藏的歌单显隐
    const collectionPlayListShow = ref<boolean>(true);
    function collectionPlayList(): void {
      collectionPlayListShow.value = !collectionPlayListShow.value;
      if (collectionPlayListShow.value) {
        getUserPlayList();
      }
    }

    return {
      myMusicDetail,
      activeIndex,
      myMvClick,
      createPlayList,
      createPlayListShow,
      playListData,
      playListClick,
      playDialogeData,
      playAddDialog,
      playDeleteDialog,
      dialogConfirm,
      collectionPlayList,
      collectionPlayListShow
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
