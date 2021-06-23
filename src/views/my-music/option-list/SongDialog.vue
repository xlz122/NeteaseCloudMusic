<template>
  <!-- 使用 ::v-deep() 更改组件样式，必须包裹一层容器 -->
  <div>
    <my-dialog
      class="my-dialog"
      :class="{ 'my-dialog-add': dialogeData.type === 'add' }"
      :visible="songDialogeShow"
      :title="dialogeData.title"
      :confirmtext="dialogeData.confirmtext"
      showCancelButton
      showConfirmButton
      @confirm="dialogConfirm"
      @cancel="dialogCancel"
    >
      <div class="content" v-if="dialogeData.type === 'add'">
        <div class="form">
          <span class="name">歌单名：</span>
          <input class="input" v-model="songName" type="text" />
        </div>
        <p class="desc">可通过“收藏”将音乐添加到新歌单中</p>
      </div>
      <p class="content" v-else>确定删除歌单？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  components: {
    MyDialog
  },
  props: {
    dialogeData: {
      type: Object,
      default: () => ({
        visible: false,
        type: 'add',
        title: '提示',
        confirmtext: '确定',
        name: '', // 歌单名称
        id: 0 // 歌单id
      })
    }
  },
  emits: ['dialogConfirm', 'dialogCancel'],
  setup(props, { emit }) {
    const { dialogeData } = toRefs(props);

    // 歌单名称
    const songName = ref<string>('');
    // 弹框
    const songDialogeShow = ref<boolean>(false);

    // 监听弹框打开/关闭
    watch(
      () => dialogeData.value.visible,
      (curVal: boolean) => {
        songDialogeShow.value = curVal;
      }
    );

    // 对话框 - 确定
    function dialogConfirm(): void {
      const params: { type: string; name: string } = {
        type: 'add',
        name: songName.value
      };
      if (dialogeData.value.type === 'add') {
        params.type = 'add';
      } else {
        params.type = 'delete';
      }
      emit('dialogConfirm', params);
    }

    // 对话框 - 取消
    function dialogCancel(): void {
      emit('dialogCancel', false);
    }

    return {
      songDialogeShow,
      songName,
      dialogConfirm,
      dialogCancel
    };
  }
});
</script>

<!-- // /* eslint-disable */
// import { useContext, defineProps, defineEmit, watch } from 'vue';
// import MyDialog from '@/components/MyDialog.vue';

// const props = defineProps({
//   dialogeData: {
//     type: Object,
//     default: {
//       visible: false,
//       type: 'add',
//       title: '提示',
//       confirmtext: '确定',
//       name: '', // 歌单名称
//       id: 0 // 歌单id
//     }
//   },
// });

// const { dialogeData } = props;

// defineEmit(['dialogConfirm']);

// const { emit } = useContext();

// // 对话框 - 确定
// function dialogConfirm(): void {
//   const params: { type: string; name: string } = {
//     type: 'add',
//     name: dialogeData.name
//   };
//   if (dialogeData.type === 'add') {
//     params.type = 'add';
//   } else {
//     params.type = 'delete';
//   }
//   emit('dialogConfirm', params);
//   dialogeData.visible = false;
// }

// // 对话框 - 取消
// function dialogCancel(): void {
//   dialogeData.visible = false;
// }
// </script>-->

<style lang="less" scoped>
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
</style>
