<template>
  <div class="home">
    <banner />
    <div class="home-container">
      <!-- 左侧列表 -->
      <div class="container-content">
        <home-content />
      </div>
      <!-- 右侧账号信息 -->
      <div class="container-side">
        <side />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Banner from './banner/Banner.vue';
import HomeContent from './content/Content.vue';
import Side from './side/Side.vue';

export default defineComponent({
  components: {
    Banner,
    HomeContent,
    Side
  }
});
</script>

<style lang="less" scoped>
.home {
  .home-container {
    position: relative;
    width: 980px;
    min-height: 700px;
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #d3d3d3;
    border-width: 0 1px;
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
