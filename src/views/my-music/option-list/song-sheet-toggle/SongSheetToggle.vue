<template>
  <div class="music-play-list">
    <div class="title">
      <div class="title-left" @click="listToggle">
        <i class="icon-arrow" :class="{ 'icon-arrow-down': listShow }"></i>
        <h2 class="text">{{ title }}</h2>
        <h2 class="text-num">({{ listCount }})</h2>
      </div>
      <div
        class="title-right"
        :class="{ 'title-right-vertical': addBtnShow }"
        @click="handleAdd"
      >
        新建
      </div>
    </div>
    <ul class="list" v-if="listShow">
      <li
        class="item"
        :class="{
          'active-item': visible && item?.id === songSheetId
        }"
        v-for="(item, index) in list"
        :key="index"
        @click="handleListChange(item?.id)"
      >
        <div class="item-left">
          <img class="img" :src="item?.coverImgUrl" alt="" />
        </div>
        <div class="item-right">
          <span class="name" :title="item?.name">{{ item?.name }}</span>
          <span class="num">
            {{ item?.trackCount }}首
            <span class="right-desc" v-if="item?.subscribed">
              by {{ item?.creator?.nickname }}
            </span>
          </span>
        </div>
        <div class="item-operate">
          <!-- 是否无法编辑 -->
          <i
            class="operate-icon operate-edit"
            v-if="!item?.cannotEdit"
            title="编辑"
            @click.stop="handeleEdit"
          ></i>
          <!-- 是否无法删除 -->
          <i
            class="operate-icon operate-delete"
            v-if="!item?.cannotDelete"
            title="删除"
            @click.stop="handeleDelete(item?.id)"
          ></i>
        </div>
      </li>
    </ul>
  </div>
  <div>
    <my-dialog
      class="my-dialog"
      :class="{ 'my-dialog-add': dialog.type === 'add' }"
      :visible="dialog.visible"
      :title="dialog.title"
      :confirmtext="dialog.confirmtext"
      showCancelButton
      showConfirmButton
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="content" v-if="dialog?.type === 'add'">
        <div class="form">
          <span class="name">歌单名：</span>
          <input class="input" v-model="dialog.name" type="text" />
        </div>
        <p class="desc">可通过“收藏”将音乐添加到新歌单中</p>
      </div>
      <p class="content" v-else>确定删除歌单？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import MyDialog from '@/components/MyDialog.vue';

type ItemType = {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  subscribed: boolean;
  creator: {
    nickname: string;
  };
  cannotEdit: boolean;
  cannotDelete: boolean;
};

type DialogType = {
  visible: boolean;
  type: string;
  id: number;
  name: string;
  title: string;
  confirmtext: string;
};

defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array as () => ItemType[],
    default: () => []
  },
  listCount: {
    type: Number,
    default: 0
  },
  addBtnShow: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['handleListChange', 'dialogConfirm']);

const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);

// 列表显隐切换
const listShow = ref<boolean>(true);

function listToggle(): void {
  listShow.value = !listShow.value;
}

function handleListChange(id: number): void {
  emits('handleListChange', id);
}

// 歌单收藏
const dialog = reactive<DialogType>({
  visible: false,
  type: 'add',
  id: 0,
  name: '',
  title: '提示',
  confirmtext: '确定'
});

function handleAdd(): void {
  dialog.visible = true;
  dialog.title = '新建歌单';
  dialog.confirmtext = '新建';
  dialog.type = 'add';
  dialog.name = '';
}

function handeleEdit(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handeleDelete(id: number): void {
  dialog.title = '提示';
  dialog.confirmtext = '确定';
  dialog.type = 'delete';
  dialog.id = id;
  dialog.visible = true;
}

function dialogConfirm(): void {
  emits('dialogConfirm', {
    type: dialog.type,
    name: dialog?.name,
    id: dialog?.id
  });
  dialog.visible = false;
}

function dialogCancel(): void {
  dialog.visible = false;
}
</script>

<style lang="less" scoped>
@import url('../option-list.less');
@import url('./song-sheet-toggle.less');
</style>
