<template>
  <div id="VerticalProgress" class="progress" @click="handleProgressClick">
    <div
      class="current-progress"
      ref="currentProgressRef"
      :style="{ height: currentProgress }"
    >
      <i class="icon-round" ref="roundProgressRef"></i>
    </div>
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
  name: 'VerticalProgress',
  props: {
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

    // 鼠标按下
    function mousedown(e: MouseEvent): boolean | undefined {
      const target = e.target as HTMLElement;
      if (target.className !== 'icon-round') {
        return false;
      }

      progress.isDown = true;

      // 初始偏移量(当前偏移量 - 当前进度偏移量)
      const current = currentProgressRef.value as HTMLDivElement;
      const total = totalProgressRef.value as HTMLDivElement;
      progress.initOffest =
        e.clientY - total.clientHeight + current.offsetHeight;
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
      current.style.height =
        ((total.offsetHeight - moveY) / total.offsetHeight) * 100 + '%';
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
      if (target.className === 'icon-round') {
        return false;
      }

      const current = currentProgressRef.value as HTMLDivElement;
      const total = totalProgressRef.value as HTMLDivElement;

      // 当前进度
      const totalOffestHeight = total.offsetHeight || 0;
      current.style.height = (e.offsetY / totalOffestHeight) * 100 + '%';

      emit('progressChange', e.offsetY / totalOffestHeight);
    }

    onMounted(() => {
      const selector = props.range || '#VerticalProgress';
      const progressDom = document.querySelector(selector) as HTMLDivElement;

      // 监听鼠标按下、移动、放开事件
      progressDom.addEventListener('mousedown', mousedown, false);
      progressDom.addEventListener('mousemove', mousemove, false);
      progressDom.addEventListener('mouseup', mouseup, false);
    });

    onBeforeUnmount(() => {
      const selector = props.range || '#VerticalProgress';
      const progressDom = document.querySelector(selector) as HTMLDivElement;

      // 移除监听鼠标按下、移动、放开事件
      progressDom.removeEventListener('mousedown', mousedown);
      progressDom.removeEventListener('mousemove', mousemove);
      progressDom.removeEventListener('mouseup', mouseup);
    });

    return {
      currentProgress,
      roundProgressRef,
      currentProgressRef,
      totalProgressRef,
      handleProgressClick
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./vertical-progress.less');
</style>
