<template>
  <div class="singer-content">
    <div class="title" v-if="title">
      <span class="text">
        {{ title }}
        <i class="icon-r"></i>
      </span>
    </div>
    <ul class="list-screen" v-if="sort">
      <li
        class="item"
        v-for="(item, index) in menu"
        :key="index"
        :class="[
          { hot: index === 0 },
          { hot: index === menu.length - 1 },
          { 'active-item': index === activeScreen }
        ]"
        @click="screenChange(index, item.small)"
      >
        <span class="item-text">{{ item.large }}</span>
      </li>
    </ul>
    <ul class="list">
      <li class="item" v-for="(item, index) in main" :key="index">
        <div class="item-cover" :title="`${item.name}的音乐`" @click="jumpSingerDetail(item.id)">
          <img class="item-cover-img" :src="item.picUrl" alt="" />
        </div>
        <div class="item-desc">
          <span
            class="item-desc-text"
            :title="`${item.name}的音乐`"
            @click="jumpSingerDetail(item.id)"
          >
            {{ item.name }}
          </span>
          <span
            class="item-desc-icon"
            v-if="item.accountId"
            :title="`${item.name}的个人主页`"
            @click="jumpUserProfile(item.accountId)"
          ></span>
        </div>
      </li>
    </ul>
    <div class="line" v-if="second.length > 0"></div>
    <ul class="list-small">
      <li
        class="item"
        v-for="(item, index) in second"
        :key="index"
        @click="jumpSingerDetail(item.id)"
      >
        <span class="item-text" :title="`${item.name}的音乐`">
          {{ item.name }}
        </span>
        <span
          class="item-icon"
          v-if="item.accountId"
          :title="`${item.name}的个人主页`"
          @click="jumpUserProfile(item.accountId)"
        ></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

type ItemType = {
  id: number;
  name: string;
  picUrl: string;
  accountId: number;
};

type MenuItem = {
  large: string;
  small: string | number;
};

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  sort: {
    type: Boolean,
    default: false
  },
  main: {
    type: Array as () => ItemType[],
    default: () => []
  },
  second: {
    type: Array as () => ItemType[],
    default: () => []
  }
});
const emits = defineEmits(['screenChange', 'jumpSingerDetail', 'jumpUserProfile']);

const menu = reactive<MenuItem[]>([
  {
    large: '热门',
    small: -1
  },
  {
    large: 'A',
    small: 'a'
  },
  {
    large: 'B',
    small: 'b'
  },
  {
    large: 'C',
    small: 'c'
  },
  {
    large: 'D',
    small: 'd'
  },
  {
    large: 'E',
    small: 'e'
  },
  {
    large: 'F',
    small: 'f'
  },
  {
    large: 'G',
    small: 'g'
  },
  {
    large: 'H',
    small: 'h'
  },
  {
    large: 'I',
    small: 'i'
  },
  {
    large: 'J',
    small: 'j'
  },
  {
    large: 'K',
    small: 'k'
  },
  {
    large: 'L',
    small: 'l'
  },
  {
    large: 'M',
    small: 'm'
  },
  {
    large: 'N',
    small: 'n'
  },
  {
    large: 'O',
    small: 'o'
  },
  {
    large: 'P',
    small: 'p'
  },
  {
    large: 'Q',
    small: 'q'
  },
  {
    large: 'R',
    small: 'r'
  },
  {
    large: 'S',
    small: 's'
  },
  {
    large: 'T',
    small: 't'
  },
  {
    large: 'U',
    small: 'u'
  },
  {
    large: 'V',
    small: 'v'
  },
  {
    large: 'W',
    small: 'w'
  },
  {
    large: 'X',
    small: 'x'
  },
  {
    large: 'Y',
    small: 'y'
  },
  {
    large: 'Z',
    small: 'z'
  },
  {
    large: '其他',
    small: 0
  }
]);

// 字母选择
const activeScreen = ref(0);

function screenChange(index: number, small: number | string): void {
  activeScreen.value = index;
  emits('screenChange', small);
}

watch(
  () => props.title,
  () => {
    activeScreen.value = 0;
  }
);

function jumpSingerDetail(id: number): void {
  emits('jumpSingerDetail', id);
}

function jumpUserProfile(id: number): void {
  emits('jumpUserProfile', id);
}
</script>

<style lang="less">
@import url('./singer-content.less');
</style>
