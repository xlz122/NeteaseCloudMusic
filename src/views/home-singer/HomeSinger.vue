<template>
  <div class="home-singer">
    <div class="home-singer-container">
      <div class="home-singer-menu">
        <SingerMenu @menuSelete="menuSelete" />
      </div>
      <div class="home-singer-content">
        <SingerContent
          :title="singerList.title"
          :sort="singerList.sort"
          :main="singerList.main"
          :second="singerList.second"
          @screenChange="screenChange"
          @jumpSingerDetail="jumpSingerDetail"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { topArtists, artistList, ArtistList } from '@api/home-singer';
import { ResponseType } from '@/types/types';
import SingerMenu from './singer-menu/SingerMenu.vue';
import SingerContent from './singer-content/SingerContent.vue';

export default defineComponent({
  name: 'home-singer',
  components: {
    SingerMenu,
    SingerContent
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 歌手数据
    const singerList = reactive({
      title: '热门歌手',
      sort: false,
      main: [],
      second: []
    });

    // 分类数据
    const artistParams = reactive<ArtistList>({
      area: -1,
      type: -1,
      initial: -1
    });

    // 菜单选择
    function menuSelete(title: string, area: number, type: number) {
      singerList.title = title;
      // 推荐歌手
      if (area === -8 && type === 1) {
        singerList.title = '热门歌手';
        singerList.sort = false;
        getTopArtists();
        return false;
      }
      // 入驻歌手
      if (area === -8 && type === 2) {
        singerList.sort = false;
        singerList.main = [];
        singerList.second = [];
        $store.commit('setMessage', {
          type: 'error',
          title: '入驻歌手暂无接口'
        });
        return false;
      }
      singerList.sort = true;
      artistParams.area = area;
      artistParams.type = type;
      getArtistList();
    }

    // 获取热门歌手数据
    function getTopArtists(): void {
      topArtists({
        offset: 0,
        limit: 100
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerList.main = res.artists.slice(0, 10);
            if (res.artists.length > 10) {
              singerList.second = res.artists.slice(10);
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getTopArtists();

    // 字母选择
    function screenChange(small: string): void {
      artistParams.initial = small;
      getArtistList();
    }

    // 获取分类列表数据
    function getArtistList(): void {
      artistList({ ...artistParams })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerList.main = res.artists.slice(0, 10);
            if (res.artists.length > 10) {
              singerList.second = res.artists.slice(10);
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // jumpSingerDetail
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { id } });
    }

    return {
      singerList,
      menuSelete,
      screenChange,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less">
@import './home-singer.less';
</style>
