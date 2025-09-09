<template>
  <div class="user-profile">
    <div class="user-profile-container">
      <div class="user-info">
        <div class="user-avatar">
          <img
            class="user-avatar-img"
            :src="userInfo.profile?.avatarUrl"
            @click="jumpUserProfile(userInfo.profile?.userId)"
            alt=""
          />
        </div>
        <div class="info">
          <h4 class="name">
            <span
              class="text"
              :title="userInfo.profile?.nickname"
              @click="jumpUserProfile(userInfo.profile?.userId)"
            >
              {{ userInfo.profile?.nickname }}
            </span>
          </h4>
        </div>
      </div>
      <ul class="list">
        <li class="item first-item">
          <strong class="num">{{ userInfo.profile?.eventCount }}</strong>
          <span class="text">动态</span>
        </li>
        <li class="item">
          <strong class="num">{{ userInfo.profile?.follows }}</strong>
          <span class="text">关注</span>
        </li>
        <li class="item last-item">
          <strong class="num">{{ userInfo.profile?.followeds }}</strong>
          <span class="text">粉丝</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="side-content">
    <h4 class="side-title">
      <span>明星用户</span>
      <router-link class="link" to="" @click="changeABatch"> 换一批 </router-link>
    </h4>
    <ul class="star-list">
      <li class="item" v-for="(item, index) in starList" :key="index">
        <div class="item-img">
          <img class="img" :src="item.src" alt="" />
        </div>
        <div class="info">
          <h4 class="info-title" :title="item.name">{{ item.name }}</h4>
          <p class="info-desc" :title="item.desc">{{ item.desc }}</p>
        </div>
        <button class="follow" v-if="!item.follow" @click="starFollow(index)">
          <span class="follow-text">关注</span>
        </button>
        <span class="follow-active-text" v-else>
          <i class="active-icon"></i>
          <span class="active-text">已关注</span>
        </span>
        <button class="delete-icon" @click="deleteStar(index)"></button>
      </li>
    </ul>
  </div>
  <div class="side-content">
    <h4 class="side-title">
      <span>感兴趣的人</span>
      <router-link class="link" to="" @click="changeABatch">换一批</router-link>
    </h4>
    <ul class="star-list interested-list">
      <li class="item" v-for="(item, index) in interestedList" :key="index">
        <div class="item-img">
          <img class="img" :src="item.src" alt="" />
        </div>
        <div class="info">
          <div
            class="info-title"
            :title="item.name"
            @click="jumpUserProfile(userInfo.profile?.userId)"
          >
            {{ item.name }}
          </div>
          <p class="info-desc" :title="item.desc">{{ item.desc }}</p>
        </div>
        <button class="follow" v-if="!item.follow" @click="interestedFollow(index)">
          <span class="follow-text">关注</span>
        </button>
        <span class="follow-active-text" v-else>
          <i class="active-icon"></i>
          <span class="active-text">已关注</span>
        </span>
        <button class="delete-icon" @click="deleteInterested(index)"></button>
      </li>
    </ul>
  </div>
  <div class="side-footer">
    <p>添加微博好友，和他们分享音乐</p>
    <a
      class="footer-micro-blog"
      href="`https://api.weibo.com/oauth2/authorize?client_id=301575942
      &response_type=code&redirect_uri=http://music.163.com/back/weibo
      &forcelogin=true&csrf_token=643fa51471e99a9de1952ffd30c0b0e1
      &scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog
      &state=FQffzGAsJk###`"
      target="_blank"
    >
      <i class="micro-blog-icon">
        <i class="icon"></i>
        <span class="title">绑定新浪微博</span>
      </i>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';

type MenuItem = {
  src: string;
  name: string;
  desc: string;
  follow: boolean;
};

const router = useRouter();
const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

const starList = ref<MenuItem[]>([
  {
    src: 'http://p1.music.126.net/RQT6l2Vd9mQ9bSA_9MdWBw==/109951163720144425.jpg?param=45y45',
    name: '品冠victor',
    desc: '台湾流行歌手品冠',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/fBd9G5UPnAkN5GJhD27f7w==/109951164233456965.jpg?param=45y45',
    name: '池约翰CJohnny',
    desc: 'MIC男团成员池约翰',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/HiaQmvjTbEXfo8bsiPv9rQ==/109951165312873539.jpg?param=45y45',
    name: '朱云',
    desc: '北京音乐台资深DJ',
    follow: false
  }
]);

const interestedList = ref<MenuItem[]>([
  {
    src: 'http://p1.music.126.net/cX7kFto1nsneNwo6jA9LfQ==/18531168976478340.jpg?param=30y30',
    name: '倒影着稚嫩的少年QAQ',
    desc: '手机联系人: xlz122',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/5SbSJXBSKFf7L_Etq0uNfA==/109951164928424086.jpg?param=30y30',
    name: '谈情了解一下啊',
    desc: '手机联系人: xlz122',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/KMqDxNvSaFIiZzE-crDTaA==/109951163209469519.jpg?param=30y30',
    name: 'Decennium青春世界',
    desc: '手机联系人: xlz122',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/464PBoavkf5z7a5hIwvhWw==/18738976673835955.jpg?param=30y30',
    name: 'Dreads丶流年',
    desc: '手机联系人: xlz122',
    follow: false
  },
  {
    src: 'http://p1.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg?param=30y30',
    name: 'E晓fire',
    desc: '手机联系人: xlz122',
    follow: false
  }
]);

// 换一批
function changeABatch(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 明星 - 关注
function starFollow(index: number): void {
  starList.value.forEach?.((item, ind) => {
    if (index === ind) {
      item.follow = true;
    }
  });

  setTimeout(() => {
    deleteStar(index);
  }, 1000);
}

// 明星 - 删除
function deleteStar(index: number): void {
  starList.value.splice?.(index, 1);
}

// 感兴趣 - 关注
function interestedFollow(index: number): void {
  interestedList.value.forEach?.((item, ind) => {
    if (index === ind) {
      item.follow = true;
    }
  });

  setTimeout(() => {
    deleteInterested(index);
  }, 1000);
}

// 感兴趣 - 删除
function deleteInterested(index: number): void {
  interestedList.value.splice?.(index, 1);
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./side.less');
</style>
