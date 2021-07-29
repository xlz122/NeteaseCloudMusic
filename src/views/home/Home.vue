<template>
  <div class="home">
    <!-- 轮播图 -->
    <banner />
    <div class="home-container">
      <!-- 主体内容 -->
      <div class="container-content">
        <home-content />
      </div>
      <!-- 侧边栏 -->
      <div class="container-side">
        <home-side />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import Banner from './banner/Banner.vue';
const HomeContent = defineAsyncComponent(() => import('./content/Content.vue'));
const HomeSide = defineAsyncComponent(() => import('./side/Side.vue'));

export default defineComponent({
  name: 'home',
  components: {
    Banner,
    HomeContent,
    HomeSide
  }
});
</script>

<style lang="less" scoped>
.home {
  background-color: #f5f5f5;

  .home-container {
    position: relative;
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
    background: url(~@/assets/image/home/wrap1.png) repeat-y 100% 100%;

    .container-content {
      display: inline-block;
      vertical-align: top;
      width: calc(980px - 250px);
    }
    .container-side {
      display: inline-block;
      vertical-align: top;
      width: 250px;
    }
  }
}
</style>
