<template>
  <ul class="search-song">
    <li
      class="item"
      v-for="(item, index) in list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div class="td play-icon" @click="playListMusic(item.id, item)"></div>
      <div class="td td1">
        <div class="text">
          <span class="name" @click="jumpSongDetail(item.id)">
            {{ item?.name }}
          </span>
          <span class="desc" v-if="item?.tns?.length">
            - ({{ item.tns[0] }})
          </span>
          <i class="icon-play" v-if="item.mv > 0"></i>
        </div>
      </div>
      <!-- 操作项 -->
      <div class="td td2">
        <div class="operate-btn">
          <i class="icon add" @click="setAddSinglePlayList(item.id)"></i>
          <i class="icon collect"></i>
          <i class="icon share"></i>
          <i class="icon download"></i>
          <!-- 用户自己才有删除按钮 -->
          <i
            class="icon delete"
            v-if="item?.ar[0]?.id === userInfo?.profile?.userId"
            @click="deleteMusicShow(item.id)"
          ></i>
        </div>
      </div>
      <div class="td td3">
        <div class="text">
          <span class="name" @click="jumpSingerDetail(item?.ar[0]?.id)">
            {{ item?.ar[0]?.name }}
          </span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span class="name">{{ item?.al?.name }}</span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item.dt / 1000) }}</div>
    </li>
  </ul>
  <Page
    v-if="total > pageSize"
    :page="page"
    :pageSize="pageSize"
    :total="total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    Page
  },
  props: {
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 10
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['changPage'],
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌曲id
      $store.commit('setSongId', id);
      $router.push({ name: 'song-detail', params: { songId: id } });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(id: number): void {
      if (props.list.length > 0) {
        const musicItem = props.list.find((item: any) => item.id === id);
        // 播放音乐数据
        $store.commit('music/setPlayMusicList', musicItem);
      }
    }

    // 播放列表音乐
    function playListMusic(id: number, item: Record<string, any>): void {
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 分页
    function changPage(current: number): void {
      emit('changPage', current);
    }
    return {
      timeStampToDuration,
      userInfo,
      jumpSongDetail,
      jumpSingerDetail,
      setAddSinglePlayList,
      playListMusic,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song.less';
</style>
