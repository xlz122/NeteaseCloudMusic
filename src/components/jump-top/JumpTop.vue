<template>
  <i
    class="jump-top"
    title="回到顶部"
    :class="{ 'jump-top-show': jumpTopShow }"
    @click="jumpTop"
  ></i>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash';

export default defineComponent({
  setup() {
    const jumpTopShow = ref<boolean>(false);

    function setJumpTopShow(e: Event): void {
      const target = e.target as Record<string, any>;
      const scrollTop = target.scrollTop;

      if (!jumpTopShow.value && scrollTop >= 20) {
        jumpTopShow.value = true;
      }

      if (scrollTop < 20) {
        jumpTopShow.value = false;
      }
    }

    function jumpTop(): void {
      const appwrap = document.querySelector('.app-wrap') as HTMLElement;
      appwrap.scrollTo(0, 0);
    }

    onMounted(() => {
      const appwrap = document.querySelector('.app-wrap') as HTMLElement;

      appwrap.addEventListener('scroll', debounce(setJumpTopShow, 100), false);
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', () => ({}));
    });

    return {
      jumpTopShow,
      jumpTop
    };
  }
});
</script>

<style lang="less" scoped>
.jump-top {
  display: none;
  position: fixed;
  text-indent: -9999px;
  left: 50%;
  bottom: 160px;
  width: 49px;
  height: 44px;
  margin-left: 505px;
  background: url(~@/assets/image/song-sheet/song-sheet-detail-download.png);
  background-position: -265px -47px;
  cursor: pointer;

  &:hover {
    background-position: -325px -47px;
  }
}

.jump-top-show {
  display: block;
}
</style>
