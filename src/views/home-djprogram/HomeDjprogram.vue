<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category @categoryChange="categoryChange" />
      <div class="ranking-list">
        <Recommend />
        <RankiList />
      </div>
      <RadioStation name="音乐播客" :list="podcast" />
      <RadioStation name="生活" :list="life" />
      <RadioStation name="情感" :list="emotion" />
      <RadioStation name="创作翻唱" :list="cover" />
      <RadioStation name="知识" :list="knowledge" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { setMessage } from '@/hooks/useMessage';
import { djCatelist, recommendTypeList } from '@/api/home-djprogram';
import type { ResponseType } from '@/types';
import Category from './category/Category.vue';
import Recommend from './recommend/ReCommend.vue';
import RankiList from './ranki-list/RankiList.vue';
import RadioStation from './radio-station/RadioStation.vue';

type DjcateType = {
  id: number;
  name: string;
};

type RecommendItem = {
  id: number;
  name: string;
  picUrl: string;
  rcmdtext: string;
};

// 分类点击
function categoryChange(id: number): void {
  setMessage({ type: 'info', title: `分类id:${id}` });
}

// 获取电台推荐列表
const podcast = ref<RecommendItem[]>([]);
const life = ref<RecommendItem[]>([]);
const emotion = ref<RecommendItem[]>([]);
const cover = ref<RecommendItem[]>([]);
const knowledge = ref<RecommendItem[]>([]);

async function getRecommendList(): Promise<void> {
  const categories = await getDjcateType();

  categories.forEach?.(async (item) => {
    if (item.name === '音乐播客') {
      podcast.value = await getDjcateRecommend(item.id);
    }
    if (item.name === '生活') {
      life.value = await getDjcateRecommend(item.id);
    }
    if (item.name === '情感') {
      emotion.value = await getDjcateRecommend(item.id);
    }
    if (item.name === '创作翻唱') {
      cover.value = await getDjcateRecommend(item.id);
    }
    if (item.name === '知识') {
      knowledge.value = await getDjcateRecommend(item.id);
    }
  });
}
getRecommendList();

// 获取全部电台类型
function getDjcateType(): Promise<DjcateType[]> {
  return new Promise((resolve) => {
    djCatelist()
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        resolve(res.categories ?? []);
      })
      .catch(() => ({}));
  });
}

// 获取电台类型推荐
function getDjcateRecommend(id: number): Promise<RecommendItem[]> {
  return new Promise((resolve) => {
    recommendTypeList({ type: id })
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        resolve(res.djRadios ?? []);
      })
      .catch(() => ({}));
  });
}
</script>

<style lang="less" scoped>
@import url('./home-djprogram.less');
</style>
