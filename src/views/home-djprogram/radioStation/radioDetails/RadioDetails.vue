<style lang="less" scoped>
@import './radioDetails.less';
</style>

<template>
  <div class="bg-grayF2 detail">
    <div class="box-border dis-flex">
      <div class="detail-lf">
        <div class="dis-flex detail-top">
          <div class="cover-dj">
            <img :src="details?.picUrl" :alt="details?.name" />
          </div>
          <div class="cnt">
            <div class="hd dis-flex">
              <div class="icon"></div>
              <div class="tit">{{ details?.name }}</div>
            </div>
            <div class="user dis-flex align-center">
              <div class="face">
                <img :src="details?.dj?.avatarUrl" alt="头像" />
              </div>
              <div class="name">
                <span> {{ details?.dj?.nickname }} </span>
                <img
                  src="../../../../assets/image/user/member-music.png"
                  alt=""
                />
              </div>
            </div>
            <div class="btns">
              <button type="button" class="btn subscribe">
                <i>订阅({{ details?.subCount }})</i>
              </button>
              <button type="button" class="btn subscribe">
                <i>订阅({{ details?.subCount }})</i>
              </button>
              <button type="button" class="btn subscribe">
                <i>订阅({{ details?.subCount }})</i>
              </button>
            </div>
            <div class="intr">
              <div class="cat">
                <span class="category">{{ details?.category }}</span>
                <span v-html="details.desc"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-ri">2</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { djDetail } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const $route = useRoute();
    // const rid = Number($route.params.id);

    const $store = useStore();
    const rid = computed<number>(
      () => Number($route.params.id) || $store.getters['radio/radioDetailId']
    );

    const details = ref({});
    function detailsHandle(id: number) {
      djDetail({ rid: id }).then((res: ResponseType) => {
        if (res?.code === 200) {
          details.value = res.data;
        }
        console.log(res.data.desc);
      });
    }
    detailsHandle(rid.value);
    return {
      details
    };
  }
});
</script>
