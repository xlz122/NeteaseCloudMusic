<template>
  <div class="singer-side-container">
    <template v-if="singerList?.length > 0">
      <h3 class="title">相似歌手</h3>
      <ul class="like-list">
        <li
          class="item"
          v-for="(item, index) in singerList"
          :key="index"
          :class="{ 'first-item': !(index % 3) }"
          @click="jumpSingerDetail(item.id)"
        >
          <router-link class="item-link" to="" :title="item.name">
            <img class="item-img" :src="`${item.picUrl}?param=50y50`" />
          </router-link>
          <p class="desc">{{ item.name }}</p>
        </li>
      </ul>
    </template>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
    <a class="supplement" href="#" target="_blank">补充或修改艺人资料></a>
    <a
      class="supplement"
      href="https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/recommend"
      target="_blank"
      >用户wiki任务中心></a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { simiArtist } from '@api/singer-detail';
import { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  props: {
    likePeople: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);
    const singerList = ref<unknown[]>([]);

    // 获取相似歌手
    function getSimiArtist(): void {
      simiArtist({ id: singerId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerList.value = res.artists.slice(0, 6);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSimiArtist();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 存储歌手id
      $store.commit('setSingerId', id);
      getSimiArtist();
    }

    return {
      singerList,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-detail-side.less';
</style>
