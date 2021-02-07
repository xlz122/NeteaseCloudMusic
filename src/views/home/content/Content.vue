<template>
  <div class="content">
    <div class="group">
      <div class="list-title">
        <span class="title">热门推荐</span>
        <ul class="tab">
          <li class="item first-item">华语</li>
          <li class="item">流行</li>
          <li class="item">摇滚</li>
          <li class="item">民谣</li>
          <li class="item last-item">电子</li>
        </ul>
        <span class="more">更多</span>
      </div>
      <ul class="list-content">
        <li class="item">
          <div class="item-top">
            <img class="img" src="" alt="" />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">161万</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom" title="快过年了 给你熬了一碗音乐鸡汤">
            快过年了 给你熬了一碗音乐鸡汤
          </div>
        </li>
      </ul>
    </div>
    <!-- 个性化推荐 -->
    <div class="group">
      <div class="list-title">
        <span class="title">个性化推荐</span>
      </div>
      <ul class="list-content">
        <li class="item individualization">
          <div class="item-top">
            <i class="img"></i>
            <span class="head">星期日</span>
            <span class="head-text">7</span>
            <span class="mask"></span>
          </div>
          <div class="item-bottom" title="每日歌曲推荐">每日歌曲推荐</div>
          <em class="item-like">猜你喜欢</em>
        </li>
        <li
          class="item individualization"
          v-for="(item, index) in individualizatData"
          :key="index"
          :class="{ 'last-item': index === individualizatData.length - 1 }"
        >
          <div class="item-top">
            <img class="img" :src="item.picUrl" alt="" />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item.playcount }}</span>
              <i class="info-icon-right"></i>
            </div>
          </div>
          <div class="item-bottom" title="快过年了 给你熬了一碗音乐鸡汤">
            {{ item.name }}
          </div>
          <em class="item-like">{{ item.copywriter }}</em>
          <button class="disable-like">不感兴趣</button>
        </li>
      </ul>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">新碟上架</span>
        <span class="more">更多</span>
      </div>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">榜单</span>
        <span class="more">更多</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { recommendResource } from '@api/home';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const individualizatData = ref<unknown[]>([]);
    // 获取个性化推荐数据
    function getIndividualizat(): void {
      recommendResource().then((res: ResponseType) => {
        // 截取前三项
        individualizatData.value = res?.recommend.slice(0, 3);
      });
    }
    getIndividualizat();
    return {
      individualizatData
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
