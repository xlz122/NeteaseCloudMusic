<template>
  <div
    class="home-banner"
    ref="bannerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="h-banner-warp">
      <div class="banner-content">
        <img
          class="img"
          :class="{ 'img-switching': imageSwitching }"
          :src="banner.currentUrl"
          @click="jumpPageDetail"
          alt=""
        />
        <button class="btn left-btn" @click="handlePrev" @mouseenter="handleMouseEnter"></button>
        <button class="btn right-btn" @click="handleNext" @mouseenter="handleMouseEnter"></button>
      </div>
      <ul class="banner-dots">
        <li
          class="item"
          :class="{ 'active-item': index === banner.index }"
          v-for="(_item, index) in banner.list"
          :key="index"
          @click="handleDotChange(index)"
        ></li>
      </ul>
      <div class="download">
        <router-link class="link" to="/download"></router-link>
        <p class="intro">PC 安卓 iPhone WP iPad Mac 六大客户端</p>
        <i class="shadowl"></i>
        <i class="shadowr"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { bannerImgUrl } from '@/api/home';
import type { ResponseType } from '@/types';

type Banner = {
  index: number;
  currentUrl: string;
  list: ItemType[];
};

type ItemType = {
  imageUrl: string;
  targetType: number;
  targetId: number;
  url: string;
};

const router = useRouter();

const banner = reactive<Banner>({
  index: 0,
  currentUrl: '',
  list: []
});

function getBannerList(): void {
  bannerImgUrl()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.banners?.length === 0) {
        return;
      }

      banner.currentUrl = res.banners?.[0]?.imageUrl ?? '';
      banner.list = res.banners ?? [];
      handleAutoPlay();
    })
    .catch(() => ({}));
}
getBannerList();

function handlePrev(): void {
  if (banner.index === 0) {
    banner.index = banner.list.length - 1;
    return;
  }

  banner.index--;
}

function handleNext(): void {
  if (banner.index === banner.list.length - 1) {
    banner.index = 0;
    return;
  }

  banner.index++;
}

function handleDotChange(index: number): void {
  banner.index = index;
}

// 轮播背景图
const bannerRef = ref<HTMLElement | null>(null);

watch(
  () => banner.index,
  () => {
    banner.currentUrl = banner.list[banner.index].imageUrl;
  }
);

watch(
  () => banner.currentUrl,
  () => {
    const element = bannerRef.value;
    if (!element) {
      return;
    }

    element.style.backgroundImage = `url(${banner.currentUrl}?imageView&blur=40x20)`;
    element.style.backgroundPosition = 'center center';
    element.style.backgroundSize = '6000px';
  }
);

// 自动轮播
const timer = ref<number | null>(null);
// 图片是否正在切换
const imageSwitching = ref(false);

function handleAutoPlay(): void {
  timer.value && clearInterval(timer.value);

  // 图片切换时增加动画, 1s后显示下一张图片并清除动画
  timer.value = setInterval(() => {
    imageSwitching.value = true;

    setTimeout(() => {
      if (banner.index === 0) {
        banner.index = banner.list.length - 1;
        imageSwitching.value = false;
        return;
      }

      banner.index--;
      imageSwitching.value = false;
    }, 1000);
  }, 4000);
}

function handleMouseEnter(): void {
  timer.value && clearInterval(timer.value);
}

function handleMouseLeave(): void {
  handleAutoPlay();
}

function jumpPageDetail(): void {
  const { targetType, targetId, url } = banner.list[banner.index];

  if (targetType === 1) {
    router.push({ path: '/song-detail', query: { id: targetId } });
  }

  if (targetType === 10) {
    router.push({ path: '/album-detail', query: { id: targetId } });
  }

  if (targetType === 1000) {
    router.push({ path: '/song-sheet-detail', query: { id: targetId } });
  }

  if (targetType === 3000) {
    window.open(url, '_blank');
  }
}

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
@import url('./banner.less');
</style>
