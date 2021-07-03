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
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import SingerMenu from './singer-menu/SingerMenu.vue';
import SingerContent from './singer-content/SingerContent.vue';

export default defineComponent({
  components: {
    SingerMenu,
    SingerContent
  },
  setup() {
    const $store = useStore();

    // 菜单选择
    function menuSelete(area: number, type: number) {
      $store.commit('setMessage', {
        type: 'info',
        title: `菜单选择：type:${type}, area:${area}`
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
