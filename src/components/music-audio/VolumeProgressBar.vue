<template>
  <div class="volume-progress-bar">
    <div class="volume-progress" ref="progressRef" @click="handleProgressClick">
      <div class="current-progress" ref="currentProgressRef">
        <i class="volume-icon" ref="progressIconRef"></i>
      </div>
    </div>
    <div class="volume-progress-bar-bg"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  setup() {
    // 当前进度距离顶部距离
    const currentTop = ref<number>(0);
    // 总进度 当前进度 进度图标
    const progressRef = ref<HTMLElement>();
    const currentProgressRef = ref<HTMLElement>();
    const progressIconRef = ref<HTMLElement>();
    // 鼠标是否按下
    const isMouseDown = ref<boolean>(false);

    // 进度点击
    function handleProgressClick(e: MouseEvent): boolean | undefined {
      // 点击进度图标
      const target = e.target as HTMLElement;
      if (target.className === 'volume-icon') {
        return false;
      }
      const progressHeight = (progressRef.value as HTMLElement).offsetHeight;
      (currentProgressRef.value as HTMLElement).style.height =
        ((progressHeight - e.offsetY) / progressHeight) * 100 + '%';
    }

    // 监听鼠标按下事件
    function mousedown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.className === 'volume-icon') {
        isMouseDown.value = true;
        currentTop.value = e.offsetY;
      }
    }

    // 监听鼠标移动事件
    function mousemove(e: MouseEvent): void {
      if (isMouseDown.value) {
        const target = e.target as HTMLElement;
        if (target.className === 'volume-progress-bar-bg') {
          let moveY = e.offsetY - currentTop.value;
          console.log(e);
          console.log(moveY);
          const progressHeight = (progressRef.value as HTMLElement).offsetHeight;
          if (moveY >= progressHeight) {
            moveY = progressHeight;
          }
          if (moveY <= 0) {
            moveY = 0;
          }
          (currentProgressRef.value as HTMLElement).style.height =
            ((progressHeight - moveY) / progressHeight) * 100 + '%';
        } else if (target.className === 'current-progress') {
          console.log(e);
          
        }
      }
    }

    // 监听鼠标放开事件
    function mouseup(): void {
      isMouseDown.value = false;
    }

    onMounted(() => {
      // 监听鼠标按下事件
      document.addEventListener('mousedown', mousedown);
      // 监听鼠标移动事件
      document.addEventListener('mousemove', mousemove);
      // 监听鼠标放开事件
      document.addEventListener('mouseup', mouseup);
    });
    onUnmounted(() => {
      // 移除监听鼠标按下事件
      document.removeEventListener('mousedown', mousedown);
      // 移除监听鼠标移动事件
      document.removeEventListener('mousemove', mousemove);
      // 移除监听鼠标放开事件
      document.removeEventListener('mouseup', mouseup);
    });
    return {
      progressRef,
      currentProgressRef,
      progressIconRef,
      handleProgressClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './music-audio.less';
</style>