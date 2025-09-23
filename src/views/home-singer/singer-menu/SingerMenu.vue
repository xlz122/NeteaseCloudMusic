<template>
  <div class="singer-menu">
    <div
      class="group"
      v-for="(item, index) in menu"
      :key="index"
      :class="{ language: index !== 0 }"
    >
      <h2 class="group-title">{{ item.title }}</h2>
      <ul class="group-list">
        <li
          class="item"
          v-for="(i, ind) in item.list"
          :key="ind"
          @click="menuSelete(item, i.title, i.type)"
        >
          <span class="item-text" :class="{ 'item-active-text': i.selected }">
            {{ i.title }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

type MenuItem = {
  type: number;
  title: string;
  list: ItemType[];
};

type ItemType = {
  type: number;
  title: string;
  selected: boolean;
};

const emits = defineEmits(['menuSelete']);

const menu = ref<MenuItem[]>([
  {
    type: -8,
    title: '推荐',
    list: [
      {
        type: 1,
        title: '推荐歌手',
        selected: true
      },
      {
        type: 2,
        title: '入驻歌手',
        selected: false
      }
    ]
  },
  {
    type: 7,
    title: '华语',
    list: [
      {
        type: 1,
        title: '华语男歌手',
        selected: false
      },
      {
        type: 2,
        title: '华语女歌手',
        selected: false
      },
      {
        type: 3,
        title: '华语组合/乐队',
        selected: false
      }
    ]
  },
  {
    type: 96,
    title: '欧美',
    list: [
      {
        type: 1,
        title: '欧美男歌手',
        selected: false
      },
      {
        type: 2,
        title: '欧美女歌手',
        selected: false
      },
      {
        type: 3,
        title: '欧美组合/乐队',
        selected: false
      }
    ]
  },
  {
    type: 8,
    title: '日本',
    list: [
      {
        type: 1,
        title: '日本男歌手',
        selected: false
      },
      {
        type: 2,
        title: '日本女歌手',
        selected: false
      },
      {
        type: 3,
        title: '日本组合/乐队',
        selected: false
      }
    ]
  },
  {
    type: 16,
    title: '韩国',
    list: [
      {
        type: 1,
        title: '韩国男歌手',
        selected: false
      },
      {
        type: 2,
        title: '韩国女歌手',
        selected: false
      },
      {
        type: 3,
        title: '韩国组合/乐队',
        selected: false
      }
    ]
  },
  {
    type: 0,
    title: '其他',
    list: [
      {
        type: 1,
        title: '其他男歌手',
        selected: false
      },
      {
        type: 2,
        title: '其他女歌手',
        selected: false
      },
      {
        type: 3,
        title: '其他组合/乐队',
        selected: false
      }
    ]
  }
]);

function menuSelete(item: MenuItem, title: string, type: number): void {
  menu.value.forEach?.((m) => {
    m.list?.forEach?.((l) => {
      if (item.type === m.type && type === l.type) {
        l.selected = true;
        return;
      }

      l.selected = false;
    });
  });

  emits('menuSelete', title, item.type, type);
}
</script>

<style lang="less">
@import url('./singer-menu.less');
</style>
