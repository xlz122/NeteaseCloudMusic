<template>
  <div class="djradio-detail">
    <div class="detail-container">
      <div class="detail-content">
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
                <span @click="jumpUserProfile(details?.dj?.userId)">
                  {{ details?.dj?.nickname }}
                </span>
                <img src="../../assets/image/user/member-music.png" alt="" />
              </div>
            </div>
            <div class="btns">
              <button type="button" class="btn subscribe">
                <i>订阅({{ details?.subCount }})</i>
              </button>
              <button type="button" class="btn play">
                <i>播放全部</i>
              </button>
              <button type="button" class="btn share" @click="handleShare">
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
                <a
                  class="ml5"
                  :href="`https://music.163.com/#/outchain/4/${$route.query.id}`"
                >
                  生成外链播放器
                </a>
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
      <div class="detail-side">
        <DjradioDetailSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { filterTime, timeStampToDuration } from '@/utils/utils';
import { djDetail, djProgram } from '@/api/home-djprogram';
import type { ResponseType } from '@/types/types';
import DjradioDetailSide from './djradio-detail-side/DjradioDetailSide.vue';

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

const toggleDesc = ref(true);
const sortSong = ref(true);

const details = ref({});
const songs = reactive({
  rid: 0,
  details: {}
});
const list = ref([]);

function detailsHandle() {
  djDetail({ rid: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        details.value = res.data;
        songs.rid = res?.data?.id;
        djProgramDetails(res?.data?.id);
      }
    })
    .catch(() => ({}));
}
detailsHandle();

function djProgramDetails(id: number) {
  djProgram({ rid: id, asc: sortSong.value })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        songs.details = res;
        list.value = res.programs;
      }
    })
    .catch(() => ({}));
}

function changeSongSort(change: boolean) {
  sortSong.value = change;
  djProgramDetails(songs.rid);
}

// 分享
function handleShare(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./djradio-detail.less');
</style>
