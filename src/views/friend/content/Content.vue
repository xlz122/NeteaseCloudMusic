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
    <template v-if="eventList.length > 0">
      <ul class="list">
        <li class="item" v-for="(item, index) in eventList" :key="index">
          <Item
            :item="item"
            @setDynamicLike="setDynamicLike"
            @jumpUserProfile="jumpUserProfile"
            @playSingleMusic="playSingleMusic"
            @jumpSongDetail="jumpSongDetail"
            @jumpSingerDetail="jumpSingerDetail"
            @jumpAlbumDetail="jumpAlbumDetail"
          />
        </li>
      </ul>
    </template>
    <template v-if="!loading && eventList.length === 0">
      <div class="no-data">
        <div class="no-data-title">
          <i class="icon"></i>
          <p class="text">暂时还没有动态</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { setMessage } from '@/components/message/useMessage';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { formatMixedText } from '@/utils/formatMixedText';
import { friendEvent, dynamicLike } from '@/api/friend';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';
import Item from './Item.vue';

type EventItem = {
  id: number;
  info: {
    liked: boolean;
    likedCount: number;
  };
};

const $router = useRouter();

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

// 获取动态列表
const params = reactive({
  pagesize: 20,
  lasttime: -1
});
const loading = ref<boolean>(false);
const eventList = ref<EventItem[]>([]);
// 是否继续加载
const lock = ref<boolean>(true);

function getFriendEvent(): void {
  loading.value = true;

  friendEvent({ ...params })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        loading.value = false;
        // 下一页所需参数
        params.lasttime = res.lasttime;

        // json字符串转为对象，处理混合文本
        res.event.forEach((item: Record<string, any>) => {
          item.json = JSON.parse(item.json);
          item.json.msg = formatMixedText(item.json.msg);
        });
        eventList.value = eventList.value.concat(res.event);

        // 返回条数少于每页条数, 不再加载
        if (res.event.length === 0) {
          lock.value = false;
          return;
        }
        // 继续加载
        lock.value = true;
      }
    })
    .catch(() => ({}));
}
getFriendEvent();

// 播放单个歌曲
function playSingleMusic(item: Partial<SongType>): void {
  usePlaySingleMusic(item);
}

// 动态点赞
function setDynamicLike(id: number, threadId: number, type: number): void {
  // 页面静态修改
  const likeIndex = eventList.value.findIndex(item => item.id === id);
  if (type === 0) {
    eventList.value[likeIndex].info.liked = false;
    eventList.value[likeIndex].info.likedCount--;
  } else {
    eventList.value[likeIndex].info.liked = true;
    eventList.value[likeIndex].info.likedCount++;
  }

  // 接口修改
  dynamicLike({ cid: id, threadId, t: type });
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}

// 监听滚动
onMounted(() => {
  document.addEventListener('scroll', function (e: Event): void {
    const target = e.target as Document;
    // 滚动条高度
    const scrollHeight =
      (target ? target.documentElement.scrollHeight : false) ||
      (target ? target.body.scrollHeight : 0);
    // 视口高度
    const clientHeight =
      (target ? target.documentElement.clientHeight : false) ||
      (target ? target.body.clientHeight : 0);
    // 当前滚动的高度
    const scrollTop =
      (target ? target.documentElement.scrollTop : false) ||
      (target ? target.body.scrollTop : 0);
    // 距离底部高度(滚动条高度 - 视口高度 - 当前滚动的高度)
    const bottomHeight = scrollHeight - clientHeight - scrollTop;

    // 并非第一次加载 & 距离底部高度 & 是否可请求
    if (eventList.value.length > 0 && bottomHeight <= 400 && lock.value) {
      lock.value = false;
      getFriendEvent();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('scroll', () => ({}));
});
</script>

<style lang="less" scoped>
@import url('./content.less');
</style>
