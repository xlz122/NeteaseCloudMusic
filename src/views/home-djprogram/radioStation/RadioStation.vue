<template>
  <div class="radio-station">
    <div class="top dis-flex align-center justify-between">
      <div class="title ff2">
        <router-link to="">{{ name }}</router-link>
        <span class="ff1">·</span>
        电台
      </div>
      <router-link to="" class="more">更多 ></router-link>
    </div>
    <div class="dis-flex flex-wrap">
      <div
        class="rdilist dis-flex"
        v-for="item in list.slice(0, 4)"
        :key="item.id"
      >
        <div class="pic-url pointer" @click="jumpDetail(item.id)">
          <img :src="item.picUrl" alt="电台图片" />
        </div>
        <div class="cnt">
          <div class="name" :title="item.name">{{ item.name }}</div>
          <div class="note">{{ item.rcmdtext }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

type ItemType = {
  id: number;
  name: string;
  picUrl: string;
  rcmdtext: string;
};

defineProps({
  name: {
    type: String,
    default: ''
  },
  list: {
    type: Array as () => ItemType[],
    default: () => []
  }
});

const $router = useRouter();
const $store = useStore();

function jumpDetail(id: number): void {
  $router.push({ name: 'home-djDetail', params: { id } });
  $store.commit('radio/setRadioDetailId', id);
}
</script>

<style lang="less" scoped>
@import url('./radioStation.less');
</style>
