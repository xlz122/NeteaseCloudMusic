<template>
  <div class="singer-detail">
    <div class="singer-detail-container">
      <div class="singer-content">
        <div class="singer-info">
          <h2 class="singer-username">{{ singerDetail?.artist?.name }}</h2>
          <h3 class="singer-english-name">
            {{ singerDetail?.artist?.englishName }}
          </h3>
          <img
            class="singer-avatar"
            :src="`${singerDetail?.artist?.cover}?param=640y300`"
            alt=""
          />
          <i
            class="artist-home"
            v-if="singerDetail?.user"
            @click="jumpUserProfile(singerDetail?.user?.userId)"
          ></i>
          <i class="artist-sub"></i>
        </div>
        <ul class="singer-tabs">
          <li
            class="item"
            v-for="(item, index) in singerTabs"
            :key="index"
            :class="[
              { 'first-item': index === 0 },
              { 'active-item': index === tabActiveIndex }
            ]"
            @click="tabChange(index)"
          >
            <span class="text">{{ item.title }}</span>
          </li>
        </ul>
        <SingerSong v-if="tabActiveIndex === 0" />
        <SingerAlbum v-if="tabActiveIndex === 1" />
        <SingerIntroduce
          v-if="tabActiveIndex === 3"
          :nickname="singerDetail?.artist?.name"
        />
      </div>
      <div class="singer-side">
        <SingerDetailSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistDetail } from '@api/singer-detail';
import { ResponseType } from '@/types/types';
import SingerDetailSide from './singer-detail-side/SingerDetailSide.vue';
import SingerSong from './singer-song/SingerSong.vue';
import SingerAlbum from './singer-album/SingerAlbum.vue';
import SingerIntroduce from './singer-introduce/SingerIntroduce.vue';

export default defineComponent({
  components: {
    SingerSong,
    SingerAlbum,
    SingerIntroduce,
    SingerDetailSide
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);

    // 监听歌手id改变
    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistDetail();
        }
      }
    );

    const singerDetail = ref<unknown[]>([]);

    // 获取歌手详情
    function getArtistDetail(): void {
      artistDetail({ id: singerId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 处理英文名
            const briefDesc = res.data.artist.briefDesc;
            if (briefDesc.indexOf('（') && briefDesc.indexOf('）')) {
              res.data.artist.englishName = briefDesc.substring(
                briefDesc.indexOf('（') + 1,
                briefDesc.indexOf('）')
              );
            }
            singerDetail.value = res.data;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistDetail();

    // 跳转用户资料
    function jumpUserProfile(userId: number): void {
      $router.push({ name: 'user-profile', params: { id: userId } });
    }

    // tab部分
    const singerTabs = reactive([
      {
        title: '热门作品'
      },
      {
        title: '所有专辑'
      },
      {
        title: '相似MV'
      },
      {
        title: '艺人介绍'
      }
    ]);

    const tabActiveIndex = ref<number>(0);
    function tabChange(index: number): void {
      tabActiveIndex.value = index;
    }

    return {
      singerDetail,
      jumpUserProfile,
      singerTabs,
      tabActiveIndex,
      tabChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-detail.less';
</style>
