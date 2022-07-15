<template>
  <div class="volume-progress">
    <VerticalProgress
      class="progress"
      :current="progress.current"
      :range="'.volume-progress'"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import VerticalProgress from '@components/vertical-progress/VerticalProgress.vue';

export default defineComponent({
  name: 'VolumeProgress',
  components: {
    VerticalProgress
  },
  setup() {
    const $store = useStore();

    const musicVolume = computed(() => $store.getters['music/musicVolume']);

    const progress = reactive({
      current: ''
    });

    // 更新进度数据
    watch(
      () => musicVolume.value,
      curVal => {
        progress.current = curVal * 100 + '%';
      },
      {
        immediate: true
      }
    );

    // 音量更改
    function progressChange(value: number): void {
      $store.commit('music/setMusicVolume', value);
    }

    return {
      progress,
      progressChange
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./volume-progress.less');
</style>
