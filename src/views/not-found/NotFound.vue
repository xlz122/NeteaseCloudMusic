<template>
  <div class="not-found">
    未找到该页面，将在3秒后返回首页...
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();

    setTimeout(() => {
      router.push({ name: 'home' });
    }, 3000);
  }
});
</script>

<style lang="less" scoped>
.not-found {
  position: fixed;
  top: 0;
  left: 0;
  color: #000;
  font-size: 16px;
}
</style>
