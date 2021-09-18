<template>
  <div class="home-toplist">
    <div class="home-toplist-container">
      <div class="home-toplist-menu">
        <ToplistMenu @menuChange="menuChange" />
      </div>
      <div class="home-toplist-content">
        <ToplistContent
          :updateFrequency="updateFrequency"
          :songSheetDetail="songSheetDetail"
          :commentParams="commentParams"
          @commentRefresh="commentRefresh"
          @changPage="changPage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { playlistDetail } from '@api/song-sheet-detail';
import { commentPlayList } from '@api/my-music';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import ToplistMenu from './toplist-menu/ToplistMenu.vue';
import ToplistContent from './toplist-content/ToplistContent.vue';

export default defineComponent({
  name: 'home-toplist',
  components: {
    ToplistMenu,
    ToplistContent
  },
  setup() {
    const $store = useStore();

    // 歌单id
    const songSheetId = ref<number>(0);

    // 更新字符串
    const updateFrequency = ref<string>('');

    // 菜单选择
    function menuChange(id: number, frequency: string): void {
      songSheetId.value = id;
      updateFrequency.value = frequency;
      getSongDetail();
      getCommentData();
    }

    // 歌单详情数据
    const songSheetDetail = ref<unknown>({});

    // 获取歌单详情
    function getSongDetail(): void {
      // 清空歌单详情数据
      playlistDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetDetail.value = res;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 2,
      id: 0,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });

    watch(
      () => songSheetId.value,
      () => {
        commentParams.id = songSheetId.value;
      }
    );

    function getCommentData(): void {
      const params = {
        id: songSheetId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentPlayList({ ...params })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            const result = handleCommentData(res);
            // 精彩评论
            commentParams.hotList = result.hotList;
            // 最新评论
            commentParams.list = result.list;
            // 最新评论 - 总数
            commentParams.total = res.total;
          }
        })
        .catch(() => ({}));
    }

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    return {
      updateFrequency,
      menuChange,
      songSheetDetail,
      commentParams,
      commentRefresh,
      changPage
    };
  }
});
</script>

<style lang="less">
@import './home-toplist.less';
</style>
