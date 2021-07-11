<template>
  <div class="category-box">
    <ul class="category-list" v-show="mainListShow">
      <li
        class="item"
        v-for="(item, index) in category.main"
        :key="index"
        :class="[
          { 'last-item': !(index % 9) },
          { 'active-item': item.id === categorId }
        ]"
        @click="djCategorChange(item.id)"
      >
        <div class="item-cover">
          <i
            class="icon"
            :style="{ backgroundImage: `url(${item.picWebUrl})` }"
          ></i>
          <span class="text">{{ item.name }}</span>
        </div>
      </li>
    </ul>
    <ul class="category-list" v-show="!mainListShow">
      <li
        class="item"
        v-for="(item, index) in category.second"
        :key="index"
        :class="[
          { 'last-item': !(index % 9) },
          { 'active-item': item.id === categorId }
        ]"
        @click="djCategorChange(item.id)"
      >
        <div class="item-cover">
          <i
            class="icon"
            :style="{ backgroundImage: `url(${item.picWebUrl})` }"
          ></i>
          <span class="text">{{ item.name }}</span>
        </div>
      </li>
      <li class="item">
        <a
          class="item-cover"
          href="https://music.163.com/#/topic?id=18652232"
          target="_blank"
        >
          <i class="icon problem"></i>
          <span class="text">常见问题</span>
        </a>
      </li>
      <li class="item">
        <a
          class="item-cover"
          href="https://music.163.com/st/radioweb/apply#/"
          target="_blank"
        >
          <i class="icon anchor"></i>
          <span class="text anchor-text">我要做主播</span>
        </a>
      </li>
    </ul>
    <span
      class="btn prev-btn"
      :class="{ 'disable-btn': mainListShow }"
      @click="prev"
    ></span>
    <span
      class="btn next-btn"
      :class="{ 'disable-btn': !mainListShow }"
      @click="next"
    ></span>
    <ul class="dotpage">
      <li
        class="dot"
        :class="{ 'active-dot': dotIndex === 0 }"
        @click="dotChange(0)"
      ></li>
      <li
        class="dot"
        :class="{ 'active-dot': dotIndex === 1 }"
        @click="dotChange(1)"
      ></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { djCatelist } from '@api/home-djprogram';
import { ResponseType } from '@/types/types';

export default defineComponent({
  emits: ['djCategorChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const category = reactive({
      main: [],
      second: []
    });
    // 获取电台分类列表
    function getDjCategory(): void {
      djCatelist()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            category.main = res.categories.slice(0, 18);
            if (res.categories.length > 18) {
              category.second = res.categories.slice(18, 34);
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    getDjCategory();

    const categorId = ref<number>(-1);
    // 详情点击
    function djCategorChange(id: number): void {
      categorId.value = id;
      emit('djCategorChange', id);
    }

    const mainListShow = ref<boolean>(true);
    const dotIndex = ref<number>(0);

    // 左右切换
    function prev(): void {
      mainListShow.value = true;
      dotIndex.value = 0;
    }

    function next(): void {
      mainListShow.value = false;
      dotIndex.value = 1;
    }

    // 小圆点
    function dotChange(index: number): void {
      dotIndex.value = index;
      if (index === 0) {
        mainListShow.value = true;
      } else {
        mainListShow.value = false;
      }
    }

    return {
      category,
      categorId,
      djCategorChange,
      mainListShow,
      prev,
      next,
      dotIndex,
      dotChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './category.less';
</style>
