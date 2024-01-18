<template>
  <div
    class="home-banner"
    ref="bannerRef"
    @mouseenter="bannerEnter"
    @mouseleave="bannerLeave"
  >
    <div class="banner-warp">
      <div class="banner-content">
        <div class="banner-img">
          <template v-for="(item, _index) in banner?.list" :key="_index">
            <img
              class="img"
              :class="{
                'switching-img':
                  bannerImgSwitching && item?.imageUrl === banner?.currentUrl
              }"
              v-show="item?.imageUrl === banner?.currentUrl"
              :src="item?.imageUrl"
              @click="jumpDetail(item)"
              alt=""
            />
          </template>
        </div>
        <button
          class="banner-btn banner-left-btn"
          @click="bannerPrev"
          @mouseenter="bannerEnter"
        ></button>
        <button
          class="banner-btn banner-right-btn"
          @click="bannerNext"
          @mouseenter="bannerEnter"
        ></button>
      </div>
      <ul class="warp-dots">
        <li
          class="dots-item"
          :class="{ 'dots-active-item': index === banner?.index }"
          v-for="(_item, index) in banner?.list"
          :key="index"
          @click="dotChange(index)"
        ></li>
      </ul>
      <div class="download">
        <div class="download-link">
          <router-link class="link" to="/download"></router-link>
        </div>
        <p class="desc">PC 安卓 iPhone WP iPad Mac 六大客户端</p>
        <span class="shadow"></span>
        <span class="shadowr"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { bannerImgUrl } from '@/api/home';
import type { ResponseType } from '@/types/index';

type Banner = {
  list: BannerItem[];
  currentUrl: string;
  index: number;
};

type BannerItem = {
  imageUrl: string;
  targetType: number;
  targetId: number;
  url: string;
};

const $router = useRouter();

const banner = reactive<Banner>({
  list: [],
  currentUrl: '',
  index: 0
});

function getbannerList() {
  bannerImgUrl()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        if (res.banners.length > 0) {
          banner.list = res.banners;
          banner.currentUrl = res.banners[0].imageUrl;

          autoBanner();
        }
      }
    })
    .catch(() => ({}));
}
getbannerList();

// 上一张
function bannerPrev(): boolean | undefined {
  if (banner.list.length === 0) {
    return;
  }

  if (banner.index === 0) {
    banner.index = banner.list.length - 1;
  } else {
    banner.index--;
  }
  banner.currentUrl = banner.list[banner.index].imageUrl;
}

// 下一张
function bannerNext(): boolean | undefined {
  if (banner.list.length === 0) {
    return;
  }

  if (banner.index === banner.list.length - 1) {
    banner.index = 0;
  } else {
    banner.index++;
  }
  banner.currentUrl = banner.list[banner.index].imageUrl;
}

// 小圆点切换
function dotChange(index: number): boolean | undefined {
  if (banner.list.length === 0) {
    return;
  }

  banner.index = index;
  banner.currentUrl = banner.list[banner.index].imageUrl;
}

// 监听轮播图片切换
const bannerRef = ref<HTMLElement>();
watch(
  () => banner.currentUrl,
  () => {
    if (!banner.currentUrl) {
      return;
    }

    // 修复切换背景图时出现的 白色闪屏 现象
    const img = new Image();
    img.src = `${banner.currentUrl}?imageView&blur=40x20`;
    img.onload = function () {
      const bannerDom = bannerRef.value as HTMLElement;
      if (bannerDom) {
        bannerDom.style.backgroundImage = `url(${banner.currentUrl}?imageView&blur=40x20)`;
        bannerDom.style.backgroundSize = '6000px';
        bannerDom.style.backgroundPosition = 'center center';
      }
    };
  }
);

// 图片是否在切换中
const bannerImgSwitching = ref(false);

// 自动轮播
const timer = ref<NodeJS.Timeout | null>(null);

function autoBanner(): boolean | undefined {
  if (banner.list.length === 0) {
    return;
  }
  timer.value && clearInterval(timer.value);

  timer.value = setInterval(() => {
    // 图片切换增加动画, 1s后清除动画并显示下一张图片
    bannerImgSwitching.value = true;
    if (banner.index === banner.list.length - 1) {
      banner.index = 0;
    } else {
      banner.index++;
    }
    setTimeout(() => {
      bannerImgSwitching.value = false;
      banner.currentUrl = banner.list[banner.index].imageUrl;
    }, 1000);
  }, 4000);
}

// 轮播区域鼠标移入
function bannerEnter(): void {
  timer.value && clearInterval(timer.value);
}

// 轮播区域鼠标移出
function bannerLeave(): void {
  autoBanner();
}

// 跳转详情
function jumpDetail(item: BannerItem): void {
  const { targetType, targetId, url } = item;

  // 歌曲
  if (targetType === 1) {
    $router.push({ path: '/song-detail', query: { id: targetId } });
  }

  // 专辑
  if (targetType === 10) {
    $router.push({ path: '/album-detail', query: { id: targetId } });
  }

  // 歌单
  if (targetType === 1000) {
    $router.push({ path: '/song-sheet-detail', query: { id: targetId } });
  }

  // 外部链接
  if (targetType === 3000) {
    window.open(url, '', '');
  }
}

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
@import url('./banner.less');
</style>
