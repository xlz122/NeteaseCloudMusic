<template>
  <div class="singer-mv">
    <div class="singer-mv-container">
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in mvList?.mvs"
          :key="index"
        >
          <div class="item-cover" @click="jumpMvDetail">
            <img
              class="item-cover-img"
              :src="`${item.imgurl}?param=137y103`"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play"></i>
          </div>
          <p class="desc" @click="jumpMvDetail(item.id)">{{ item.name }}</p>
        </li>
      </ul>
      <!-- 参数从0开始，分页需从1开始 -->
      <Page
        v-if="mvParams.total > mvParams.limit"
        :page="mvParams.offset"
        :pageSize="mvParams.limit"
        :total="mvParams.total"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistMv } from '@api/singer-detail';
import { formatDateTime } from '@utils/utils.ts';
import { ResponseType } from '@/types/types';
import Page from '@components/page/Page.vue';

type MvParams = {
  offset: number;
  limit: number;
  total: number;
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    singerDetail: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const $router = useRouter();
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);

    // 监听歌手id改变
    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistMv();
        }
      }
    );

    // mv列表
    const mvList = ref();

    // 获取歌手Mv
    const mvParams = reactive<MvParams>({
      offset: 1, // 页数
      limit: 12, // 条数
      total: props.singerDetail?.artist?.mvSize // 总数
    });

    // 监听歌手详情，获取mv总数
    watch(
      () => props.singerDetail,
      () => {
        mvParams.total = props.singerDetail?.artist?.mvSize;
      }
    );

    function getArtistMv(): void {
      artistMv({
        id: singerId.value,
        offset: (mvParams.offset - 1) * mvParams.limit,
        limit: mvParams.limit
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            mvList.value = res;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistMv();

    // 跳转Mv详情
    function jumpMvDetail(id: number): void {
      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('setVideo', { id, url: '' });
    }

    // 分页
    function changPage(current: number): void {
      mvParams.offset = current;
      getArtistMv();
    }

    return {
      formatDateTime,
      mvList,
      mvParams,
      jumpMvDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-mv.less';
</style>
