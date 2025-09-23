<template>
  <div id="VerticalProgress" class="progress" @click="handleProgressClick">
    <div class="current-progress" ref="currentProgressRef" :style="{ height: currentProgress }">
      <i class="icon-round" ref="roundProgressRef"></i>
    </div>
    <div class="total-progress" ref="totalProgressRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

type ProgressRef = HTMLDivElement | HTMLElement | null;

const props = defineProps({
  // 当前进度
  current: {
    type: String,
    default: ''
  },
  // 拖动生效范围
  range: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['progressChange']);

const roundProgressRef = ref<ProgressRef>(null);
const currentProgressRef = ref<ProgressRef>(null);
const totalProgressRef = ref<ProgressRef>(null);

/**
 * initOffest 初始偏移量
 * current 当前进度
 * isDown 鼠标左键按下
 * isDrag 是否拖动
 */
const progress = reactive({
  initOffest: 0,
  current: 0,
  isDown: false,
  isDrag: false
});

// 当前进度
const currentProgress = computed(() => {
  // 拖动时停止更新进度条
  if (progress.isDrag) {
    return;
  }

  return props.current;
});

// 鼠标按下
function mousedown(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (target.className !== 'icon-round') {
    return;
  }

  progress.isDown = true;

  // 初始偏移量(当前偏移量 - 当前进度偏移量)
  const current = currentProgressRef.value as HTMLDivElement;
  const total = totalProgressRef.value as HTMLDivElement;
  progress.initOffest = e.clientY - total.clientHeight + current.offsetHeight;
}

// 鼠标移动
function mousemove(e: MouseEvent): void {
  // buttons 1为鼠标左键按下移动
  if (e.buttons !== 1 || !progress.isDown) {
    return;
  }

  const current = currentProgressRef.value as HTMLDivElement;
  const total = totalProgressRef.value as HTMLDivElement;

  // 当前偏移量 - 初始偏移量
  let moveY = e.clientY - progress.initOffest;
  // 边界判断
  if (moveY >= total.offsetHeight) {
    moveY = total.offsetHeight;
  }
  if (moveY <= 0) {
    moveY = 0;
  }

  // 拖动
  progress.isDrag = true;
  // 存储当前进度
  progress.current = (total.offsetHeight - moveY) / total.offsetHeight;
  // 进度样式
  current.style.height = ((total.offsetHeight - moveY) / total.offsetHeight) * 100 + '%';
}

// 鼠标放开
function mouseup(): void {
  if (!progress.isDrag) {
    return;
  }

  progress.isDown = false;
  progress.isDrag = false;
  emits('progressChange', progress.current);
}

// 进度点击
function handleProgressClick(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (target.className === 'icon-round') {
    return;
  }

  const current = currentProgressRef.value as HTMLDivElement;
  const total = totalProgressRef.value as HTMLDivElement;

  // 当前进度
  const totalOffestHeight = total.offsetHeight ?? 0;
  current.style.height = (e.offsetY / totalOffestHeight) * 100 + '%';

  emits('progressChange', e.offsetY / totalOffestHeight);
}

onMounted(() => {
  const selector = props.range ?? '#VerticalProgress';
  const element: HTMLDivElement = document.querySelector(selector)!;

  // 监听鼠标按下、移动、放开事件
  element.addEventListener('mousedown', mousedown, false);
  element.addEventListener('mousemove', mousemove, false);
  element.addEventListener('mouseup', mouseup, false);
});

onBeforeUnmount(() => {
  const selector = props.range ?? '#VerticalProgress';
  const element: HTMLDivElement = document.querySelector(selector)!;

  // 移除监听鼠标按下、移动、放开事件
  element.removeEventListener('mousedown', mousedown);
  element.removeEventListener('mousemove', mousemove);
  element.removeEventListener('mouseup', mouseup);
});
</script>

<style lang="less" scoped>
@import url('./vertical-progress.less');
</style>
