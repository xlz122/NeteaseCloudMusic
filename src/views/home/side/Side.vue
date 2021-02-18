<template>
  <div class="side">
    <!-- 个人信息部分 -->
    <user-profile />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserProfile from '@/components/user-profile/UserProfile.vue';

export default defineComponent({
  components: {
    UserProfile
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
