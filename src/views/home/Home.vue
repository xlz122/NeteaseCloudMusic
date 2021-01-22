<template>
  <div class="home">
    home页面
  </div>
  <div class="test-parent">
    <test class="test" />
  </div>
  <test class="test" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Test from './Test.vue';

export default defineComponent({
  components: {
    Test
  }
});
</script>

<style lang="less" scoped>
.home {
  color: red;
}
::v-deep(.test) {
  .text {
    color: yellowgreen;
  }
}
</style>
