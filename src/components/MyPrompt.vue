<template>
  <div class="prompt" v-if="dialogShow">
    <div class="prompt-mask"></div>
    <div class="prompt-box" id="my-dialog-box">
      <div class="prompt-box">
        <i class="okfail-icon" :class="icon === 'error' ? 'fail-icon' : ''"></i>
        <p class="f14 text-white tc" v-if="content">{{ content }}</p>
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from 'vue';

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: '提示'
    },
    icon: {
      type: String,
      default: 'success'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { show } = toRefs(props);
    const dialogShow = ref(show.value);
    watch(
      () => show.value,
      val => {
        dialogShow.value = val;
        if (val) close();
      }
    );
    // 关闭
    function close(): void {
      setTimeout(() => {
        dialogShow.value = false;
        emit('close', dialogShow.value);
      }, 1000);
    }
    return {
      dialogShow
    };
  }
});
</script>

<style lang="less" scoped>
.prompt {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20001009;
}

.prompt-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  opacity: 0.5;
}

.prompt-box {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10000;
  width: 180px;
  min-height: 116px;
  color: #fff;
  text-align: center;
  background: rgb(0 0 0 / 55%);
  border-radius: 6px;
  transform: translate(-50%, -50%);

  .okfail-icon {
    display: inline-block;
    width: 35px;
    height: 35px;
    margin: 27px 0 6px;
    background: url('~@/assets/image/user/prompt-icon.png') no-repeat;
    background-size: 35px auto;

    &.fail-icon {
      background-position: 0 -40px;
    }
  }
}
</style>
