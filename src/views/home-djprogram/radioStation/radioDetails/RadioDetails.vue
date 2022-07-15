<style lang="less" scoped>
@import url('./radioDetails.less');
</style>

<template>
  <div class="bg-gray-f2 detail">
    <div class="box-border dis-flex">
      <div class="detail-lf">
        <div class="dis-flex detail-top">
          <div class="cover-dj">
            <img :src="details?.picUrl" :alt="details?.name" />
          </div>
          <div class="cnt">
            <div class="hd dis-flex">
              <div class="icon"></div>
              <div class="tit">{{ details?.name }}</div>
            </div>
            <div class="user dis-flex align-center">
              <div class="face">
                <img :src="details?.dj?.avatarUrl" alt="头像" />
              </div>
              <div class="name">
                <span> {{ details?.dj?.nickname }} </span>
                <img
                  src="../../../../assets/image/user/member-music.png"
                  alt=""
                />
              </div>
            </div>
            <div class="btns">
              <button type="button" class="btn subscribe">
                <i>订阅({{ details?.subCount }})</i>
              </button>
              <button type="button" class="btn play" @click="playAllMusic">
                <i>播放全部</i>
              </button>
              <button type="button" class="btn share">
                <i>分享({{ details?.shareCount }})</i>
              </button>
            </div>
            <div class="intr inline-block">
              <div class="cat">
                <span class="category">{{ details?.category }}</span>
                <pre
                  class="f12 text-gray6"
                  :class="{ 'ellipsis-lines-4': toggleDesc }"
                  >{{ details.desc }}</pre
                >
              </div>
              <div class="toggledesc pointer" @click="toggleDesc = !toggleDesc">
                {{ toggleDesc ? '展开' : '收起' }}
                <i class="icon" :class="{ 'open-desc': toggleDesc }"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="song">
          <div class="title dis-flex justify-between align-center">
            <div class="lf dis-flex">
              <div class="f20">节目列表</div>
              <div class="f12 text-gray9 sub">
                共{{ songs?.details?.count }}期
              </div>
            </div>
            <div class="ri dis-flex">
              <div class="out">
                <i></i>
                <span class="ml5">生成外链播放器</span>
              </div>
              <div class="sort dis-flex align-center">
                <div
                  class="btn desc"
                  :class="{ 'btn-active': sortSong }"
                  title="降序"
                  @click="changeSongSort(true)"
                ></div>
                <div
                  class="btn asc"
                  :class="{ 'btn-active': !sortSong }"
                  title="升序"
                  @click="changeSongSort(false)"
                ></div>
              </div>
            </div>
          </div>
          <table class="list" cellpadding="0" cellspacing="0">
            <tr v-for="item in songs?.details?.programs" :key="item.id">
              <td class="dis-flex justify-between align-center">
                <span>{{ item.serialNum }}</span>
                <i></i>
              </td>
              <td class="">
                <div class="name ellipsis">{{ item.name }}</div>
                <div class="ic dis-flex">
                  <i class="icon u-icn1"></i>
                  <i class="icon u-icn2"></i>
                  <i class="icon u-icn3"></i>
                </div>
              </td>
              <td>
                播放{{
                  item.listenerCount / 10000 > 10
                    ? (item.listenerCount / 10000).toFixed(0) + '万'
                    : item.listenerCount
                }}
              </td>
              <td>赞{{ item.likedCount }}</td>
              <td>{{ filterTime(item.scheduledPublishTime) }}</td>
              <td>{{ timeStampToDuration(item.duration / 1000) }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="detail-ri">2</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { djDetail, djProgram } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';
import {
  filterTime,
  bigNumberTransform,
  timeStampToDuration
} from '@utils/utils';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
// import { SongType } from '@/common/audio';
// import usePlaySingleMusic from '@/common/usePlaySingleMusic';
// import useMusicToPlayList from '@/common/useMusicToPlayList';

export default defineComponent({
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const rid = computed<number>(
      () => Number($route.params.id) || $store.getters['radio/radioDetailId']
    );

    const toggleDesc = ref(true);
    const sortSong = ref(true);

    const details = ref({});
    const songs = reactive({
      rid: 0,
      details: {}
    });
    const list = ref([]);

    function detailsHandle(id: number) {
      djDetail({ rid: id }).then((res: ResponseType) => {
        if (res?.code === 200) {
          details.value = res.data;
          songs.rid = res?.data?.id;
          djProgramDetails(res?.data?.id);
        }
      });
    }
    detailsHandle(rid.value);

    function djProgramDetails(id: number) {
      djProgram({ rid: id, asc: sortSong.value }).then((res: ResponseType) => {
        if (res?.code === 200) {
          songs.details = res;
          list.value = res.programs;
        }
      });
    }

    function changeSongSort(change: boolean) {
      sortSong.value = change;
      djProgramDetails(songs.rid);
    }

    // 播放全部 - 默认播放列表第一项
    const playAllMusic = throttle(
      function () {
        // if (list.value.length === 0) {
        //   return false;
        // }
        //
        // const songList: Partial<SongType>[] = [];
        //
        // list.value.forEach((item: { id: number }) => {
        //   songList.push({
        //     ...item.mainSong,
        //     img80x80: item.coverUrl
        //
        //   });
        // });
        //
        // usePlaySingleMusic(songList[0]);
        // useMusicToPlayList({ music: songList, clear: true });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    return {
      details,
      toggleDesc,
      sortSong,
      changeSongSort,
      filterTime,
      bigNumberTransform,
      timeStampToDuration,
      songs,
      playAllMusic
    };
  }
});
</script>
