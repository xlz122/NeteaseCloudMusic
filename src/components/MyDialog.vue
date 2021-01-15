<template>
  <div class="my_dialog" v-if="visible">
    <!-- 遮罩层 -->
    <div class="my_dialog_mask"></div>
    <div class="my_dialog_box" id="my_dialog_box" v-drag>
      <!-- 标题 -->
      <div class="my_dialog_title">
        {{ title }}
        <span class="my_dialog_close" @click="cancel">x</span>
      </div>
      <!-- 内容 -->
      <div class="my_dialog_content">
        <slot></slot>
      </div>
      <!-- 底部按钮 -->
      <div class="my_dialog_bottom">
        <button class="btn cancelBtn" v-if="showCancelButton" @click="cancel">
          {{ canceltext }}
        </button>
        <button
          class="btn confirmBtn"
          v-if="showConfirmButton"
          @click="confirm"
        >
          {{ confirmtext }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable */
import { useContext, defineProps, defineEmit } from 'vue';
import { drag } from '@utils/drag.ts';

defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: '提示'
  },
  confirmtext: {
    type: String,
    default: '确定'
  },
  canceltext: {
    type: String,
    default: '取消'
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  }
});

defineEmit(['cancel', 'confirm']);

const { emit } = useContext();

// 关闭
function cancel(): void {
  emit('cancel');
}

// 确认
function confirm(): void {
  emit('confirm');
}
</script>

<style lang="less" scoped>
.my_dialog {
  position: fixed;
  z-index: 951218;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.my_dialog_mask {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: transparent;
  opacity: 0.5;
}
.my_dialog_box {
  position: absolute;
  width: 530px;
  background: #fff;
  top: 50%;
  left: 50%;
  max-width: 100%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  border: none;
  border-radius: 4px;
  box-shadow: 0 5px 16px rgba(0,0,0,0.8);
}
.my_dialog_content {
  min-height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding-top: 38px;
  text-align: left;
  box-sizing: border-box;
}
.my_dialog_title {
  cursor: all-scroll;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  top: 0;
  left: 0;
  height: 38px;
  line-height: 40px;
  padding: 0 31px 0 18px;
  border: 1px solid #191919;
  background: #2d2d2d;
  font-family: \5fae\8f6f\96c5\9ed1;
  text-align: left;
  user-select: none;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
}
.my_dialog_close {
  cursor: pointer;
  position: absolute;
  top: 50%;
  margin-top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 16px;
  color: #ccc;
}
.my_dialog_close:hover {
  color: #ccc;
}
.my_dialog_bottom {
  margin: 0;
  text-align: center;
  border-top: 1px solid transparent;
}
.btn {
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  font-size: 14px;
  padding: 5px 15px;
  border-radius: 3px;
  text-decoration: none;
  border-radius: 3px;
  cursor: pointer;
}
.my_dialog_bottom .cancelBtn:focus,
.my_dialog_bottom .cancelBtn:hover {
  color: #409eff;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
}
.my_dialog_bottom .confirmBtn:focus,
.my_dialog_bottom .confirmBtn:hover {
  background: #66b1ff;
  border: 1px solid #66b1ff;
  color: #fff;
}
.my_dialog_bottom .confirm_btn .marginLeft {
  margin-left: 10px;
}
.cancelBtn {
  border: 1px solid #dcdfe6;
  background-color: #fff;
  color: #606266;
}
.confirmBtn {
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #fff;
}
button + button {
  margin-left: 15px;
}
</style>
