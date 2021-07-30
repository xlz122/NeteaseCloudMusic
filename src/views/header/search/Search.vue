<template>
  <!-- 搜索 -->
  <div class="search">
    <span class="icon"></span>
    <input
      class="search-input"
      type="text"
      v-model="searchValue"
      :placeholder="searchPlaceholder"
      @focus="searchFocus"
      @blur="searchBlur"
      @keyup.enter="searchEnter"
    />
    <!-- 搜索建议 -->
    <template v-if="Object.keys(searchPropos).length">
      <ul class="search-list" v-show="searchProposShow">
        <li class="item-note">搜“{{ searchValue }}”相关用户 ></li>
        <!-- 单曲 -->
        <li class="item" v-if="searchPropos?.songs">
          <div class="title">
            <i class="title-icon songs-icon"></i>
            <span class="title-text">单曲</span>
          </div>
          <ul class="f-cb">
            <li
              class="f-cb-i"
              v-for="(item, index) in searchPropos.songs"
              :key="index"
              @click="songDetail(item)"
            >
              <span class="f-cb-text">
                {{ item.name.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item.name.slice(searchValue.length) }}-{{
                  item?.artists[0]?.name
                }}
              </span>
            </li>
          </ul>
        </li>
        <!-- 歌手 -->
        <li class="item" v-if="searchPropos?.artists">
          <div class="title">
            <i class="title-icon artists-icon"></i>
            <span class="title-text">歌手</span>
          </div>
          <ul class="f-cb f-cb-odd">
            <li
              class="f-cb-i"
              v-for="(item, index) in searchPropos.artists"
              :key="index"
              @click="artistDetail(item.id)"
            >
              <span class="f-cb-text">{{ item.name }}</span>
            </li>
          </ul>
        </li>
        <!-- 专辑 -->
        <li class="item" v-if="searchPropos?.albums">
          <div class="title">
            <i class="title-icon albums-icon"></i>
            <span class="title-text">专辑</span>
          </div>
          <ul class="f-cb">
            <li
              class="f-cb-i"
              v-for="(item, index) in searchPropos.albums"
              :key="index"
              @click="albumDetail(item)"
            >
              <span class="f-cb-text">
                {{ item.name.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item.name.slice(searchValue.length) }}-{{
                  item?.artist?.name
                }}
              </span>
            </li>
          </ul>
        </li>
        <!-- 歌单 -->
        <li class="item" v-if="searchPropos?.playlists">
          <div class="title">
            <i class="title-icon playlists-icon"></i>
            <span class="title-text">歌单</span>
          </div>
          <ul class="f-cb f-cb-odd">
            <li
              class="f-cb-i"
              v-for="(item, index) in searchPropos.playlists"
              :key="index"
              @click="playlistDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item.name.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item.name.slice(searchValue.length) }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchPropose } from '@api/search';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 搜索框背景文本
    const searchPlaceholder = ref<string>('音乐/视频/电台/用户');
    // 搜索内容
    const searchValue = ref<string>('');
    // 搜索建议显隐
    const searchProposShow = ref<boolean>(false);
    // 搜索建议数据
    const searchPropos = ref<unknown>({});

    // 搜索框获取焦点
    function searchFocus(): void {
      searchPlaceholder.value = '';
      if (searchValue.value) {
        searchProposShow.value = true;
      }
    }

    // 搜索框失去焦点
    function searchBlur(): void {
      searchPlaceholder.value = '音乐/视频/电台/用户';
      // 延迟关闭，用于响应点击事件
      setTimeout(() => {
        searchProposShow.value = false;
      }, 150);
    }

    // 搜索框内容改变
    const oldSearchValue = ref<string>('');
    watch(
      () => searchValue.value,
      (curVal: string, oldVal: string) => {
        if (curVal) {
          getSearchPropos();
        } else {
          searchProposShow.value = false;
        }
        // 存储旧搜索内容
        if (oldVal) {
          oldSearchValue.value = oldVal;
        }
      }
    );

    // 搜索框监听回车键
    function searchEnter(): boolean | undefined {
      searchProposShow.value = false;
      if (!searchValue.value) {
        return false;
      }
      // 搜索内容变化
      if (searchValue.value !== oldSearchValue.value) {
        // 存储关键字
        $store.commit('setSearchText', searchValue.value);
        // 头部导航取消选中
        $store.commit('setHeaderActiveIndex', -1);
        // 跳转搜索详情页
        $router.push({
          name: 'search-details',
          query: { searchText: searchValue.value }
        });
      }
    }

    // 获取搜索框建议
    function getSearchPropos(): void {
      searchProposShow.value = true;
      searchPropose({
        keywords: searchValue.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            searchPropos.value = res.result;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 单曲详情
    function songDetail(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 歌手详情
    function artistDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 专辑详情
    function albumDetail(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 歌单详情
    function playlistDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { songSheetId: id } });
    }
    return {
      searchPlaceholder,
      searchValue,
      searchProposShow,
      searchPropos,
      searchFocus,
      searchBlur,
      searchEnter,
      songDetail,
      artistDetail,
      albumDetail,
      playlistDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './search.less';
</style>
