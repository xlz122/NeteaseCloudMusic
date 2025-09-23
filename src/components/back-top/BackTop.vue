<template>
  <i
    class="back-top"
    title="回到顶部"
    :class="{ 'back-top-show': visible }"
    @click="handleBackToTop"
  ></i>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

function handleBackToTop(): void {
  window.scrollTo(0, 0);
}

const visible = ref(false);

function handleScroll(e: Event): void {
  const scrollTop = (e.target as Document).documentElement?.scrollTop ?? 0;

  if (scrollTop <= 20) {
    visible.value = false;
    return;
  }

  visible.value = true;
}

onMounted(() => {
  document.addEventListener('scroll', handleScroll, false);
});

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll, false);
});
</script>

<style lang="less" scoped>
.back-top {
  display: none;
  position: fixed;
  left: 50%;
  bottom: 160px;
  width: 49px;
  height: 44px;
  margin-left: 500px;
  background: url('@/assets/image/song-sheet/icon-download.png') no-repeat;
  background-position: -265px -47px;
  cursor: pointer;

  &:hover {
    background-position: -325px -47px;
  }
}

.back-top-show {
  display: block;
}
</style>
