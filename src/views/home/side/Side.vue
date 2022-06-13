<template>
  <div class="side">
    <SideUser />
    <div class="side-content">
      <h3 class="side-title">
        <span>入驻歌手</span>
        <router-link class="link" to="/home-singer">查看全部 ></router-link>
      </h3>
      <ul class="list">
        <li
          class="item"
          v-for="(item, index) in singerList"
          :key="index"
          @click="jumpUserProfile(item?.userId)"
        >
          <div class="item-img">
            <img class="img" :src="item?.src" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">{{ item?.name }}</h4>
            <p class="info-desc">
              {{ item?.desc }}
            </p>
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
      <h3 class="side-title anchor-title">
        <span>热门主播</span>
      </h3>
      <ul class="list anchor-list">
        <li
          class="anchor-item"
          v-for="(item, index) in anchorList"
          :key="index"
          @click="jumpUserProfile(item?.userId)"
        >
          <div class="item-img">
            <img class="img" :src="item?.src" alt="" />
          </div>
          <div class="info">
            <h4 class="info-title">
              {{ item?.name }}
            </h4>
            <p class="info-desc">{{ item?.desc }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import SideUser from './side-user/SideUser.vue';

type SingerList = {
  src: string;
  name: string;
  desc: string;
  userId: number;
};

export default defineComponent({
  name: 'HomeSide',
  components: {
    SideUser
  },
  setup() {
    const $store = useStore();

    // 入驻歌手无接口(服务器渲染)
    const singerList = ref<SingerList[]>([
      {
        src: 'http://p1.music.126.net/rCsLFXha6SLis0tV7yZ5fA==/109951165588539704.jpg?param=62y62',
        name: '张惠妹aMEI',
        desc: '台湾歌手张惠妹',
        userId: 29879272
      },
      {
        src: 'http://p1.music.126.net/wDxCsT3YEYdNg-UZU_ZKeg==/109951166047225823.jpg?param=62y62',
        name: 'Fine乐团',
        desc: '独立音乐人',
        userId: 100167517
      },
      {
        src: 'http://p1.music.126.net/w_UWOls2uCkFN_U62788Xg==/18806046882229308.jpg?param=62y62',
        name: '萬曉利',
        desc: '民谣歌手、中国现代民谣的代表人物之一',
        userId: 58426904
      },
      {
        src: 'http://p1.music.126.net/v_zYgE9kmAwVGWV2c8hFxA==/7943971513291094.jpg?param=62y62',
        name: '音乐人赵雷',
        desc: '民谣歌手',
        userId: 93504818
      },
      {
        src: 'http://p1.music.126.net/NDsX060FnCtiDMZN-c_9Gw==/3438172872737957.jpg?param=62y62',
        name: '王三溥',
        desc: '音乐人',
        userId: 46998208
      }
    ]);
    // 热门主播无接口(服务器渲染)
    const anchorList = ref<SingerList[]>([
      {
        src: 'http://p1.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40',
        name: '陈立',
        desc: '心理学家、美食家陈立教授',
        userId: 278438485
      },
      {
        src: 'http://p2.music.126.net/GgXkjCzeH4rqPCsrkBV1kg==/109951164843970584.jpg?param=40y40',
        name: '刘维-Julius',
        desc: '歌手、播客节目《维维道来》主理人',
        userId: 559210341
      },
      {
        src: 'http://p2.music.126.net/C8jFbOTjUOnTKEHX6uuzOg==/109951166239584597.jpg?param=40y40',
        name: '莫非定律MoreFeel',
        desc: '男女双人全创作独立乐团',
        userId: 259292486
      },
      {
        src: 'http://p2.music.126.net/NHjNoFpLDEZ-3OR9h35z1w==/109951165825466770.jpg?param=40y40',
        name: '碎嘴许美达',
        desc: '脱口秀网络红人',
        userId: 1450418799
      },
      {
        src: 'http://p2.music.126.net/CpUdHPNvBvN7kebvL21TTA==/109951163676573083.jpg?param=40y40',
        name: '银临Rachel',
        desc: '古风音乐人',
        userId: 2688170
      }
    ]);

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      singerList,
      anchorList,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
