<template>
  <div class="volume-progress-bar" ref="progressRef" @click="handleProgressClick">
    <div class="current-progress" ref="currentProgressRef">
      <i class="volume-icon" ref="progressIconRef"></i>
    </div>
    <div class="total-progress"></div>
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
        console.log(e);
        isMouseDown.value = true;
        currentTop.value = e.offsetY;
        console.log(currentTop.value);
      }
    }

    // 监听鼠标移动事件
    function mousemove(e: MouseEvent): void {
      // if (isMouseDown.value) {
      //   // 12为圆点宽度一半
      //   let moveX = e.clientX - currentLeft.value + 12;
      //   const progressWidth = (progressRef.value as HTMLElement).offsetWidth;
      //   if (moveX >= progressWidth) {
      //     moveX = progressWidth;
      //   }
      //   if (moveX <= 0) {
      //     moveX = 0;
      //   }
      //   (currentProgressRef.value as HTMLElement).style.width =
      //     (moveX / progressWidth) * 100 + '%';
      // }
    }

    // 监听鼠标放开事件
    function mouseup(): void {
      // isMouseDown.value = false;
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