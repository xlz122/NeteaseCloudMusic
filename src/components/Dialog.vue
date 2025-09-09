<template>
  <div class="dialog" v-if="visible">
    <div class="dialog-mask"></div>
    <div class="dialog-box" v-drag>
      <div class="dialog-title">
        {{ title }}
        <span class="dialog-close" @click="cancel">x</span>
      </div>
      <div class="dialog-content">
        <slot></slot>
      </div>
      <div class="dialog-bottom" v-if="showConfirmButton ?? showCancelButton">
        <button class="btn confirm-btn" v-if="showConfirmButton" @click="confirm">
          <span class="icon">{{ confirmtext }}</span>
        </button>
        <button class="btn cancel-btn" v-if="showCancelButton" @click="cancel">
          <span class="icon">{{ canceltext }}</span>
        </button>
      </div>
      <div class="custom" v-if="showCustomButton">
        <button class="f12 text-white outline-none" @click="cancel">
          {{ customText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { drag } from '@/utils/drag';

defineOptions({
  directives: {
    drag
  }
});
defineProps({
  visible: {
    type: Boolean,
    default: false
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
  customText: {
    type: String,
    default: '我知道了'
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showCustomButton: {
    type: Boolean,
    default: false
  }
});
const eimts = defineEmits(['confirm', 'cancel']);

function confirm(): void {
  eimts('confirm');
}

function cancel(): void {
  eimts('cancel');
}
</script>

<style lang="less" scoped>
.dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20001009;
}

.dialog-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  opacity: 0.5;
}

.dialog-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 530px;
  max-width: 100%;
  overflow: hidden;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  box-shadow: 0 5px 16px rgb(0 0 0 / 80%);
}

.dialog-content {
  position: relative;
  padding-top: 38px;
  overflow-x: hidden;
  overflow-y: auto;
}

.dialog-title {
  position: relative;
  top: 0;
  left: 0;
  height: 38px;
  padding: 0 31px 0 18px;
  overflow: hidden;
  font-family: '\5fae\8f6f\96c5\9ed1', sans-serif;
  font-size: 14px;
  font-weight: bold;
  line-height: 40px;
  color: #fff;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
  cursor: all-scroll;
  background-color: #2d2d2d;
  border: 1px solid #191919;
  user-select: none;
}

.dialog-close {
  position: absolute;
  top: 16px;
  right: 20px;
  z-index: 20;
  width: 10px;
  height: 10px;
  overflow: hidden;
  text-indent: -9999px;
  cursor: pointer;
  background: url('@/assets/image/dialog.png');
  background-position: 0 -95px;
}

.dialog-close:hover {
  color: #ccc;
}

.dialog-bottom {
  margin: 0;
  text-align: center;
  border-top: 1px solid transparent;
}

.btn {
  height: 31px;
  min-width: 60px;
  margin-top: 30px;
  margin-bottom: 35px;
  font-size: 14px;
  line-height: 31px;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  border: none;
  border-radius: 3px;
  border-radius: 3px;
  outline: none;
}

.dialog-bottom .confirm-btn .margin-left {
  margin-left: 10px;
}

.confirm-btn {
  padding: 0 5px 0 0;
  color: #fff;
  background: url('@/assets/image/icon-button.png') no-repeat;
  background-position: right -428px;

  .icon {
    display: inline-block;
    padding: 0 23px 0 28px;
    background: url('@/assets/image/icon-button.png') no-repeat;
    background-position: 0 -387px;
  }
}

.confirm-btn:hover {
  background-position: right -510px;

  .icon {
    background-position: 0 -469px;
  }
}

.cancel-btn {
  padding: 0 5px 0 0;
  color: #333;
  background: url('@/assets/image/icon-button.png') no-repeat;
  background-position: right -100px;

  .icon {
    display: inline-block;
    padding: 0 23px 0 28px;
    background: url('@/assets/image/icon-button.png') no-repeat;
    background-position: 0 -59px;
  }
}

.cancel-btn:hover {
  background-position: right -182px;

  .icon {
    background-position: 0 -141px;
  }
}

button + button {
  margin-left: 15px;
}

.custom {
  height: 40px;
  padding-top: 12px;
  text-align: center;
  background-color: #f7f7f7;
  border-top: 1px solid #c6c6c6;

  button {
    display: inline-block;
    height: 31px;
    padding: 0 15px;
    overflow: hidden;
    line-height: 31px;
    text-align: center;
    vertical-align: top;
    cursor: pointer;
    background: url('@/assets/image/icon-button.png') no-repeat;
    border: none;
    border-radius: 3px;
    background-position: right -387px;
  }
}
</style>
