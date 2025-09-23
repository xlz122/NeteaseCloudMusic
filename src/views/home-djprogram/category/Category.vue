<template>
  <div class="category-box">
    <ul class="category-list" v-show="mainMenuShow">
      <li
        class="item"
        v-for="(item, index) in menu.main"
        :key="index"
        :class="{ 'active-item': item.id === categoryId }"
        @click="categoryChange(item.id)"
      >
        <div class="item-cover">
          <i class="icon" :style="{ backgroundImage: `url(${item.picWebUrl})` }"></i>
          <span class="text">{{ item.name }}</span>
        </div>
      </li>
    </ul>
    <ul class="category-list" v-show="!mainMenuShow">
      <li
        class="item"
        v-for="(item, index) in menu.second"
        :key="index"
        :class="{ 'active-item': item.id === categoryId }"
        @click="categoryChange(item.id)"
      >
        <div class="item-cover">
          <i class="icon" :style="{ backgroundImage: `url(${item.picWebUrl})` }"></i>
          <span class="text">{{ item.name }}</span>
        </div>
      </li>
      <li class="item">
        <a class="item-cover" href="https://music.163.com/#/topic?id=18652232" target="_blank">
          <i class="icon problem"></i>
          <span class="text">常见问题</span>
        </a>
      </li>
      <li class="item">
        <a class="item-cover" href="https://music.163.com/st/radioweb/apply#/" target="_blank">
          <i class="icon anchor"></i>
          <span class="text anchor-text">我要做主播</span>
        </a>
      </li>
    </ul>
    <span class="btn prev-btn" :class="{ 'disable-btn': mainMenuShow }" @click="prev"></span>
    <span class="btn next-btn" :class="{ 'disable-btn': !mainMenuShow }" @click="next"></span>
    <ul class="dotpage">
      <li class="dot" :class="{ 'active-dot': dotIndex === 0 }" @click="dotChange(0)"></li>
      <li class="dot" :class="{ 'active-dot': dotIndex === 1 }" @click="dotChange(1)"></li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { djCatelist } from '@/api/home-djprogram';
import type { ResponseType } from '@/types';

type Menu = {
  main: MenuItem[];
  second: MenuItem[];
};

type MenuItem = {
  id: number;
  name: string;
  picWebUrl: string;
};

const emits = defineEmits(['categoryChange']);

// 获取电台分类列表
const menu = reactive<Menu>({
  main: [],
  second: []
});

function getMenuList(): void {
  djCatelist()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      menu.main = res.categories?.slice?.(0, 18) ?? [];
      menu.second = res.categories?.slice?.(18, 34) ?? [];
    })
    .catch(() => ({}));
}
getMenuList();

// 分类点击
const categoryId = ref(-1);

function categoryChange(id: number): void {
  categoryId.value = id;
  emits('categoryChange', id);
}

// 左右切换
const mainMenuShow = ref(true);
const dotIndex = ref(0);

function prev(): void {
  dotIndex.value = 0;
  mainMenuShow.value = true;
}

function next(): void {
  dotIndex.value = 1;
  mainMenuShow.value = false;
}

// 小圆点
function dotChange(index: number): void {
  if (index === 0) {
    dotIndex.value = index;
    mainMenuShow.value = true;
    return;
  }

  dotIndex.value = index;
  mainMenuShow.value = false;
}
</script>

<style lang="less" scoped>
@import url('./category.less');
</style>
