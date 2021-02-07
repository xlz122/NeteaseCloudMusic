<template>
  <div
    class="volume-progress-bar"
    ref="progressRef"
    @click="handleProgressClick"
  >
    <div class="current-progress" ref="currentProgressRef"></div>
    <div class="volume-icon" ref="progressIconRef"></div>
  </div>
  <div class="volume-progress-bar-bg"></div>
</template>

<script lang="ts">
/* eslint-disable */
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  emits: ['volumeChange'],
  setup() {
    // 总进度 当前进度 进度图标
    const progressRef = ref<HTMLElement>();
    const currentProgressRef = ref<HTMLElement>();
    const progressIconRef = ref<HTMLElement>();
    // 当前进度距离顶部距离
    const currentTop = ref<number>(0);
    // 鼠标是否按下
    const isMouseDown = ref<boolean>(false);

    // 初始化音量进度条
    const $store = useStore();
    const musicVolume = computed(() => $store.getters['music/musicVolume']);
    onMounted(() => {
      // 设置当前高度
      (currentProgressRef.value as HTMLElement).style.height =
        musicVolume.value * 100 + '%';
      // 设置滑块的top
      const progressHeight = (progressRef.value as HTMLElement).offsetHeight;
      const progressIcon = progressIconRef.value as HTMLElement;
      let iconTop = ((1 - musicVolume.value) * progressHeight) - (progressIcon.offsetHeight / 2);
      // 滑到底部
      if (iconTop >= progressHeight - progressIcon.offsetHeight) {
        iconTop = progressHeight - progressIcon.offsetHeight;
      }
      // 顶部
      if (iconTop <= 0) {
        iconTop = 0;
      }
      progressIcon.style.top = iconTop + 'px';
    });

    // 音量百分比
    const volumePer = ref<number>(0);

    // 监听进度变更
    watch(
      () => volumePer.value,
      (curVal: number) => {
        $store.commit('music/setMusicVolume', Number((curVal / 100).toFixed(1)));
      }
    );

    // 进度点击
    function handleProgressClick(e: MouseEvent): boolean | undefined {
      // 点击进度图标
      const target = e.target as HTMLElement;
      if (target.className === 'volume-icon') {
        return false;
      }
      const progressHeight = (progressRef.value as HTMLElement).offsetHeight;
      const iconOffsetHeight =
        (progressIconRef.value as HTMLElement).offsetHeight;
      // 设置当前高度
      const currentProgress = currentProgressRef.value as HTMLElement;
      currentProgress.style.height =
        ((progressHeight - e.offsetY) / progressHeight) * 100 + '%';
      // 设置滑块的top
      const progressIcon = progressIconRef.value as HTMLElement;
      progressIcon.style.top = e.offsetY - iconOffsetHeight / 2 + 'px';
      // 存储音量百分比
      volumePer.value = ((progressHeight - e.offsetY) / progressHeight) * 100;
    }

    // 监听鼠标按下事件
    function mousedown(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (target.className === 'volume-icon') {
        isMouseDown.value = true;
        // 页面事件的Y减去当前相对于最近的祖先定位元素
        currentTop.value =
          e.clientY - (progressIconRef.value as HTMLElement).offsetTop;
      }
    }

    // 监听鼠标移动事件
    function mousemove(e: MouseEvent): void {
      if (isMouseDown.value) {
        // 获取移动的距离
        let moveY = e.clientY - currentTop.value;
        const progressHeight = (progressRef.value as HTMLElement).offsetHeight;
        const iconOffsetHeight = (progressIconRef.value as HTMLElement).offsetHeight;
        // 滑到底部
        if (moveY >= progressHeight - iconOffsetHeight) {
          moveY = progressHeight - iconOffsetHeight;
        }
        // 滑到顶部
        if (moveY <= 0) {
          moveY = 0;
        }
        // 设置当前高度
        const currentProgress = currentProgressRef.value as HTMLElement;
        currentProgress.style.height =
          (progressHeight - iconOffsetHeight - moveY) /
            (progressHeight - iconOffsetHeight) * 100 + '%';
        // 设置滑块的top
        const progressIcon = progressIconRef.value as HTMLElement;
        progressIcon.style.top = moveY + 'px';
        // 存储音量百分比
        volumePer.value =
          (progressHeight - iconOffsetHeight - moveY) /
            (progressHeight - iconOffsetHeight) * 100;
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
@import './volume-progress.less';
</style>
