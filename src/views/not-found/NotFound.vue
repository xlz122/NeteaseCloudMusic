<template>
  <div class="not-found">
    <HeaderView />
    <div class="tip">
      <i class="icon"></i>
      <p class="text">很抱歉，你要查找的网页找不到</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/header/Header.vue';
</script>

<style lang="less" scoped>
.not-found {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100vh;
  background-color: #fcfcfc;

  .tip {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding-top: 165px;

    .icon {
      width: 281px;
      height: 115px;
      background: url('@/assets/image/not-found.jpg') no-repeat;
    }

    .text {
      font-family: 'Microsoft Yahei';
      font-size: 18px;
      color: #666;
    }
  }
}
</style>
