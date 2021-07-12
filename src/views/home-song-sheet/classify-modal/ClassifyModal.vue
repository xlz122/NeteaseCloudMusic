<template>
  <div class="classify-modal">
    <div class="hd">
      <i class="icon"></i>
    </div>
    <div class="bd">
      <div class="hot">
        <div class="hot-btn" @click="catChange('全部')">
          <span class="text">全部风格</span>
        </div>
      </div>
      <ul class="list">
        <li class="item" v-for="(item, index) in catlist" :key="index">
          <div class="title">
            <i
              class="icon"
              :class="[
                { style: index === 1 },
                { scene: index === 2 },
                { emotion: index === 3 },
                { theme: index === 4 }
              ]"
            ></i>
            <span class="text">{{ item.title }}</span>
          </div>
          <ul class="sub-list">
            <li
              class="sub-list-item"
              v-for="(i, ind) in item.list"
              :key="ind"
              @click="catChange(i.name)"
            >
              <span class="text">{{ i.name }}</span>
              <span class="line">|</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="ft"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import { playlistCatlist } from '@api/home-song-sheet';
import { ResponseType, LoopType } from '@/types/types';

type CatList = {
  title: string;
  list: unknown[];
};

export default defineComponent({
  emits: ['catChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const catlist = reactive<CatList[]>([
      {
        title: '',
        list: []
      },
      {
        title: '',
        list: []
      },
      {
        title: '',
        list: []
      },
      {
        title: '',
        list: []
      },
      {
        title: '',
        list: []
      }
    ]);

    function getCatlist(): void {
      playlistCatlist()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            for (let value in res.categories) {
              catlist[value].title = res.categories[value];
            }
            res?.sub.forEach((item: LoopType) => {
              if (item.category === 0) {
                catlist[0].list.push(item);
              }
              if (item.category === 1) {
                catlist[1].list.push(item);
              }
              if (item.category === 2) {
                catlist[2].list.push(item);
              }
              if (item.category === 3) {
                catlist[3].list.push(item);
              }
              if (item.category === 4) {
                catlist[4].list.push(item);
              }
            });
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getCatlist();

    // 标签点击
    function catChange(name: string): void {
      emit('catChange', name);
    }

    return {
      catlist,
      catChange
    };
  }
});
</script>

<style lang="less" scoped>
@import './classify-modal.less';
</style>
