<template>
  <div class="progress" ref="progressRef" @click="handleProgressClick">
    <div class="current-progress" ref="currentProgressRef">
      <i class="icon icon-audio" ref="progressIconRef"></i>
      <i class="icon-loading" v-if="playStatus?.loading"></i>
    </div>
    <div class="total-progress" ref="cacheProgressRef"></div>
  </div>
  <div class="time">
    <span class="duration">
      {{ timeStampToDuration(playProgress.currentTime || 0) || '00:00' }}
    </span>
    <span class="total-duration">
      / {{ timeStampToDuration(playProgress.duration || 0) || '00:00' }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { timeStampToDuration } from '@utils/utils';
import type { LoopType } from '@/types/types';

export default defineComponent({
  props: {
    playStatus: {
      typs: Object,
      default: {}
    },
    playProgress: {
      typs: Object,
      default: {}
    }
  },
  emits: ['progressChange'],
  setup(props: { playProgress: LoopType }, { emit }) {
    // 当前进度距离左边距离
    const currentLeft = ref<number>(0);
    // 总进度 当前进度 进度图标
    const progressRef = ref<HTMLElement>();
    const currentProgressRef = ref<HTMLElement>();
    const progressIconRef = ref<HTMLElement>();
    const cacheProgressRef = ref<HTMLElement>();
    // 鼠标是否按下
    const isMouseDown = ref<boolean>(false);

    // 是否拖动
    const isDrag = ref<boolean>(false);

    // 拖动时当前进度
    const currentProgress = ref<number>(0);

    // 监听进度数据
    watch(
      () => props.playProgress,
      curVal => {
        // 拖动时停止更新进度条
        if (isDrag.value) {
          return false;
        }
        // 更新进度条
        (currentProgressRef.value as HTMLElement).style.width =
          curVal.progress + '%';
        // 更新缓存进度
        (cacheProgressRef.value as HTMLElement).style.width =
          curVal.cacheProgress + '%';
      }
    );

    // 进度点击
    function handleProgressClick(e: MouseEvent): boolean | undefined {
      // 点击进度图标
      const target = e.target as HTMLElement;
      if (target.className === 'icon icon-audio') {
        return false;
      }
      const progressWidth = (progressRef.value as HTMLElement).offsetWidth;
      (currentProgressRef.value as HTMLElement).style.width =
        (e.offsetX / progressWidth) * 100 + '%';
      // 拖动
      isDrag.value = false;
      // 点击进度更新
      if (!isDrag.value) {
        emit('progressChange', e.offsetX / progressWidth);
      }
    }

    // 监听鼠标按下事件
    function mousedown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.className === 'icon icon-audio') {
        isMouseDown.value = true;
        currentLeft.value =
          e.clientX - (progressIconRef.value as HTMLElement)?.offsetLeft;
      }
    }

    // 监听鼠标移动事件
    function mousemove(e: MouseEvent): void {
      // buttons 1为鼠标左键按下移动
      if (e.buttons === 1 && isMouseDown.value) {
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
        // 拖动
        isDrag.value = true;
        // 当前进度存储
        currentProgress.value = moveX / progressWidth;
      }
    }

    // 监听鼠标放开事件
    function mouseup(): void {
      isMouseDown.value = false;
      // 拖动进度更新
      if (isDrag.value) {
        emit('progressChange', currentProgress.value);
        // 拖动
        isDrag.value = false;
      }
    }

    onMounted(() => {
      const progressContainer = document.querySelector(
        '#musicAudio .wrap'
      ) as HTMLAudioElement;

      // 监听鼠标按下事件
      progressContainer.addEventListener('mousedown', mousedown);
      // 监听鼠标移动事件
      progressContainer.addEventListener('mousemove', mousemove);
      // 监听鼠标放开事件
      progressContainer.addEventListener('mouseup', mouseup);
    });

    onBeforeUnmount(() => {
      const progressContainer = document.querySelector(
        '#musicAudio .wrap'
      ) as HTMLAudioElement;

      // 移除监听鼠标按下事件
      progressContainer.removeEventListener('mousedown', mousedown);
      // 移除监听鼠标移动事件
      progressContainer.removeEventListener('mousemove', mousemove);
      // 移除监听鼠标放开事件
      progressContainer.removeEventListener('mouseup', mouseup);
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
@import './play-progress.less';
</style>
