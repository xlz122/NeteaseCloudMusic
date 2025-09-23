<template>
  <ul class="user-nav-list">
    <li class="item" v-for="(item, index) in menu" :key="index" @click="jumpPageDetail(item)">
      <i :class="`icon ${item.icon}`"></i>
      <a class="link" v-if="item.link?.includes('https')" :href="item.link" target="_blank">
        {{ item.title }}
      </a>
      <router-link class="link" v-else :to="item.link">
        {{ item.title }}
      </router-link>
      <template v-if="item.icon === 'message' && msgCount !== 0">
        <span class="msg-count">{{ msgCount }}</span>
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';

type MenuItem = {
  title: string;
  link: string;
  icon: string;
};

defineProps({
  msgCount: {
    type: Number,
    default: 0
  }
});

const router = useRouter();
const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

const menu = ref<MenuItem[]>([
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
    link: '/member',
    icon: 'member'
  },
  {
    title: '个人设置',
    link: '',
    icon: 'setting'
  },
  {
    title: '实名认证',
    link: 'https://music.163.com/st/userbasic/?module=st%2Fuserbasic%2F#/nameverify',
    icon: 'real-name'
  },
  {
    title: '退出',
    link: '/logout',
    icon: 'logout'
  }
]);

function jumpPageDetail(item: MenuItem): void {
  if (!item.link) {
    setMessage({ type: 'error', title: '该功能暂未开发' });
    return;
  }

  if (item.link === '/user-profile') {
    router.push({
      path: '/user-profile',
      query: { id: userInfo.value.profile?.userId }
    });
    return;
  }

  if (item.link === '/logout') {
    store.dispatch('setLogout');
    return;
  }

  router.push({ path: item.link });
}
</script>

<style lang="less" scoped>
@import url('./user.less');
</style>
