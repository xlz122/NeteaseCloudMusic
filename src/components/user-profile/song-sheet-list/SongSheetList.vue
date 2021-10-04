<template>
  <div class="song-sheet-container">
    <!-- 创建的歌单 -->
    <template v-if="songSheetList.createSongList.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="isLogOnUser">我创建的歌单</span>
          <!-- {{ userInfo?.profile?.nickname }} -->
          <span v-else>创建的歌单</span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList.createSongList.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList.createSongList"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
          @click="jumpSongSheetDetail(item.id)"
        >
          <div class="item-cover" :title="item.name">
            <img
              class="cover-img"
              :src="`${item.coverImgUrl}?param=140y140`"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item.playCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <p class="item-desc" :title="item.name">{{ item.name }}</p>
        </li>
      </ul>
    </template>
    <!-- 收藏的歌单 -->
    <template v-if="songSheetList.collectionSongList.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="isLogOnUser">我收藏的歌单</span>
          <!-- {{ userInfo?.profile?.nickname }} -->
          <span v-else>收藏的歌单</span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList.collectionSongList.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList.collectionSongList"
          :key="index"
          :class="{ 'first-list-item': index === 0 }"
          @click="jumpSongSheetDetail(item.id)"
        >
          <div class="item-cover" :title="item.name">
            <img
              class="cover-img"
              :src="`${item.coverImgUrl}?param=140y140`"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item.playCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <p class="item-desc" :title="item.name">{{ item.name }}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { userPlayList } from '@api/my-music';
import { SongList, ResponseType, LoopType } from '@/types/types';
import { bigNumberTransform } from '@utils/utils';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    // 用户uid
    const uid = computed(() => $store.getters.userId);
    // 监听路由传参，获取用户详情、歌单列表
    watch(
      () => $route.params,
      curVal => {
        // 传入
        if (curVal.userId) {
          $store.commit('setUserId', Number(curVal.userId));
          getUserPlayList();
          return false;
        }
        // 刷新
        if (uid.value) {
          getUserPlayList();
        }
      },
      {
        immediate: true
      }
    );

    // 传入的uid是否是当前登录用户
    const isLogOnUser = ref<boolean>(false);
    const isLogin = computed(() => $store.getters.isLogin);
    function getIsLoginUser(): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      if ($store.getters.userInfo?.profile.userId === uid.value) {
        isLogOnUser.value = true;
        return false;
      }
      isLogOnUser.value = false;
    }
    getIsLoginUser();

    // 获取歌单列表
    const songSheetList = reactive<SongList>({
      createSongList: [], // 创建的歌单
      collectionSongList: [] // 收藏的歌单
    });
    function getUserPlayList(): void {
      userPlayList({
        uid: uid.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 清空歌单列表
            songSheetList.createSongList = [];
            songSheetList.collectionSongList = [];
            // 处理列表数据
            res.playlist.forEach((item: LoopType) => {
              // 喜欢的音乐处理
              if (isLogOnUser.value && item.name.includes('喜欢的音乐')) {
                item.name = '我喜欢的音乐';
              }
              // 收藏列表判断
              if (!item.subscribed) {
                songSheetList.createSongList.push(item);
              } else {
                songSheetList.collectionSongList.push(item);
              }
              // 统计处理
              item.playCount = bigNumberTransform(item.playCount);
            });
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { songSheetId: id } });
    }

    return {
      isLogOnUser,
      songSheetList,
      jumpSongSheetDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-list.less';
</style>
