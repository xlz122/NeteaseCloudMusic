<template>
  <div class="create-play-dialog">
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

<script lang="ts" setup>
/* eslint-disable */
// @ts-nocheck
import { useContext, defineProps, defineEmit } from 'vue';
import MyDialog from '@/components/MyDialog.vue';
import { addPlayList, deletePlayList } from '@api/my-music';
import { ResponseType } from '@/types/types';

const { playDialogeData } = defineProps({
  playDialogeData: {
    type: Object,
    default: {}
  }
});

defineEmit(['dialogConfirm']);

const { emit } = useContext();

// 对话框 - 确定
function dialogConfirm(): void {
  const params: { type: string, id: number } = {
    type: 'add',
    id: 0
  }
  if (playDialogeData.type === 'add') {
    addPlayList({ name: playDialogeData.name }).then((res: ResponseType) => {
      if (res.code === 200) {
        params.type = 'add';
        params.id = res.id;
        emit('dialogConfirm', params);
      }
    });
  } else {
    deletePlayList({ id: playDialogeData.id }).then((res: ResponseType) => {
      if (res.code === 200) {
        params.type = 'delete';
        params.id = playDialogeData.id;
        emit('dialogConfirm', params);
      }
    });
  }
  playDialogeData.visible = false;
}

// 对话框 - 取消
function dialogCancel(): void {
  playDialogeData.visible = false;
}
</script>

<style lang="less" scoped>
.create-play-dialog {
  ::v-deep(.my-dialog) {
    .my_dialog_box {
      width: 480px;
    }
    .content {
      text-align: center;
      color: #333;
      font-size: 14px;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
  ::v-deep(.my-dialog-add) {
    .my_dialog_bottom {
      margin-left: 86px;
      text-align: left;
    }
    .content {
      color: #333;
      font-size: 14px;
      font-family: Arial, Helvetica, sans-serif;
      text-align: left;
      .form {
        margin-left: 30px;
        .name {
          display: inline-block;
          vertical-align: middle;
        }
        .input {
          display: inline-block;
          vertical-align: middle;
          width: 330px;
          height: 19px;
          margin: 0;
          padding: 5px 6px 6px;
          border: 1px solid #cdcdcd;
          border-radius: 2px;
          line-height: 19px;
          box-sizing: content-box;
          outline: none;
        }
      }
      .desc {
        margin: 8px 0 20px 86px;
        color: #999;
      }
    }
  }
}
</style>
