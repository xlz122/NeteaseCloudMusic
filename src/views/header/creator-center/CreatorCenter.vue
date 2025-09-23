<template>
  <div class="creator-center" v-if="isLogin">
    <div class="creator-container">
      <p class="title">创作者中心</p>
      <p class="desc">· 请选择身份进入管理平台 ·</p>
      <ul class="list">
        <li class="item musician">
          <a class="link" href="https://music.163.com/st/musician" target="_blank">
            <img class="icon" :src="musicianSvg" alt="" />
            <p class="typename">网易音乐人</p>
            <p class="intro">欢迎所有音乐“妄想”</p>
          </a>
        </li>
        <li class="item talent">
          <a class="link" href="https://music.163.com/st/creator" target="_blank">
            <img class="icon" :src="talentSvg" alt="" />
            <p class="typename">云音乐达人</p>
            <p class="intro">用内容创作玩转音乐</p>
          </a>
        </li>
        <li class="item anchor">
          <a class="link" href="https://look.163.com/" target="_blank">
            <img class="icon" :src="anchorSvg" alt="" />
            <p class="typename">LOOK主播</p>
            <p class="intro">让世界看见特别的你</p>
          </a>
        </li>
      </ul>
      <a
        class="creator-company"
        href="https://music.163.com/musician/company/entrance"
        target="_blank"
      >
        <div class="creator-company-title">
          <span class="text">公司</span>
          <span class="line">/</span>
          <span class="text">厂牌</span>
        </div>
        <div class="intro">赋能厂牌数字化管理，发挥音乐无限可能</div>
        <div class="company-enter">进入</div>
      </a>
    </div>
  </div>
  <div class="creator-center" v-else>
    <div class="creator-center-login">
      <h1 class="login-title">请用你的云音乐账号登录</h1>
      <div class="login-contet">
        <div class="login">
          <!-- 扫码登录 -->
          <qrcode v-if="qrcodeLoginShow" @otherLogin="otherLogin" />
          <!-- 其他登录 -->
          <other v-else @qrcodeLogin="qrcodeLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Qrcode from '@/components/login-dialog/qrcode/Qrcode.vue';
import Other from '@/components/login-dialog/other/Other.vue';
import musicianSvg from '../../../assets/image/header/creator-center/musician.svg';
import talentSvg from '../../../assets/image/header/creator-center/talent.svg';
import anchorSvg from '../../../assets/image/header/creator-center/anchor.svg';

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 扫码/其他登录切换
const qrcodeLoginShow = ref(true);

function qrcodeLogin(): void {
  qrcodeLoginShow.value = true;
}

function otherLogin(): void {
  qrcodeLoginShow.value = false;
}

onMounted(() => {
  store.commit('setMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./creator-center.less');
</style>
