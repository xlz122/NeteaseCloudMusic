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
      <div class="title-left" @click="playList">
        <i class="icon-arrow" :class="{ 'icon-arrow-down': playListShow }"></i>
        <h2 class="text">创建的歌单</h2>
        <h2 class="text-num">({{ optionsCount.createdPlayCount }})</h2>
      </div>
      <div class="title-right" @click="playAddDialog">新建</div>
    </div>
    <ul class="list" v-if="playListShow">
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
  <create-play-dialog
    :playDialogeData="playDialogeData"
    @dialogConfirm="dialogConfirm"
  />
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { userPlayList, playListDetail } from '@api/my-music';
import CreatePlayDialog from './createPlayDialog.vue';

interface ResponseType {
  [key: string]: any;
}

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
    const playListShow = ref<boolean>(true);
    function playList(): void {
      playListShow.value = !playListShow.value;
      if (playListShow.value) {
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
      
      // 创建歌单选中
      activeIndex.value = index;

      // 获取歌单详情
      getPlayListDetail(id);
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
          item => (item as any).id === params.id
        );
        params.id = playListData.value[index - 1].id;
        // 刷新选项栏
        getUserPlayList();
        // 获取歌单详情
        playListClick(params.id, index - 1);
      }
    }

    return {
      myMusicDetail,
      activeIndex,
      myMvClick,
      playList,
      playListShow,
      playListData,
      playListClick,
      playDialogeData,
      playAddDialog,
      playDeleteDialog,
      dialogConfirm
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
