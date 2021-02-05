<template>
  <div class="progress" ref="progressRef" @click="handleProgressClick">
    <div class="current-progress" ref="currentProgressRef">
      <i class="icon" ref="progressIconRef"></i>
      <i class="icon-loading" v-if="loading"></i>
    </div>
    <div class="total-progress" ref="cacheProgressRef"></div>
  </div>
  <div class="time">
    <span class="duration">
      {{ timeStampToDuration(progressData.currentTime) || '00:00' }}
    </span>
    <span class="total-duration">
      / {{ timeStampToDuration(progressData.duration) || '00:00' }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from 'vue';
import { timeStampToDuration } from '@utils/utils';
import { LoopType } from '@/types/types';

export default defineComponent({
  props: ({
    // 加载loading
    loading: {
      type: Boolean,
      default: false
    },
    progressData: {
      type: Object,
      default: {}
    },
    // 是否停止加载进度
    stopProgress: {
      type: Boolean,
      default: false
    }
  } as unknown) as undefined,
  emits: ['handleProgressChange'],
  setup(props: { progressData: LoopType; stopProgress: boolean }, { emit }) {
    // 当前进度距离左边距离
    const currentLeft = ref<number>(0);
    // 总进度 当前进度 进度图标
    const progressRef = ref<HTMLElement>();
    const currentProgressRef = ref<HTMLElement>();
    const progressIconRef = ref<HTMLElement>();
    const cacheProgressRef = ref<HTMLElement>();
    // 鼠标是否按下
    const isMouseDown = ref<boolean>(false);

    // 监听进度
    watch(
      () => props.progressData.progress,
      (curVal: number) => {
        // 是否停止加载进度
        if (!props.stopProgress) {
          (currentProgressRef.value as HTMLElement).style.width = curVal + '%';
        }
      }
    );

    // 监听缓存进度
    watch(
      () => props.progressData.cacheProgress,
      (curVal: number) => {
        // 是否停止加载进度
        (cacheProgressRef.value as HTMLElement).style.width = curVal + '%';
      }
    );

    // 进度点击
    function handleProgressClick(e: MouseEvent): boolean | undefined {
      // 点击进度图标
      const target = e.target as HTMLElement;
      if (target.className === 'icon') {
        return false;
      }
      const progressWidth = (progressRef.value as HTMLElement).offsetWidth;
      (currentProgressRef.value as HTMLElement).style.width =
        (e.offsetX / progressWidth) * 100 + '%';
      // 进度更新
      emit('handleProgressChange', e.offsetX / progressWidth);
    }

    // 监听鼠标按下事件
    function mousedown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.className === 'icon') {
        isMouseDown.value = true;
        currentLeft.value =
          e.clientX - (progressIconRef.value as HTMLElement)?.offsetLeft;
      }
    }

    // 监听鼠标移动事件
    function mousemove(e: MouseEvent): void {
      if (isMouseDown.value) {
        // 12为圆点宽度一半
        let moveX = e.clientX - currentLeft.value + 12;
        const progressWidth = (progressRef.value as HTMLElement).offsetWidth;
        if (moveX >= progressWidth) {
          moveX = progressWidth;
        }
        if (moveX <= 0) {
          moveX = 0;
        }
        (currentProgressRef.value as HTMLElement).style.width =
          (moveX / progressWidth) * 100 + '%';
        // 进度更新
        emit('handleProgressChange', moveX / progressWidth);
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
      timeStampToDuration,
      progressRef,
      currentProgressRef,
      progressIconRef,
      cacheProgressRef,
      handleProgressClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-progress-bar.less';
</style>
