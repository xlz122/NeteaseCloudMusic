<template>
  <div class="not-found">
    <HeaderView />
    <div class="content">
      <i class="img"></i>
      <p class="text">很抱歉，你要查找的网页找不到</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderView from '@views/header/Header.vue';

export default defineComponent({
  name: 'NotFound',
  components: {
    HeaderView
  }
});
</script>

<style lang="less" scoped>
.not-found {
  display: flex;
  flex-flow: column;
  height: 100vh;
  background: #fcfcfc;

  .content {
    flex-grow: 1;
    padding-top: 27px;

    .img {
      display: inline-block;
      width: 281px;
      height: 115px;
      background: url(~@/assets/image/not-found.jpg);
      text-align: center;
    }

    .text {
      margin: 15px 0;
      text-align: center;
      font-size: 16px;
      color: #666;
    }
  }
}
</style>
