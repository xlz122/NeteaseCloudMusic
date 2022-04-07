<template>
  <div class="toplist-menu">
    <h2 class="menu-title">云音乐特色榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': songSheetId === item?.id }"
        v-for="(item, index) in character"
        :key="index"
        @click="menuChange(item?.id, item?.updateFrequency)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item?.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item?.name }}</div>
          <div class="info-desc">{{ item?.updateFrequency }}</div>
        </div>
      </li>
    </ul>
    <h2 class="menu-title">全球媒体榜</h2>
    <ul class="menu-list">
      <li
        class="item"
        :class="{ 'active-item': songSheetId === item?.id }"
        v-for="(item, index) in media"
        :key="index"
        @click="menuChange(item?.id, item?.updateFrequency)"
      >
        <div class="item-cover">
          <img class="cover-img" :src="item?.coverImgUrl" alt="" />
        </div>
        <div class="item-info">
          <div class="info-name">{{ item?.name }}</div>
          <div class="info-desc">{{ item?.updateFrequency }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    character: {
      type: Array,
      default: () => []
    },
    media: {
      type: Array,
      default: () => []
    }
  },
  emits: ['menuChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const songSheetId = computed<number>(() => $store.getters.songSheetId);

    function menuChange(id: number, updateFrequency: string): void {
      emit('menuChange', id, updateFrequency);
    }

    return {
      songSheetId,
      menuChange
    };
  }
});
</script>

<style lang="less">
.toplist-menu {
  padding-top: 20px;

  .menu-title {
    padding: 0 10px 12px 15px;
    margin-top: 20px;
    font-size: 14px;
    font-family: simsun, \5b8b\4f53;
    color: #000;
    text-align: left;
  }

  .menu-list {
    text-align: left;

    .item {
      height: 42px;
      padding: 10px 0 10px 20px;
      cursor: pointer;

      &:hover {
        background-color: #f4f2f2;
      }

      .item-cover {
        display: inline-block;
        vertical-align: middle;
        width: 40px;
        height: 40px;
        margin-right: 10px;

        .cover-img {
          width: 100%;
          height: 100%;
        }
      }

      .item-info {
        display: inline-block;
        vertical-align: middle;

        .info-name {
          width: 150px;
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: #000;
          cursor: pointer;
        }

        .info-desc {
          color: #999;
          cursor: pointer;
        }
      }
    }

    .active-item {
      background: #e6e6e6;

      &:hover {
        background: #e6e6e6;
      }
    }
  }
}
</style>
