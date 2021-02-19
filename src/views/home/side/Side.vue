<!-- 入驻歌手无接口 -->
<!-- 热门主播接口未找到 -->
<template>
  <div class="side">
    <!-- 个人信息部分 -->
    <user-profile />
    <div class="side-content">
      <!-- 入驻歌手 -->
      <h3 class="side-title">
        <span>入驻歌手</span>
        <router-link class="link" to="">查看全部 ></router-link>
      </h3>
      <ul class="list">
        <li class="item">
          <div class="item-img">
            <img class="img" src="" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">张惠妹aMEI</h4>
            <p class="info-desc">台湾歌手张惠妹</p>
          </div>
        </li>
      </ul>
      <a class="apply-link">
        <i class="apply-icon">申请成为网易音乐人</i>
      </a>
      <!-- 热门主播 -->
      <h3 class="side-title anchor-title">
        <span>热门主播</span>
      </h3>
      <ul class="list anchor-list">
        <li class="item">
          <div class="item-img">
            <img class="img" src="" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">陈立</h4>
            <p class="info-desc">心理学家、美食家陈立教授</p>
          </div>
        </li>
      </ul>
    </div>
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
