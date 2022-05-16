<template>
  <div class="singer-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="singer-info">
          <h2
            class="singer-username"
            :title="`${singerDetail?.artist?.name} - ${singerDetail?.artist?.englishName}`"
          >
            {{ singerDetail?.artist?.name }}
          </h2>
          <h3
            :title="`${singerDetail?.artist?.name} - ${singerDetail?.artist?.englishName}`"
            class="singer-english-name"
          >
            {{ singerDetail?.artist?.englishName }}
          </h3>
          <img
            v-if="singerDetail?.artist?.cover"
            class="singer-avatar"
            :src="`${singerDetail?.artist?.cover}?param=640y300`"
            alt=""
          />
          <img v-else class="singer-avatar" src="" alt="" />
          <i
            class="artist-home"
            v-if="singerDetail?.user"
            @click="jumpUserProfile(singerDetail?.user?.userId)"
          ></i>
          <template v-if="singerDetail?.user?.followed">
            <i
              class="artist-sub collected"
              @click="setArtistSub(singerDetail?.user?.followed)"
            ></i>
          </template>
          <template v-if="!singerDetail?.user?.followed">
            <i
              class="artist-sub"
              @click="setArtistSub(singerDetail?.user?.followed)"
            ></i>
          </template>
        </div>
        <ul class="singer-tabs">
          <li
            class="item"
            v-for="(item, index) in singerTabs"
            :key="index"
            :class="[
              { 'first-item': index === 0 },
              { 'active-item': index === singerTabIndex }
            ]"
            @click="tabChange(index)"
          >
            <span class="text">{{ item?.title }}</span>
          </li>
        </ul>
        <!-- 根据选中，渲染对应组件 -->
        <component
          :is="`${singerTabs[singerTabIndex]?.component}`"
          :singerDetail="singerDetail"
        ></component>
      </div>
      <div class="detail-side">
        <SingerDetailSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { artistDetail, artistSub } from '@api/singer-detail';
import { ResponseType } from '@/types/types';
import SingerDetailSide from './singer-detail-side/SingerDetailSide.vue';
import SingerSong from './singer-song/SingerSong.vue';
import SingerAlbum from './singer-album/SingerAlbum.vue';
import SingerMv from './singer-mv/SingerMv.vue';
import SingerIntroduce from './singer-introduce/SingerIntroduce.vue';

export default defineComponent({
  components: {
    SingerSong,
    SingerAlbum,
    SingerMv,
    SingerIntroduce,
    SingerDetailSide
  },
  setup() {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const singerId = computed<number>(() => $store.getters.singerId);
    const singerTabIndex = computed(() => $store.getters.singerTabIndex);

    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistDetail();
        }
      },
      {
        immediate: true
      }
    );

    const singerDetail = ref<Record<string, any>>([]);

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

    // 收藏/取消收藏歌手
    function setArtistSub(followed: boolean): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      // 1:收藏 2:取消收藏
      const t = followed ? 2 : 1;

      artistSub({ id: singerId.value, t })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            if (t === 1) {
              $store.commit('setMessage', {
                type: 'info',
                title: '收藏成功'
              });

              singerDetail.value.user.followed = true;
            }
            if (t === 2) {
              $store.commit('setMessage', {
                type: 'info',
                title: '取消收藏成功'
              });

              singerDetail.value.user.followed = false;
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // tab部分
    const singerTabs = reactive([
      {
        title: '热门作品',
        component: 'SingerSong'
      },
      {
        title: '所有专辑',
        component: 'SingerAlbum'
      },
      {
        title: '相似MV',
        component: 'SingerMv'
      },
      {
        title: '艺人介绍',
        component: 'SingerIntroduce'
      }
    ]);

    function tabChange(index: number): void {
      $store.commit('setSingerTabIndex', index);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      singerDetail,
      setArtistSub,
      singerTabs,
      singerTabIndex,
      tabChange,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-detail.less';
</style>
