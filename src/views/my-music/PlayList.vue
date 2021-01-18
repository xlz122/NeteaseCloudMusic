<template>
  <div class="music-play-list">
    <div class="title">
      <div class="title-left" @click="playList">
        <i class="icon-arrow" :class="{ 'icon-arrow-down': playListShow }"></i>
        <h2 class="text">创建的歌单</h2>
        <h2 class="text-num">({{ createdPlayCount }})</h2>
      </div>
      <div class="title-right" @click="playAddDialog">新建</div>
    </div>
    <ul class="list" v-if="playListShow">
      <li
        class="item"
        :class="{ 'active-item': index === activeIndex }"
        v-for="(item, index) in playListData"
        :key="index"
        @click="playListOption(item.id, index)"
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
    <my-dialog
      class="my-dialog"
      :class="{ 'my-dialog-add': playDialogeData.type === 'add' }"
      :visible="playDialogeData.visible"
      :title="playDialogeData.title"
      :confirmtext="playDialogeData.confirmtext"
      showCancelButton
      showConfirmButton
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="content" v-if="playDialogeData.type === 'add'">
        <div class="form">
          <span class="name">歌单名：</span>
          <input class="input" v-model="playDialogeData.name" type="text" />
        </div>
        <p class="desc">可通过“收藏”将音乐添加到新歌单中</p>
      </div>
      <p class="content" v-else>确定删除歌单？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';
import {
  userPlayList,
  addPlayList,
  deletePlayList,
  playListDetail
} from '@api/my-music';

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
    MyDialog
  },
  props: ({
    createdPlayCount: {
      type: Number,
      default: 0
    }
  } as unknown) as undefined,
  emits: ['playListOption'],
  setup(props, ctx) {
    const $store = useStore();

    // 创建的歌单显隐
    const playListShow = ref<boolean>(true);
    function playList(): void {
      playListShow.value = !playListShow.value;
      if (playListShow.value) {
        getUserPlayList();
      }
    }

    // 获取创建的歌单列表
    const activeIndex = ref<number>(0);
    const playListData = ref<ResponseType[]>([]);
    function getUserPlayList(): boolean | undefined {
      if (playListData.value.length > 0) {
        return false;
      }
      // 账户数据
      const accountInfo = computed(() => $store.getters.accountInfo);
      userPlayList({
        uid: accountInfo.value.id
      }).then((res: ResponseType) => {
        if (res.code == 200) {
          playListData.value = res.playlist;
          // 初始化获取歌单详情
          playListOption(
            playListData.value[activeIndex.value].id,
            activeIndex.value
          );
        }
      });
    }
    getUserPlayList();

    // 创建的歌单项点击
    function playListOption(id: number, index: number): void {
      activeIndex.value = index;
      // 获取歌单详情
      playListDetail({ id }).then((res: ResponseType) => {
        if (res.code === 200) {
          ctx.emit('playListOption', res);
        }
      });
    }

    // 对话框数据
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

    // 对话框 - 确定
    function dialogConfirm(): void {
      if (playDialogeData.type === 'add') {
        addPlayList({ name: playDialogeData.name }).then(
          (res: ResponseType) => {
            if (res.code === 200) {
              playListData.value.splice(1, 0, res.playlist);
              // 获取当前项详情
              playListOption(res.id, 1);
            }
          }
        );
      } else {
        deletePlayList({ id: playDialogeData.id }).then((res: ResponseType) => {
          if (res.code === 200) {
            const index = playListData.value.findIndex(
              item => (item as any).id === playDialogeData.id
            );
            playListData.value.splice(index, 1);
            // 获取上一项详情
            const id = playListData.value[index - 1].id;
            playListOption(id, index - 1);
          }
        });
      }
      playDialogeData.visible = false;
    }

    // 对话框 - 取消
    function dialogCancel(): void {
      playDialogeData.visible = false;
    }

    return {
      playList,
      playListShow,
      playListData,
      activeIndex,
      playListOption,
      playDialogeData,
      playAddDialog,
      playDeleteDialog,
      dialogConfirm,
      dialogCancel
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
