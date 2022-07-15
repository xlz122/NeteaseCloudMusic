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
      :class="{ 'my-dialog-add': dialogeData.type === 'add' }"
      :visible="dialogeData.visible"
      :title="dialogeData.title"
      :confirmtext="dialogeData.confirmtext"
      showCancelButton
      showConfirmButton
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="content" v-if="dialogeData?.type === 'add'">
        <div class="form">
          <span class="name">歌单名：</span>
          <input class="input" v-model="dialogeData.name" type="text" />
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
import { setMessage } from '@/components/message/useMessage';
import MyDialog from '@/components/MyDialog.vue';

type DialogData = {
  visible: boolean;
  type: string;
  title: string;
  confirmtext: string;
  name?: string;
  id: number;
};

export default defineComponent({
  name: 'ToggleView',
  components: {
    MyDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    },
    listCount: {
      type: Number,
      default: 0
    },
    // 新建按钮
    addBtnShow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['handleListChange', 'dialogConfirm'],
  setup(props, { emit }) {
    const $store = useStore();

    const songSheetId = computed<number>(() => $store.getters.songSheetId);

    // 列表显隐切换
    const listShow = ref<boolean>(true);
    function listToggle(): void {
      listShow.value = !listShow.value;
    }

    function handleListChange(id: number): void {
      emit('handleListChange', id);
    }

    const dialogeData = reactive<DialogData>({
      visible: false,
      type: 'add',
      title: '提示',
      confirmtext: '确定',
      name: '',
      id: 0
    });

    function handleAdd(): void {
      dialogeData.visible = true;
      dialogeData.title = '新建歌单';
      dialogeData.confirmtext = '新建';
      dialogeData.type = 'add';
      dialogeData.name = '';
    }

    function handeleEdit(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    function handeleDelete(id: number): void {
      dialogeData.title = '提示';
      dialogeData.confirmtext = '确定';
      dialogeData.type = 'delete';
      dialogeData.id = id;
      dialogeData.visible = true;
    }

    function dialogConfirm(): void {
      emit('dialogConfirm', {
        type: dialogeData.type,
        name: dialogeData?.name,
        id: dialogeData?.id
      });
      dialogeData.visible = false;
    }

    function dialogCancel(): void {
      dialogeData.visible = false;
    }

    return {
      songSheetId,
      listShow,
      listToggle,
      handleListChange,
      dialogeData,
      handleAdd,
      handeleEdit,
      handeleDelete,
      dialogConfirm,
      dialogCancel
    };
  }
});
</script>

<style lang="less" scoped>
@import url('../option-list.less');
@import url('./song-sheet-toggle.less');
</style>
