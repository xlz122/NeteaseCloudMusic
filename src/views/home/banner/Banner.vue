<template>
  <div
    class="home-banner"
    ref="bannerRef"
    @mouseenter="bannerEnter"
    @mouseleave="bannerLeave"
  >
    <div class="banner-warp">
      <!-- 两侧按钮及图片 -->
      <div class="banner-content">
        <div class="banner-img">
          <img
            class="img"
            :class="{ 'switching-img': bannerImgSwitching }"
            :src="bannerUrl"
            alt=""
          />
        </div>
        <button class="banner-btn banner-left-btn" @click="bannerPrev"></button>
        <button
          class="banner-btn banner-right-btn"
          @click="bannerNext"
        ></button>
      </div>
      <!-- 底部小圆点 -->
      <ul class="warp-dots">
        <li
          class="dots-item"
          :class="{ 'dots-active-item': index === bannerIndex }"
          v-for="(item, index) in bannerData"
          :key="index"
          @click="dotChange(index)"
        ></li>
      </ul>
      <!-- 下载部分 -->
      <div class="download"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from 'vue';
import { bannerImgUrl } from '@api/home';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    // 轮播图片数据
    const bannerData = ref<ResponseType[]>([]);
    // 当前显示的图片
    const bannerUrl = ref<string>('');
    function getBannerData() {
      bannerImgUrl().then((res: ResponseType) => {
        if (res.code === 200) {
          if (res.banners.length > 0) {
            bannerData.value = res.banners;
            bannerUrl.value = res.banners[0].imageUrl;
            // 自动轮播
            autoBanner();
          }
        }
      });
    }
    getBannerData();

    // 当前图片索引
    const bannerIndex = ref<number>(0);
    // 轮播图定时器
    const bannerTimer = ref<number | null>(null);

    // 上一张
    function bannerPrev(): boolean | undefined {
      if (bannerData.value.length === 0) {
        return false;
      }
      // 图片切换
      if (bannerIndex.value === 0) {
        bannerIndex.value = bannerData.value.length - 1;
      } else {
        bannerIndex.value--;
      }
      bannerUrl.value = bannerData.value[bannerIndex.value].imageUrl;
    }

    // 下一张
    function bannerNext(): boolean | undefined {
      if (bannerData.value.length === 0) {
        return false;
      }
      if (bannerIndex.value === bannerData.value.length - 1) {
        bannerIndex.value = 0;
      } else {
        bannerIndex.value++;
      }
      bannerUrl.value = bannerData.value[bannerIndex.value].imageUrl;
    }

    // 小圆点切换
    function dotChange(index: number): boolean | undefined {
      if (bannerData.value.length === 0) {
        return false;
      }
      // 图片切换
      bannerIndex.value = index;
      bannerUrl.value = bannerData.value[bannerIndex.value].imageUrl;
    }

    // 监听轮播图片切换
    const bannerRef = ref<HTMLElement>();
    watch(
      () => bannerUrl.value,
      () => {
        // 修复切换背景图时出现的“白色闪屏”现象
        const img = new Image();
        img.src = `${bannerUrl.value}?imageView&blur=40x20`;
        img.onload = function() {
          const banner = bannerRef.value as HTMLElement;
          banner.style.backgroundImage = `url(${bannerUrl.value}?imageView&blur=40x20)`;
          banner.style.backgroundSize = '6000px';
          banner.style.backgroundPosition = 'center center';
        };
      }
    );

    // 图片是否在切换中
    const bannerImgSwitching = ref<boolean>(false);

    // 自动轮播
    function autoBanner(): boolean | undefined {
      if (bannerData.value.length === 0) {
        return false;
      }
      bannerTimer.value = setInterval(() => {
        bannerImgSwitching.value = true;
        if (bannerIndex.value === bannerData.value.length - 1) {
          bannerIndex.value = 0;
        } else {
          bannerIndex.value++;
        }
        setTimeout(() => {
          bannerImgSwitching.value = false;
          bannerUrl.value = bannerData.value[bannerIndex.value].imageUrl;
        }, 1000);
      }, 4000);
    }

    // 轮播区域鼠标移入
    function bannerEnter(): void {
      // 清除定时器
      clearInterval(bannerTimer.value as number);
    }
    // 轮播区域鼠标移出
    function bannerLeave(): void {
      // 重新轮播
      autoBanner();
    }

    onUnmounted(() => {
      if (bannerTimer.value) {
        // 清除定时器
        clearInterval(bannerTimer.value as number);
      }
    });
    return {
      bannerRef,
      bannerData,
      bannerIndex,
      bannerImgSwitching,
      bannerUrl,
      bannerPrev,
      bannerNext,
      dotChange,
      bannerEnter,
      bannerLeave
    };
  }
});
</script>

<style lang="less" scoped>
@import './banner.less';
</style>
