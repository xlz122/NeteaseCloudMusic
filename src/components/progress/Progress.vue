<template>
  <div id="progress" class="progress" @click="handleProgressClick">
    <div
      class="current-progress"
      ref="currentProgressRef"
      :style="{ width: currentProgress }"
    >
      <i class="icon-round" ref="roundProgressRef"></i>
      <i class="icon-loading" v-if="loading"></i>
    </div>
    <div class="cache-progress" :style="{ width: cacheProgress }"></div>
    <div class="total-progress" ref="totalProgressRef"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed
} from 'vue';

type ProgressRef = HTMLDivElement | HTMLElement | null;

export default defineComponent({
  name: 'ProgressView',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    // 当前进度
    current: {
      type: String,
      default: ''
    },
    // 缓存进度
    cache: {
      type: String,
      default: ''
    },
    // 拖动生效范围
    range: {
      type: String,
      default: ''
    }
  },
  emits: ['progressChange'],
  setup(props, { emit }) {
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
        return false;
      }

      return props.current;
    });
    // 缓存进度
    const cacheProgress = computed(() => props.cache);

    // 鼠标按下
    function mousedown(e: MouseEvent): boolean | undefined {
      const target = e.target as HTMLElement;
      if (
        target.className !== 'icon-round' &&
        target.className !== 'icon-loading'
      ) {
        return false;
      }

      progress.isDown = true;

      // 初始偏移量(当前偏移量 - 当前进度偏移量)
      const current = currentProgressRef.value as HTMLDivElement;
      progress.initOffest = e.clientX - current.offsetWidth;
    }

    // 鼠标移动
    function mousemove(e: MouseEvent): boolean | undefined {
      // buttons 1为鼠标左键按下移动
      if (e.buttons !== 1 || !progress.isDown) {
        return false;
      }

      const current = currentProgressRef.value as HTMLDivElement;
      const total = totalProgressRef.value as HTMLDivElement;

      // 当前偏移量 - 初始偏移量
      let moveX = e.clientX - progress.initOffest;
      // 边界判断
      if (moveX >= total.offsetWidth) {
        moveX = total.offsetWidth;
      }
      if (moveX <= 0) {
        moveX = 0;
      }

      // 拖动
      progress.isDrag = true;
      // 存储当前进度
      progress.current = moveX / total.offsetWidth;
      // 进度样式
      current.style.width = (moveX / total.offsetWidth) * 100 + '%';
    }

    // 鼠标放开
    function mouseup(): boolean | undefined {
      if (!progress.isDrag) {
        return false;
      }

      progress.isDown = false;
      progress.isDrag = false;
      emit('progressChange', progress.current);
    }

    // 进度点击
    function handleProgressClick(e: MouseEvent): boolean | undefined {
      const target = e.target as HTMLElement;
      if (
        target.className === 'icon-round' ||
        target.className === 'icon-loading'
      ) {
        return false;
      }

      const current = currentProgressRef.value as HTMLDivElement;
      const total = totalProgressRef.value as HTMLDivElement;

      // 当前进度
      const totalOffestWidth = total.offsetWidth || 0;
      current.style.width = (e.offsetX / totalOffestWidth) * 100 + '%';

      emit('progressChange', e.offsetX / totalOffestWidth);
    }

    onMounted(() => {
      const selector = props.range || '#progress';
      const progressDom = document.querySelector(selector) as HTMLDivElement;

      // 监听鼠标按下、移动、放开事件
      progressDom.addEventListener('mousedown', mousedown, false);
      progressDom.addEventListener('mousemove', mousemove, false);
      progressDom.addEventListener('mouseup', mouseup, false);
    });

    onBeforeUnmount(() => {
      const selector = props.range || '#progress';
      const progressDom = document.querySelector(selector) as HTMLDivElement;

      // 移除监听鼠标按下、移动、放开事件
      progressDom.removeEventListener('mousedown', mousedown);
      progressDom.removeEventListener('mousemove', mousemove);
      progressDom.removeEventListener('mouseup', mouseup);
    });

    return {
      currentProgress,
      cacheProgress,
      roundProgressRef,
      currentProgressRef,
      totalProgressRef,
      handleProgressClick
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./progress.less');
</style>
