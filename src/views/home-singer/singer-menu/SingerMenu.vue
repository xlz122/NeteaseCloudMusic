<template>
  <div class="singer-menu">
    <div
      class="group"
      v-for="(item, index) in menu"
      :key="index"
      :class="{ 'language': index !== 0 }"
    >
      <h2 class="group-title">{{ item.title }}</h2>
      <ul class="group-list">
        <li
          class="item"
          v-for="(i, ind) in item?.list"
          :key="ind"
          @click="menuSelete(i.title, item, i.type)"
        >
          <span
            class="item-text"
            :class="{ 'item-active-text': i.selected }"
          >
            {{ i.title }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

type Menu = {
  type: number,
  title: string;
  list: List[]
};

type List = {
  type: number;
  title: string;
  selected: boolean;
};

export default defineComponent({
  emits: ['menuSelete'],
  setup(props, { emit }) {
    const menu = ref<Menu[]>([
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

    function menuSelete(title: string, item: Menu, type: number): void {
      menu.value.forEach((m: Menu) => {
        m.list.forEach((l: List) => {
          if (item.type === m.type && type === l.type) {
            l.selected = true;
          } else {
            l.selected = false;
          }
        });
      });
      emit('menuSelete', title, item.type, type);
    }

    return {
      menu,
      menuSelete
    };
  }
});
</script>

<style lang="less">
.singer-menu {
  padding: 0 10px 40px;
  margin-top: 51px;

  .language {
    margin: 5px 0 0;
    padding-top: 16px;
    border-top: 1px solid #d3d3d3;
  }

  .group-title {
    height: 25px;
    padding-left: 14px;
    font-size: 16px;
    font-family: 'Microsoft Yahei';
  }

  .item {
    width: 160px;
    height: 29px;
    line-height: 29px;
    margin-bottom: 2px;

    .item-text {
      display: inline-block;
      width: 133px;
      padding-left: 27px;
      background: url(~@/assets/image/home/singer.png) no-repeat 0 9999px;
      background-position: 0 -30px;
      color: #333;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .item-active-text {
      background-position: 0 0;
      color: #c20c0c;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
