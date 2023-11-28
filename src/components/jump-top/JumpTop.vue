<template>
  <i
    class="jump-top"
    title="回到顶部"
    :class="{ 'jump-top-show': visible }"
    @click="jumpTop"
  ></i>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash';

const visible = ref<boolean>(false);

function toggleVisible(e: { target: Document }): void {
  const scrollTop =
    e.target.documentElement.scrollTop || e.target.body.scrollTop;

  if (scrollTop < 20) {
    visible.value = false;
  }

  if (!visible.value && scrollTop >= 20) {
    visible.value = true;
  }
}

function jumpTop(): void {
  window.scrollTo(0, 0);
}

onMounted(() => {
  document.addEventListener('scroll', debounce(toggleVisible, 100), false);
});

onUnmounted(() => {
  document.removeEventListener('scroll', () => ({}));
});
</script>

<style lang="less" scoped>
.jump-top {
  position: fixed;
  bottom: 160px;
  left: 50%;
  display: none;
  width: 49px;
  height: 44px;
  margin-left: 505px;
  text-indent: -9999px;
  cursor: pointer;
  background: url('@/assets/image/song-sheet/song-sheet-detail-download.png');
  background-position: -265px -47px;

  &:hover {
    background-position: -325px -47px;
  }
}

.jump-top-show {
  display: block;
}
</style>
