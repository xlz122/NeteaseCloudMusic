<template>
  <div class="my-music" v-if="isLogin">
    <div class="my-music-container">
      <div class="my-music-scroll">
        <h2
          class="music-my-mv"
          :class="{ 'music-my-mv-active': myMvActive }"
          @click="getMyMvSbulist"
        >
          我的视频({{ myMvCount }})
        </h2>
        <div class="music-play-list">
          <div class="title">
            <div class="title-left" @click="playList">
              <i
                class="icon-arrow"
                :class="{ 'icon-arrow-down': playListShow }"
              ></i>
              <h2 class="text">创建的歌单</h2>
              <h2 class="text-num">({{ createdPlayCount }})</h2>
            </div>
            <div class="title-right">新建</div>
          </div>
          <ul class="list" v-if="playListShow">
            <li
              class="item"
              v-for="(item, index) in playListData"
              :key="index"
              @click="playListOption(item)"
            >
              <div class="item-left">
                <img class="img" :src="item.coverImgUrl" alt="" />
              </div>
              <div class="item-right">
                <span class="name">{{ item.name }}</span>
                <span class="num">{{ item.trackCount }}首</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="my-music-main">
        <my-mv :myMvList="myMvList" :myMvCount="myMvCount" />
      </div>
    </div>
  </div>
  <div class="my-music" v-else>
    <div class="my-music-login">
      <div class="login-content">
        <button class="login-btn" @click="openLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import MyMv from '@views/my-music/MyMv.vue';
import { userSubcount, myMvSbulist, userPlayList } from '@api/my-music';
import { ResponseDataType } from '@/types/types';

interface ClassifyCount {
  [key: string]: any;
}

export default defineComponent({
  components: {
    MyMv
  },
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 我的视频数量
    const myMvCount = ref<number>(0);
    // 创建歌单数量
    const createdPlayCount = ref<number>(0);

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      userSubcount().then((res: ClassifyCount) => {
        myMvCount.value = res.mvCount || 0;
        createdPlayCount.value = res.createdPlaylistCount || 0;
      });
    }
    getUserSubcount();

    // 获取我的视频列表
    const myMvList = ref<unknown[]>([]);
    const myMvActive = ref<boolean>(false);
    function getMyMvSbulist(): void {
      myMvActive.value = true;
      myMvSbulist().then((res: ResponseDataType) => {
        if (res.code == 200) {
          myMvCount.value = res.count || 0;
          myMvList.value = res.data;
        }
      });
    }

    // 创建的歌单显隐
    const playListShow = ref<boolean>(true);
    function playList(): void {
      playListShow.value = !playListShow.value;
      // 我的视频取消选中
      myMvActive.value = false;
      if (playListShow.value) {
        getUserPlayList();
      }
    }

    // 获取创建的歌单列表
    const playListData = ref<unknown[]>([]);
    function getUserPlayList(): boolean | undefined {
      // 重复请求
      if (playListData.value.length > 0) {
        return false;
      }
      // 账户数据
      const accountInfo = computed(() => $store.getters.accountInfo);
      userPlayList({
        uid: accountInfo.value.id
      }).then((res: ClassifyCount) => {
        if (res.code == 200) {
          playListData.value = res.playlist;
        }
      });
    }
    getUserPlayList();

    // 创建的歌单项点击
    function playListOption(item: unknown): void {
      console.log(item);
    }

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      myMvActive,
      myMvList,
      myMvCount,
      createdPlayCount,
      getMyMvSbulist,
      playList,
      playListShow,
      playListData,
      playListOption,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './my-music.less';
</style>
