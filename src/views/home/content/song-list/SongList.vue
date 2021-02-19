<template>
  <div class="song-list">
    <dl class="group" v-for="(item, index) in listData" :key="index">
      <dt class="top">
        <div class="top-img">
          <img
            class="img"
            :src="item?.playlist?.coverImgUrl"
            :alt="item?.playlist?.name"
          />
        </div>
        <div class="title">
          <h3 class="t-text">{{ item?.playlist?.name }}</h3>
          <div class="btns">
            <i class="btn-play" title="播放"></i>
            <i class="btn-collection" title="收藏"></i>
          </div>
        </div>
      </dt>
      <dd>
        <ul class="list">
          <li
            class="item"
            v-for="(i, ind) in item?.playlist?.tracks.slice(0, 10)"
            :key="ind"
          >
            <span class="num" :class="{ topThree: ind < 3 }">
              {{ ind }}
            </span>
            <p class="text">{{ i.name }}</p>
            <div class="operate">
              <i class="operate-play" title="播放"></i>
              <i class="operate-add" title="添加到播放列表"></i>
              <i class="operate-collection" title="收藏"></i>
            </div>
          </li>
        </ul>
        <div class="more">查看全部></div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { soaringList, newSongs, originalList } from '@api/home';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const listData = reactive<unknown[]>([]);
    // 获取飙升榜数据
    function getSoaringList(): void {
      soaringList().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getSoaringList();

    // 获取新歌榜数据
    function getNewSongs(): void {
      newSongs().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getNewSongs();

    // 获取原创榜数据
    function getOriginalList(): void {
      originalList().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getOriginalList();
    return {
      listData
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-list.less';
</style>
