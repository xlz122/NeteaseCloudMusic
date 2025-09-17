<template>
  <div class="home-side">
    <SideUser />
    <div class="side-content">
      <h3 class="title">
        <span class="text">入驻歌手</span>
        <router-link class="link" to="/home-singer">查看全部 ></router-link>
      </h3>
      <ul class="list">
        <li
          class="item"
          v-for="(item, index) in singer"
          :key="index"
          @click="jumpUserProfile(item.id)"
        >
          <img class="img" :src="item.src" alt="" />
          <div class="info">
            <h4 class="info-name">{{ item.name }}</h4>
            <p class="info-description">{{ item.description }}</p>
          </div>
        </li>
      </ul>
      <a class="apply-link" href="https://music.163.com/st/musician" target="_blank">
        <i class="apply-icon">申请成为网易音乐人</i>
      </a>
      <h3 class="title">
        <span class="text">热门主播</span>
      </h3>
      <ul class="list anchor-list">
        <li
          class="anchor-item"
          v-for="(item, index) in anchor"
          :key="index"
          @click="jumpUserProfile(item.id)"
        >
          <img class="img" :src="item.src" alt="" />
          <div class="info">
            <p class="info-name">{{ item.name }}</p>
            <p class="info-description">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SideUser from './side-user/SideUser.vue';

type ItemType = {
  id: number;
  src: string;
  name: string;
  description: string;
};

const router = useRouter();

const singer = ref<ItemType[]>([
  {
    id: 29879272,
    src: 'http://p2.music.126.net/cSAmmAvsKhm3N-zxWg7QcQ==/109951168490195225.jpg?param=62y62',
    name: '张惠妹aMEI',
    description: '台湾歌手张惠妹'
  },
  {
    id: 650120,
    src: 'http://p2.music.126.net/FRjXcFEflJMI0UBFauC--g==/109951169959806190.jpg?param=62y62',
    name: '吴莫愁Momo',
    description: '中国好声音》选手吴莫愁'
  },
  {
    id: 198554,
    src: 'http://p2.music.126.net/whG7pbsbd1akKtOE7V3R_Q==/109951168299161319.jpg?param=62y62',
    name: '孙楠',
    description: '歌手孙楠 代表作《你快回来》《燃烧》'
  },
  {
    id: 2000268,
    src: 'http://p2.music.126.net/1GIlkxKmvKu66ufU83FyvA==/31885837222663.jpg?param=62y62',
    name: '麦田老狼',
    description: '歌手，音乐人。代表作《同桌的你》等。'
  },
  {
    id: 39002,
    src: 'http://p2.music.126.net/MXMZYksJmsa0gcGkuk2mDQ==/109951167712155407.jpg?param=62y62',
    name: '陈楚生',
    description: '唱作歌手'
  }
]);

const anchor = ref<ItemType[]>([
  {
    id: 278438485,
    src: 'http://p1.music.126.net/H3QxWdf0eUiwmhJvA4vrMQ==/1407374893913311.jpg?param=40y40',
    name: '陈立',
    description: '心理学家、美食家陈立教授'
  },
  {
    id: 559210341,
    src: 'http://p2.music.126.net/GgXkjCzeH4rqPCsrkBV1kg==/109951164843970584.jpg?param=40y40',
    name: '刘维-Julius',
    description: '歌手、播客节目《维维道来》主理人'
  },
  {
    id: 259292486,
    src: 'http://p2.music.126.net/C8jFbOTjUOnTKEHX6uuzOg==/109951166239584597.jpg?param=40y40',
    name: '莫非定律MoreFeel',
    description: '男女双人全创作独立乐团'
  },
  {
    id: 1450418799,
    src: 'http://p2.music.126.net/NHjNoFpLDEZ-3OR9h35z1w==/109951165825466770.jpg?param=40y40',
    name: '碎嘴许美达',
    description: '脱口秀网络红人'
  },
  {
    id: 2688170,
    src: 'http://p2.music.126.net/CpUdHPNvBvN7kebvL21TTA==/109951163676573083.jpg?param=40y40',
    name: '银临Rachel',
    description: '古风音乐人'
  }
]);

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./side.less');
</style>
