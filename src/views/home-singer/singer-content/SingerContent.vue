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
        v-for="(item, index) in sortList"
        :key="index"
        :class="[
          { hot: index === 0 },
          { hot: index === sortList.length - 1 },
          { 'active-item': index === activeScreen }
        ]"
        @click="screenChange(index, item.small)"
      >
        <span class="item-text">{{ item.large }}</span>
      </li>
    </ul>
    <ul class="list">
      <li class="item" v-for="(item, index) in main" :key="index">
        <div class="item-cover">
          <img class="item-cover-img" :src="item.picUrl" alt="" />
        </div>
        <div class="item-desc">
          <span class="item-desc-text">{{ item.name }}</span>
          <span class="item-desc-icon" v-if="item.albumSize < 50"></span>
        </div>
      </li>
    </ul>
    <div class="line" v-if="second.length > 0"></div>
    <ul class="list-small">
      <li class="item" v-for="(item, index) in second" :key="index">
        <span class="item-text">{{ item.name }}</span>
        <span class="item-icon" v-if="item.albumSize < 50"></span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch } from 'vue';

type SortList = {
  large: string;
  small: string | number;
};

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    sort: {
      type: Boolean,
      default: false
    },
    main: {
      type: Array,
      default: () => []
    },
    second: {
      type: Array,
      default: () => []
    }
  },
  emits: ['screenChange'],
  setup(props, { emit }) {
    const { title } = toRefs(props);

    const sortList = reactive<SortList[]>([
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

    // 字母选中
    const activeScreen = ref<number>(0);
    function screenChange(index: number, small: number | string): void {
      activeScreen.value = index;
      emit('screenChange', small);
    }

    // 监听标题修改,重置字母选中
    watch(
      () => title.value,
      () => {
        activeScreen.value = 0;
      }
    );
    return {
      sortList,
      activeScreen,
      screenChange
    };
  }
});
</script>

<style lang="less">
@import './singer-content.less';
</style>
