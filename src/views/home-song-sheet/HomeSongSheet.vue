<template>
  <div class="home-song-sheet">
    <div class="home-song-sheet-container">
      <div class="title">
        <span class="text">{{ songTitle }}</span>
        <div class="classify-btn" @click="classifyModal">
          <i class="icon">
            <span class="text">选择分类</span>
            <span class="arrow"></span>
          </i>
        </div>
        <ClassifyModal v-show="classifyShow" @catChange="catChange" />
        <div class="hot-btn" @click="hotSong">
          <span class="text">热门</span>
        </div>
      </div>
      <ul class="list-content">
        <li
          class="item"
          v-for="(item, index) in songSheetList"
          :key="index"
          :class="{ 'last-item': songSheetList.length > 2 && !(index % 5) }"
        >
          <div class="item-top" @click="jumpSongSheetDetail(item.id)">
            <img
              class="img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              alt=""
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom">
            <span
              class="text"
              :title="item?.name"
              @click="jumpSongSheetDetail(item.id)"
            >
              {{ item?.name }}
            </span>
            <div class="desc">
              <span class="by">by</span>
              <span
                class="text"
                :title="item?.name"
                @click="jumpUserProfile(item?.creator?.userId)"
              >
                {{ item?.creator?.nickname }}
              </span>
              <!-- 小图标 -->
              <!-- <img
                class="desc-img"
                src=""
                alt=""
              /> -->
              <!-- <img
                class="desc-img"
                src=""
                alt=""
              /> -->
            </div>
          </div>
        </li>
      </ul>
      <!-- 参数从0开始，分页需从1开始 -->
      <Page
        v-if="songParams.total > songParams.pageSize"
        :page="songParams.page"
        :pageSize="songParams.pageSize"
        :total="songParams.total"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { topPlaylist } from '@api/home-song-sheet';
import { ResponseType, LoopType } from '@/types/types';
import { bigNumberTransform } from '@utils/utils';
import ClassifyModal from './classify-modal/ClassifyModal.vue';
import Page from '@components/page/Page.vue';

type SongParams = {
  order: string;
  cat: string;
  page: number;
  pageSize: number;
  total: number;
};

export default defineComponent({
  name: 'home-song-sheet',
  components: {
    ClassifyModal,
    Page
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    const songTitle = ref<string>('全部');
    const songSheetList = ref<unknown[]>([]);
    const songParams = reactive<SongParams>({
      order: 'hot',
      cat: '全部',
      page: 1,
      pageSize: 50,
      total: 0
    });
    // 获取热门歌单数据
    function getTopPlaylist(): void {
      topPlaylist({
        order: songParams.order,
        cat: songParams.cat,
        offset: songParams.page - 1,
        limit: songParams.pageSize
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songTitle.value = res.cat;
            // 统计数格式化
            res?.playlists.forEach((item: LoopType) => {
              item.playCount = bigNumberTransform(item.playCount);
            });
            songSheetList.value = res.playlists;
            songParams.total = res.total;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 监听路由传参
    watch(
      () => $route.params,
      (curVal: { name: string }) => {
        songParams.cat = '全部';
        if (curVal) {
          songParams.cat = curVal.name;
        }
        getTopPlaylist();
      },
      {
        immediate: true
      }
    );

    // 热门
    function hotSong(): boolean | undefined {
      if (songParams.cat === '全部') {
        return false;
      }
      songParams.cat = '全部';
      songParams.page = 1;
    }

    // 分类弹框
    const classifyShow = ref<boolean>(false);
    function classifyModal(): void {
      classifyShow.value = !classifyShow.value;
    }

    // 分类点击
    function catChange(name: string): boolean | undefined {
      if (songParams.cat === '全部' && name === '全部') {
        return false;
      }
      songParams.cat = name;
      songParams.page = 1;
      getTopPlaylist();
      classifyShow.value = false;
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { songSheetId: id } });
    }

    // 跳转用户资料
    function jumpUserProfile(userId: number): void {
      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);
      $router.push({ name: 'user-profile', params: { userId } });
    }

    // 分页
    function changPage(current: number): void {
      songParams.page = current;
      getTopPlaylist();
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
    });

    return {
      songTitle,
      songSheetList,
      songParams,
      hotSong,
      classifyShow,
      classifyModal,
      catChange,
      jumpSongSheetDetail,
      jumpUserProfile,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-song-sheet.less';
</style>
