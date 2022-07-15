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

    function setJumpTopShow(e: { target: Document }): void {
      const scrollTop =
        e.target.documentElement.scrollTop || e.target.body.scrollTop;

      if (!jumpTopShow.value && scrollTop >= 20) {
        jumpTopShow.value = true;
      }

      if (scrollTop < 20) {
        jumpTopShow.value = false;
      }
    }

    function jumpTop(): void {
      window.scrollTo(0, 0);
    }

    onMounted(() => {
      document.addEventListener('scroll', debounce(setJumpTopShow, 100), false);
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
  position: fixed;
  bottom: 160px;
  left: 50%;
  display: none;
  width: 49px;
  height: 44px;
  margin-left: 505px;
  text-indent: -9999px;
  cursor: pointer;
  background: url('~@/assets/image/song-sheet/song-sheet-detail-download.png');
  background-position: -265px -47px;

  &:hover {
    background-position: -325px -47px;
  }
}

.jump-top-show {
  display: block;
}
</style>
