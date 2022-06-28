<template>
  <div class="message-sysmsg" v-if="messageShow">
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

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import type { Message } from '@store/state';

export default defineComponent({
  name: 'MessageView',
  setup() {
    const $store = useStore();

    // 提示数据
    const message = computed<Message>(() => $store.getters.message);

    const messageShow = ref<boolean>(false);

    // 提示定时器
    const timer = ref<number>(0);

    watch(
      () => message.value,
      () => {
        messageShow.value = true;
        // 有新消息时,重新计时
        if (timer.value) {
          clearTimeout(timer.value);
          timer.value = setTimeout(() => {
            messageShow.value = false;
          }, message.value.time);
        } else {
          timer.value = setTimeout(() => {
            messageShow.value = false;
          }, message.value.time);
        }
      }
    );
    return {
      message,
      messageShow
    };
  }
});
</script>

<style lang="less" scoped>
.message-sysmsg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20220405;
  width: 280px;
  border: 1px solid #c0c0c0;
  background-color: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);

  .sysmsg {
    padding: 12px 16px;
    border: 1px solid #fcfcfc;
    text-align: center;
    background-color: #fff;
    .icon {
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
      background: url(~@/assets/image/icon.png);
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
