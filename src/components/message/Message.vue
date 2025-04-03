<template>
  <div class="message-sysmsg" v-if="messageTip.visible">
    <div class="sysmsg">
      <i
        class="icon"
        :class="[
          { 'info-icon': message.type === 'info' },
          { 'error-icon': message.type === 'error' }
        ]"
      ></i>
      <span class="text">{{ message.title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import useMessage from '@/hooks/useMessage';

type MessageTip = {
  visible: boolean;
  timer: number | null;
};

// 获取提示数据
const message = useMessage();

const messageTip = reactive<MessageTip>({
  visible: false,
  timer: null
});

watch(
  () => message,
  () => {
    messageTip.visible = true;

    messageTip.timer && clearTimeout(messageTip.timer);

    messageTip.timer = setTimeout(() => {
      messageTip.visible = false;
    }, message.time);
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
.message-sysmsg {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20220405;
  width: 280px;
  background-color: #fff;
  border: 1px solid #c0c0c0;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 10px rgb(0 0 0 / 40%);

  .sysmsg {
    padding: 12px 16px;
    text-align: center;
    background-color: #fff;
    border: 1px solid #fcfcfc;

    .icon {
      display: inline-block;
      width: 24px;
      height: 24px;
      vertical-align: middle;
      background: url('@/assets/image/icon.png');
    }

    .info-icon {
      background-position: -24px -426px;
    }

    .error-icon {
      background-position: -24px -403px;
    }

    .text {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
