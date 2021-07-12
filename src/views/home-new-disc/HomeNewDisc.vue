<template>
  <div class="home-new-disc">
    <div class="home-new-disc-container">
      <!-- 热门新碟 -->
      <div class="new-disc-title">热门新碟</div>
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in hotNewDiscList"
          :key="index"
          @click="hotNewDiscDetail(index)"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item.picUrl}?param=130y130`"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play"></i>
          </div>
          <p class="desc">{{ item.name }}</p>
          <p class="name">{{ item.artist.name }}</p>
        </li>
      </ul>
      <!-- 全部新碟 -->
      <div class="new-disc-title">
        全部新碟
        <ul class="tab">
          <li class="item first-item" @click="newDiscType('ALL')">全部</li>
          <li class="item" @click="newDiscType('ZH')">华语</li>
          <li class="item" @click="newDiscType('EA')">欧美</li>
          <li class="item" @click="newDiscType('KR')">韩国</li>
          <li class="item last-item" @click="newDiscType('JP')">日本</li>
        </ul>
      </div>
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in newDiscAlbumList"
          :key="index"
          @click="newDiscAlbumDetail(index)"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item.picUrl}?param=130y130`"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play"></i>
          </div>
          <p class="desc">{{ item.name }}</p>
          <p class="name">{{ item.artist.name }}</p>
        </li>
      </ul>
      <!-- 参数从0开始，分页需从1开始 -->
      <Page
        v-if="pageTotal > newDiscFormData.limit"
        :page="newDiscFormData.offset"
        :pageSize="newDiscFormData.limit"
        :total="pageTotal"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { hotNewDisc, nweDiscAlbum, NweDiscAlbum } from '@api/home-new-disc';
import { ResponseType } from '@/types/types';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    Page
  },
  setup() {
    const $store = useStore();

    const hotNewDiscList = ref<unknown[]>([]);
    // 获取热门新碟
    function getHotNewDisc(): void {
      hotNewDisc()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            hotNewDiscList.value = res.albums.slice(0, 10);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getHotNewDisc();

    // 新碟跳转
    function hotNewDiscDetail(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    const pageTotal = ref<number>(0);
    const newDiscFormData = reactive<NweDiscAlbum>({
      offset: 1, // 页数
      limit: 35, // 条数
      area: 'ALL' // 类型
    });
    const newDiscAlbumList = ref<unknown[]>([]);
    // 全部新碟
    function getNweDiscAlbum(): void {
      nweDiscAlbum({
        offset: newDiscFormData.offset - 1,
        limit: newDiscFormData.limit,
        area: newDiscFormData.area
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            pageTotal.value = res.total;
            newDiscAlbumList.value = res.albums;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getNweDiscAlbum();

    // 全部新碟类型切换
    function newDiscType(type: string): void {
      newDiscFormData.area = type;
      getNweDiscAlbum();
    }

    // 全部新碟详情跳转
    function newDiscAlbumDetail(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分页
    function changPage(current: number): void {
      newDiscFormData.offset = current - 1;
      getNweDiscAlbum();
    }

    return {
      hotNewDiscList,
      hotNewDiscDetail,
      newDiscAlbumList,
      pageTotal,
      newDiscFormData,
      newDiscType,
      newDiscAlbumDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-new-disc.less';
</style>
