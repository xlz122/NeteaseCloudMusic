<template>
  <div class="header">
    <div class="h-top">
      <div class="h-warp">
        <div class="logo"></div>
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in navList"
            :key="index"
            :class="[
              { 'active-item': index === navActive },
              { 'last-item': index === navList.length - 1 }
            ]"
            @click="navChange(index)"
          >
            <router-link class="link" to="">{{ item.title }}</router-link>
            <span class="hot" v-if="index === navList.length - 1"></span>
          </li>
        </ul>
        <div class="other">
          <div class="search">
            <span class="icon"></span>
            <input
              class="search-input"
              type="text"
              placeholder="音乐/视频/电台/用户"
            />
          </div>
          <div class="create">
            <router-link class="link" to="">创作中心</router-link>
          </div>
          <div class="login" @click="login">
            登录
          </div>
        </div>
      </div>
    </div>
    <div class="h-bottom">
      <div class="h-warp subnav" v-if="navActive === 0">
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in subNavList"
            :key="index"
            :class="[
              { 'active-item': index === subNavActive },
              { 'song-sheet': index === 2 }
            ]"
            @click="subNavChange(index)"
          >
            <router-link class="link" to="">{{ item.title }}</router-link>
            <span class="white-icon" v-if="index === 2"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <teleport to="#modal">
    <my-dialog
      class="dialog"
      :visible="dialogvisible"
      :title="'登录'"
      @cancel="dialogCancel"
    >
      这是个弹窗
    </my-dialog>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// 使用setup语法糖，没有export default爆红，不是语法问题
import MyDialog from '@/components/MyDialog.vue';

interface NavList {
  title: string;
  link: string;
}

export default defineComponent({
  components: {
    MyDialog
  },
  setup() {
    const navList = ref<NavList[]>([
      {
        title: '发现音乐',
        link: ''
      },
      {
        title: '我的音乐',
        link: ''
      },
      {
        title: '朋友',
        link: ''
      },
      {
        title: '商城',
        link: ''
      },
      {
        title: '音乐人',
        link: ''
      },
      {
        title: '下载客户端',
        link: ''
      }
    ]);

    // 导航当前选中项
    const navActive = ref<number>(0);

    // 导航更改
    function navChange(index: number): void {
      navActive.value = index;
    }

    // 子导航数据
    const subNavList = ref<NavList[]>([
      {
        title: '推荐',
        link: ''
      },
      {
        title: '排行',
        link: ''
      },
      {
        title: '歌单',
        link: ''
      },
      {
        title: '主播电台',
        link: ''
      },
      {
        title: '歌手',
        link: ''
      },
      {
        title: '新碟上架',
        link: ''
      }
    ]);

    // 子导航当前选中项
    const subNavActive = ref<number>(0);
    // 导航更改
    function subNavChange(index: number): void {
      subNavActive.value = index;
    }

    // 登录弹框显隐
    const dialogvisible = ref<boolean>(false);

    // 登录
    function login(): void {
      dialogvisible.value = true;
    }

    // 登录 - 弹框关闭
    function dialogCancel(): void {
      dialogvisible.value = false;
    }
    return {
      navList,
      navActive,
      navChange,
      subNavList,
      subNavActive,
      subNavChange,
      dialogvisible,
      login,
      dialogCancel
    };
  }
});
</script>

<style lang="less" scoped>
@import './header.less';
</style>
