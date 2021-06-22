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
        <li class="item" v-for="(item, index) in anchorList" :key="index">
          <div class="item-img">
            <img class="img" :src="item.src" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">{{ item.name }}</h4>
            <p class="info-desc">{{ item.desc }}</p>
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
    // 入驻歌手无接口(服务器渲染)
    const singerList = ref<unknown[]>([
      {
        src:
          'http://p1.music.126.net/rCsLFXha6SLis0tV7yZ5fA==/109951165588539704.jpg?param=62y62',
        name: '张惠妹aMEI',
        desc: '台湾歌手张惠妹'
      },
      {
        src:
          'http://p1.music.126.net/wDxCsT3YEYdNg-UZU_ZKeg==/109951166047225823.jpg?param=62y62',
        name: 'Fine乐团',
        desc: '独立音乐人'
      },
      {
        src:
          'http://p1.music.126.net/w_UWOls2uCkFN_U62788Xg==/18806046882229308.jpg?param=62y62',
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
          'http://p1.music.126.net/NDsX060FnCtiDMZN-c_9Gw==/3438172872737957.jpg?param=62y62',
        name: '王三溥',
        desc: '音乐人'
      }
    ]);
    // 热门主播无接口(服务器渲染)
    const anchorList = ref<unknown[]>([
      {
        src:
          'http://p1.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40',
        name: '陈立',
        desc: '心理学家、美食家陈立教授'
      },
      {
        src:
          'http://p1.music.126.net/y5-sM7tjnxnu_V9LWKgZlw==/7942872001461517.jpg?param=40y40',
        name: 'DJ艳秋',
        desc: '著名音乐节目主持人'
      },
      {
        src:
          'http://p1.music.126.net/6cc6lgOfQTo6ovNnTHPyJg==/3427177769086282.jpg?param=40y40',
        name: '国家大剧院古典音乐频道',
        desc: '国家大剧院古典音乐官方'
      },
      {
        src:
          'http://p1.music.126.net/xa1Uxrrn4J0pm_PJwkGYvw==/3130309604335651.jpg?param=40y40',
        name: '谢谢收听',
        desc: '南京电台主持人王馨'
      },
      {
        src:
          'http://p1.music.126.net/slpd09Tf5Ju82Mv-h8MP4w==/3440371884651965.jpg?param=40y40',
        name: 'DJ晓苏',
        desc: '独立DJ，CRI环球旅游广播特邀DJ'
      }
    ]);
    return {
      singerList,
      anchorList
    };
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
