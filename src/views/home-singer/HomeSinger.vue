<template>
  <div class="home-singer">
    <div class="home-singer-container">
      <div class="home-singer-menu">
        <SingerMenu @menuSelete="menuSelete" />
      </div>
      <div class="home-singer-content">
        <SingerContent />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import { topArtists } from '@api/home-singer';
import { ResponseType } from '@/type/type';
import SingerMenu from './singer-menu/SingerMenu.vue';
import SingerContent from './singer-content/SingerContent.vue';

export default defineComponent({
  components: {
    SingerMenu,
    SingerContent
  },
  setup() {
    const $store = useStore();

    // 歌手数据
    const singerList = reactive({
      main: [],
      second: []
    });

    // 菜单选择
    function menuSelete(area: number, type: number) {
      // 推荐歌手
      if (area === -8 && type === 1) {
        getTopArtists();
        return false;
      }
      // 入驻歌手
      if (area === -8 && type === 2) {
        $store.commit('setMessage', {
          type: 'error',
          title: '入驻歌手暂无接口'
        });
        return false;
      }
      $store.commit('setMessage', {
        type: 'info',
        title: `菜单选择：type:${type}, area:${area}`
      });
    }

    // 获取热门歌手数据
    function getTopArtists(): void {
      topArtists()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            
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

    return {
      menuSelete
    };
  }
});
</script>

<style lang="less">
@import './home-singer.less';
</style>
