<template>
  <ul class="user-base">
    <li
      class="item"
      v-for="(item, index) in list"
      :key="index"
      @click="jumpDetail(item)"
    >
      <i :class="`icon ${item.icon}`"></i>
      <span class="title" v-if="item.link">{{ item.title }}</span>
      <a class="link" target="_blank" v-else :href="item?.href">
        {{ item?.title }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

type NavList = {
  title: string;
  link?: string;
  href?: string;
  icon: string;
};

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo || {});

    const list = ref<NavList[]>([
      {
        title: '我的主页',
        link: '/user-profile',
        icon: 'homepage'
      },
      {
        title: '我的消息',
        link: '',
        icon: 'message'
      },
      {
        title: '我的等级',
        link: '/level',
        icon: 'grade'
      },
      {
        title: 'VIP会员',
        link: '',
        icon: 'member'
      },
      {
        title: '个人设置',
        link: '',
        icon: 'setting'
      },
      {
        title: '实名认证',
        href: 'https://music.163.com/st/userbasic/?module=st%2Fuserbasic%2F#/nameverify',
        icon: 'real-name'
      },
      {
        title: '退出',
        link: '/logout',
        icon: 'logout'
      }
    ]);

    // 详情跳转
    function jumpDetail(item: NavList): boolean | undefined {
      // 外部链接
      if (!item?.link && item?.href) {
        return false;
      }
      // 未开发
      if (!item?.link) {
        $store.commit('setMessage', {
          type: 'error',
          title: '该功能暂未开发'
        });
        return false;
      }

      // 退出登录
      if (item?.link === '/logout') {
        signOut();
        return false;
      }

      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);

      // 我的主页
      if (item?.link === '/user-profile') {
        $router.push({
          name: 'user-profile',
          params: { id: userInfo?.value.profile?.userId }
        });
        return false;
      }

      $router.push({ path: item?.link || '/' });
    }

    // 退出登录
    function signOut(): void {
      $store.dispatch('setLogout');
    }
    return {
      jumpDetail,
      list
    };
  }
});
</script>

<style lang="less" scoped>
@import './user.less';
</style>
