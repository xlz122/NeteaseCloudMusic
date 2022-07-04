<template>
  <div class="content">
    <div class="title">
      <span class="text">动态</span>
      <span
        class="title-btn dynamic"
        title="发动态"
        @click="releaseDynamic"
      ></span>
      <span
        class="title-btn video"
        title="发布视频"
        @click="releaseVideo"
      ></span>
    </div>
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in eventList" :key="index">
        <Item
          :item="item"
          @jumpUserProfile="jumpUserProfile"
          @playSingleMusic="playSingleMusic"
          @jumpSongDetail="jumpSongDetail"
          @jumpSingerDetail="jumpSingerDetail"
          @jumpAlbumDetail="jumpAlbumDetail"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { formatMixedText } from '@utils/formatMixedText';
import { getPageBottomHeight } from '@utils/utils';
import { friendEvent, dynamicLike, FirendEvent } from '@api/friend';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';
import Item from './Item.vue';

export default defineComponent({
  name: 'FriendContent',
  components: {
    Item
  },
  setup() {
    const $store = useStore();

    // 发动态
    function releaseDynamic(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 发布视频
    function releaseVideo(): void {
      window.open(
        'https://music.163.com/st/creator/upload/video?from=%2Ffriend#/',
        '_blank'
      );
    }

    const loading = ref<boolean>(false);
    // 是否继续加载
    const lock = ref<boolean>(true);
    const firendEventParams = reactive<FirendEvent>({
      pagesize: 20,
      lasttime: -1
    });
    const eventList = ref<Record<string, any>>([]);

    // 获取动态列表数据
    function getFriendEvent(): void {
      loading.value = true;
      friendEvent({ ...firendEventParams })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            loading.value = false;
            // json字符串转为对象，处理混合文本
            res.event.forEach((item: Record<string, any>) => {
              item.json = JSON.parse(item.json);
              item.json.msg = formatMixedText(item.json.msg);
            });
            eventList.value = eventList.value.concat(res.event);
            // 下一页所需参数
            firendEventParams.lasttime = res.lasttime;
            // 返回条数少于每页条数，不再加载
            if (res.event.length === 0) {
              lock.value = false;
              return false;
            }
            // 继续加载
            lock.value = true;
          }
        })
        .catch(() => {
          loading.value = false;
        });
    }
    getFriendEvent();

    // 播放单个歌曲
    function playSingleMusic(item: Partial<SongType>): void {
      usePlaySingleMusic(item);
    }

    // 动态点赞
    function setDynamicLike(id: number, threadId: number, type: number): void {
      // 页面静态修改
      const likeIndex = eventList.value.findIndex(
        (item: { id: number }) => item.id === id
      );
      if (type === 0) {
        eventList.value[likeIndex].info.liked = false;
        eventList.value[likeIndex].info.likedCount--;
      } else {
        eventList.value[likeIndex].info.liked = true;
        eventList.value[likeIndex].info.likedCount++;
      }

      // 接口修改
      dynamicLike({
        cid: id,
        threadId,
        t: type
      });
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 监听滚动
    onMounted(() => {
      document.addEventListener('scroll', function (e: Event): void {
        const bottomHeight = getPageBottomHeight(e);
        // 并非第一次加载 距离底部高度 是否可请求
        if (eventList.value.length > 0 && bottomHeight <= 400 && lock.value) {
          lock.value = false;
          getFriendEvent();
        }
      });
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', () => ({}));
    });

    return {
      releaseDynamic,
      releaseVideo,
      eventList,
      loading,
      playSingleMusic,
      setDynamicLike,
      jumpUserProfile,
      jumpSongDetail,
      jumpSingerDetail,
      jumpAlbumDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
