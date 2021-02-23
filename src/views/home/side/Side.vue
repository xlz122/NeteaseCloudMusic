<template>
  <div class="side">
    <!-- 个人信息 -->
    <side-user />
    <div class="side-content">
      <!-- 入驻歌手 -->
      <h3 class="side-title">
        <span>入驻歌手</span>
        <router-link class="link" to="">查看全部 ></router-link>
      </h3>
      <ul class="list">
        <li class="item" v-for="(item, index) in singerList" :key="index">
          <div class="item-img">
            <img class="img" :src="item.src" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">{{ item.name }}</h4>
            <p class="info-desc">{{ item.desc }}</p>
          </div>
        </li>
      </ul>
      <a
        class="apply-link"
        href="https://music.163.com/st/musician"
        target="_blank"
      >
        <i class="apply-icon">申请成为网易音乐人</i>
      </a>
      <!-- 热门主播 -->
      <!-- 热门主播接口未找到 -->
      <h3 class="side-title anchor-title">
        <span>热门主播</span>
      </h3>
      <ul class="list anchor-list">
        <li class="item">
          <div class="item-img">
            <img
              class="img"
              src="http://p1.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40"
              alt=""
            />
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
import { defineComponent, ref } from 'vue';
import SideUser from './side-user/SideUser.vue';

export default defineComponent({
  components: {
    SideUser
  },
  setup() {
    // 入驻歌手无接口
    const singerList = ref<unknown[]>([
      {
        src:
          'http://p2.music.126.net/p9U80ex1B1ciPFa125xV5A==/5931865232210340.jpg?param=62y62',
        name: '张惠妹aMEI',
        desc: '台湾歌手张惠妹'
      },
      {
        src:
          'http://p1.music.126.net/1EN_iqQWU_E3DafzEOh3cA==/3302932937408956.jpg?param=62y62',
        title: 'Fine乐团',
        desc: '独立音乐人'
      },
      {
        src:
          'http://p1.music.126.net/ZuktZvjcxpYBjcWC3gmbPg==/19027048718765608.jpg?param=62y62',
        name: '萬曉利',
        desc: '民谣歌手、中国现代民谣的代表人物之一'
      },
      {
        src:
          'http://p1.music.126.net/v_zYgE9kmAwVGWV2c8hFxA==/7943971513291094.jpg?param=62y62',
        name: '音乐人赵雷',
        desc: '民谣歌手'
      },
      {
        src:
          'http://p1.music.126.net/6wPGl_ddgAbJTx5kOohcyw==/109951163892302996.jpg?param=62y62',
        name: '王三溥',
        desc: '音乐人'
      }
    ]);
    return {
      singerList
    };
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
