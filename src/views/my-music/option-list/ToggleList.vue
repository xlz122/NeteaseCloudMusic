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
        @click="listAdd"
      >
        新建
      </div>
    </div>
    <ul class="list" v-if="listShow">
      <li
        class="item"
        :class="{ 'active-item': item.id === activeSongListId }"
        v-for="(item, index) in propsListData"
        :key="index"
        @click="listClick(item.id)"
      >
        <div class="item-left">
          <img class="img" :src="item.coverImgUrl" alt="" />
        </div>
        <div class="item-right">
          <span class="name">{{ item.name }}</span>
          <span class="num">{{ item.trackCount }}首</span>
        </div>
        <div class="item-operate">
          <!-- 是否无法编辑 -->
          <i class="operate-icon operate-edit" v-if="!item.cannotEdit"></i>
          <!-- 是否无法删除 -->
          <i
            class="operate-icon operate-delete"
            v-if="!item.cannotDelete"
            @click="listDelete(item.id, $event)"
          ></i>
        </div>
      </li>
    </ul>
  </div>
  <teleport to="#modal">
    <song-dialog :dialogeData="dialogeData" @dialogConfirm="dialogConfirm" />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import SongDialog from './SongDialog.vue';
import { addPlayList, deletePlayList } from '@api/my-music';
import { ResponseType, LoopType } from '@/types/types';

interface DialogData {
  visible: boolean;
  type: string;
  title: string;
  confirmtext: string;
  name: string;
  id: number;
}

export default defineComponent({
  components: {
    SongDialog
  },
  props: ({
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 列表数量
    listCount: {
      type: Number,
      default: 0
    },
    // 列表数据
    listData: {
      type: Array,
      default: []
    },
    // 新建按钮
    addBtnShow: {
      type: Boolean,
      default: false
    }
  } as unknown) as undefined,
  emits: ['listClick'],
  setup(props: { listData: LoopType }, { emit }) {
    const propsListData = ref<LoopType>(props.listData);

    const $store = useStore();

    // 当前选中列表id
    const activeSongListId = computed(() => $store.getters.activeSongListId);

    // 列表显隐切换
    const listShow = ref<boolean>(true);
    function listToggle(): void {
      listShow.value = !listShow.value;
    }

    // 歌单 - 对话框数据
    const dialogeData = reactive<DialogData>({
      visible: false,
      type: 'add',
      title: '提示',
      confirmtext: '确定',
      name: '', // 歌单名称
      id: 0 // 歌单id
    });

    // 列表新建
    function listAdd(): void {
      dialogeData.visible = true;
      dialogeData.title = '新建歌单';
      dialogeData.confirmtext = '新建';
      dialogeData.type = 'add';
      dialogeData.name = '';
    }

    // 列表删除
    function listDelete(id: number, event: MouseEvent): void {
      event.stopPropagation();
      dialogeData.visible = true;
      dialogeData.title = '提示';
      dialogeData.confirmtext = '确定';
      dialogeData.type = 'delete';
      dialogeData.id = id;
    }

    // 歌单 - 对话框确定
    function dialogConfirm(params: { type: string; name: string }): void {
      // 添加
      if (params.type === 'add') {
        addPlayList({ name: params.name }).then((res: ResponseType) => {
          if (res.code === 200) {
            // 添加到列表第二项
            propsListData.value.splice(1, 1, res.playlist);
            // 获取歌单详情
            const id = res.id;
            emit('listClick', id);
          }
        });
      }

      // 删除
      if (params.type === 'delete') {
        deletePlayList({ id: dialogeData.id }).then((res: ResponseType) => {
          if (res.code === 200) {
            // 获取上一项id
            const index = propsListData.value.findIndex(
              (item: LoopType) => item.id === dialogeData.id
            );
            // 删除列表项
            propsListData.value.splice(index, 1);
            // 获取歌单详情
            const id = propsListData.value[index - 1].id;
            emit('listClick', id);
          }
        });
      }
    }

    // 列表点击
    function listClick(id: number): void {
      emit('listClick', id);
    }
    return {
      propsListData,
      activeSongListId,
      listShow,
      listToggle,
      dialogeData,
      listAdd,
      listDelete,
      dialogConfirm,
      listClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
