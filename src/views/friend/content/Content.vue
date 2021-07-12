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
    <ul class="list">
      <li class="item" v-for="(item, index) in eventList" :key="index">
        <Item :item="item" />
      </li>
    </ul>
    <!-- loading -->
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { friendEvent, dynamicLike, FirendEvent } from '@api/friend';
import { LoopType, ResponseType } from '@/types/types';
import { getPageBottomHeight } from '@utils/utils';
import { formatMixedText } from '@utils/formatMixedText';
import Item from './Item.vue';

export default defineComponent({
  components: {
    Item
  },
  setup() {
    const $store = useStore();

    // 发动态
    function releaseDynamic(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
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
    // 动态列表参数
    const firendEventParams = reactive<FirendEvent>({
      pagesize: 20,
      lasttime: -1
    });

    // 列表数据
    const eventList = ref<LoopType[]>([]);
    // 获取动态列表数据
    function getFriendEvent(): void {
      loading.value = true;
      friendEvent({ ...firendEventParams })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            loading.value = false;
            // json字符串转为对象，处理混合文本
            res.event.forEach((item: LoopType) => {
              item.json = JSON.parse(item.json);
              item.json.msg = formatMixedText(item.json.msg);
            });
            eventList.value = eventList.value.concat(res.event);
            // 下一页所需参数
            firendEventParams.lasttime = res.lasttime;
            // 返回条数少于每页条数，不再加载
            if (res.event.length < firendEventParams.pagesize) {
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

    // 动态点赞
    function setDynamicLike(id: number, threadId: number, type: number): void {
      // 页面静态修改
      const likeIndex = eventList.value.findIndex(
        (item: LoopType) => item.id === id
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
      setDynamicLike
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
