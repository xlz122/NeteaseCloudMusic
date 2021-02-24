<template>
  <div class="content">
    <div class="title">
      <span class="text">动态</span>
      <span class="title-btn dynamic" title="发动态"></span>
      <span class="title-btn video" title="发布视频"></span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in eventList" :key="index">
        <!-- 单曲 电台 -->
        <template v-if="item.type === 18">
          <div class="cover">
            <img
              class="img"
              :src="`${item?.user?.avatarUrl}?param=45y45`"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-title">
              <span class="t-text">{{ item?.user?.nickname }}</span>
              <i class="t-icon"></i>
              <span class="t-desc">分享单曲</span>
            </div>
            <div class="time">{{ formatDate(item?.showTime) }}</div>
            <div class="mood" v-html="item?.json?.msg"></div>
            <div class="music-info">
              <div class="music-cover">
                <img
                  class="cover-img"
                  :src="`${item?.json?.song?.album?.picUrl}?param=40y40`"
                  alt=""
                />
                <i class="play-icon"></i>
              </div>
              <div class="music-detail">
                <h3 class="music-detail-title">{{ item?.json?.song?.name }}</h3>
                <h4 class="music-detail-name">
                  {{ item?.json?.song?.artists[0].name }}
                </h4>
              </div>
            </div>
            <div class="operate">
              <span class="operate-btn">
                <i
                  class="operate-btn-icon"
                  :class="{ 'operate-btn-active-icon': item?.info?.liked }"
                ></i>
                <span
                  v-if="item?.info?.likedCount > 0"
                  class="operate-btn-text"
                >
                  ({{ item?.info?.likedCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">转发</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.insiteForwardCount > 0"
                >
                  ({{ item?.insiteForwardCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">评论</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.info?.commentThread?.commentCount > 0"
                >
                  ({{ item?.info?.commentThread?.commentCount }})
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 话题 -->
        <template v-if="item.type === 33">
          <div class="cover">
            <span class="img"></span>
          </div>
          <div class="topic">
            <img class="topic-img" :src="item?.json?.coverPCListUrl" />
            <span class="topic-img-mask"></span>
            <div class="topic-content">
              <h3 class="topic-content-title">#{{ item?.json?.title }}#</h3>
              <span class="participate-count">
                {{ item?.json?.participateCount }}人参与
              </span>
            </div>
            <i class="topic-close"></i>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { friendEvent } from '@api/friend';
import { LoopType, ResponseType } from '@/types/types';
import { formatDate } from '@utils/utils';
import { formatMixedText } from '@utils/formatMixedText';

export default defineComponent({
  setup() {
    const eventList = ref<unknown[]>([]);
    // 获取动态列表数据
    function getFriendEvent(): void {
      friendEvent().then((res: ResponseType) => {
        if (res.code === 200) {
          // json字符串转为对象
          res.event.forEach((item: LoopType) => {
            item.json = JSON.parse(item.json);
            // 单曲 电台，处理混合文本
            if (item.type === 18) {
              item.json.msg = formatMixedText(item.json.msg);
            }
          });
          eventList.value = res.event;
        }
      });
    }
    getFriendEvent();

    return {
      formatDate,
      eventList
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
