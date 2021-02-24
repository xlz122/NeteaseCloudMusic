<template>
  <div class="bug">
    <p class="title">bug列表</p>
    <ul>
      <li class="item" v-for="(item, index) in bugList" :key="index">
        {{ item }}
      </li>
    </ul>
    <p class="title">未完成列表</p>
    <ul>
      <li class="item" v-for="(item, index) in incompleteFunction" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    // 未完成功能：拖动比缓冲更快，需置为加载
    // bug
    const bugList = ref<string[]>(['']);
    // 未完成
    const incompleteFunction = ref<string[]>(['邮箱登录', '手机号登录']);
    return {
      bugList,
      incompleteFunction
    };
  }
});
</script>

<style lang="less" scoped>
.bug {
  width: 980px;
  margin: 0 auto;
  text-align: left;
  .title {
    margin-top: 20px;
    font-size: 16px;
  }
  .item {
    margin: 8px 0;
  }
}
</style>
