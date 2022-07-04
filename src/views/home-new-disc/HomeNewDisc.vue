<template>
  <div class="home-new-disc">
    <div class="home-new-disc-container">
      <div class="new-disc-title">热门新碟</div>
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in hotNewDiscList"
          :key="index"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item?.picUrl}?param=130y130`"
              :title="item?.name"
              alt=""
              @click="jumpAlbumDetail(item?.id)"
            />
            <i class="item-cover-bg"></i>
            <i
              class="item-cover-play"
              title="播放"
              @click="albumToPlayListPlay(item?.id)"
            ></i>
          </div>
          <p
            class="desc"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item?.artists" :key="ind">
              <span
                class="name"
                :title="i?.name"
                @click="jumpSingerDetail(i?.id)"
              >
                {{ i?.name }}
              </span>
              <span class="line" v-if="ind !== item?.artists.length - 1">
                /
              </span>
            </template>
          </div>
        </li>
      </ul>
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
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item?.picUrl}?param=130y130`"
              :title="item?.name"
              alt=""
              @click="jumpAlbumDetail(item?.id)"
            />
            <i class="item-cover-bg"></i>
            <i
              class="item-cover-play"
              title="播放"
              @click="albumToPlayListPlay(item?.id)"
            ></i>
          </div>
          <p
            class="desc"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item?.artists" :key="ind">
              <span
                class="name"
                :title="i?.name"
                @click="jumpSingerDetail(i?.id)"
              >
                {{ i?.name }}
              </span>
              <span class="line" v-if="ind !== item?.artists?.length - 1">
                /
              </span>
            </template>
          </div>
        </li>
      </ul>
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
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { hotNewDisc, nweDiscAlbum, NweDiscAlbum } from '@api/home-new-disc';
import { albumDetail } from '@api/album-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';
import Page from '@components/page/Page.vue';

export default defineComponent({
  name: 'home-new-disc',
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
          }
        })
        .catch(() => ({}));
    }
    getHotNewDisc();

    // 专辑歌曲添加到播放器
    function albumToPlayListPlay(id: number): void {
      albumDetail({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }

            // 歌曲是否全部无版权
            const allNoCopyright = res?.songs?.some(
              (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
            );
            if (!allNoCopyright) {
              $store.commit('setCopyright', {
                visible: true,
                message:
                  '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
              });
              return false;
            }

            // 过滤无版权
            const songList: Partial<SongType>[] = res?.songs.filter(
              (item: Record<string, { cp: number }>) =>
                item?.privilege?.cp !== 0
            );

            usePlaySingleMusic(songList[0]);
            useMusicToPlayList({ music: songList, clear: true });
          }
        })
        .catch(() => ({}));
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
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
        offset: (newDiscFormData.offset - 1) * newDiscFormData.limit,
        limit: newDiscFormData.limit,
        area: newDiscFormData.area
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            pageTotal.value = res.total;
            newDiscAlbumList.value = res.albums;
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

    // 分页
    function changPage(current: number): void {
      newDiscFormData.offset = current;
      getNweDiscAlbum();
    }

    return {
      hotNewDiscList,
      albumToPlayListPlay,
      jumpAlbumDetail,
      jumpSingerDetail,
      newDiscAlbumList,
      pageTotal,
      newDiscFormData,
      newDiscType,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-new-disc.less';
</style>
