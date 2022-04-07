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
          <template v-for="(item, index) in banner?.list" :key="index">
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
          v-for="(item, index) in banner?.list"
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

<script lang="ts">
import { defineComponent, ref, reactive, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { bannerImgUrl } from '@api/home';
import { ResponseType } from '@/types/types';

type Banner = {
  list: unknown[];
  currentUrl: string;
  index: number;
};

export default defineComponent({
  name: 'HomeBanner',
  setup() {
    const $store = useStore();

    const banner = reactive<Banner>({
      list: [],
      currentUrl: '', // 当前图片url
      index: 0 // 当前索引
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
        return false;
      }
      // 图片切换
      if (banner.index === 0) {
        banner.index = banner.list.length - 1;
      } else {
        banner.index--;
      }
      banner.currentUrl = (
        banner.list[banner.index] as {
          imageUrl: string;
        }
      ).imageUrl;
    }

    // 下一张
    function bannerNext(): boolean | undefined {
      if (banner.list.length === 0) {
        return false;
      }
      if (banner.index === banner.list.length - 1) {
        banner.index = 0;
      } else {
        banner.index++;
      }
      banner.currentUrl = (
        banner.list[banner.index] as {
          imageUrl: string;
        }
      ).imageUrl;
    }

    // 小圆点切换
    function dotChange(index: number): boolean | undefined {
      if (banner.list.length === 0) {
        return false;
      }
      // 图片切换
      banner.index = index;
      banner.currentUrl = (
        banner.list[banner.index] as {
          imageUrl: string;
        }
      ).imageUrl;
    }

    // 监听轮播图片切换
    const bannerRef = ref<HTMLElement>();
    watch(
      () => banner.currentUrl,
      () => {
        if (!banner.currentUrl) {
          return false;
        }

        // 修复切换背景图时出现的“白色闪屏”现象
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
    const bannerImgSwitching = ref<boolean>(false);

    // 自动轮播
    const bannerTimer = ref<number | null>(null);
    function autoBanner(): boolean | undefined {
      if (banner.list.length === 0) {
        return false;
      }
      if (bannerTimer.value) {
        // 清除定时器
        clearInterval(bannerTimer.value as number);
      }
      bannerTimer.value = setInterval(() => {
        // 图片切换增加动画，1s后清除动画并显示下一张图片
        bannerImgSwitching.value = true;
        if (banner.index === banner.list.length - 1) {
          banner.index = 0;
        } else {
          banner.index++;
        }
        setTimeout(() => {
          bannerImgSwitching.value = false;
          banner.currentUrl = (
            banner.list[banner.index] as {
              imageUrl: string;
            }
          ).imageUrl;
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

    // 跳转详情
    function jumpDetail(item: unknown): void {
      const targetType = (item as { targetType: number }).targetType;
      const targetId = (item as { targetId: number }).targetId;
      const targetUrl = (item as { url: string })?.url;

      // 跳转歌曲详情
      if (targetType === 1) {
        $store.commit('jumpSongDetail', targetId);
      }

      // 跳转专辑详情
      if (targetType === 10) {
        $store.commit('jumpAlbumDetail', targetId);
      }

      // 跳转歌单详情
      if (targetType === 1000) {
        $store.commit('jumpSongSheetDetail', targetId);
      }

      // 跳转外部链接
      if (targetType === 3000) {
        window.open(targetUrl, '', '');
      }
    }

    onUnmounted(() => {
      if (bannerTimer.value) {
        // 清除定时器
        clearInterval(bannerTimer.value as number);
      }
    });

    return {
      bannerRef,
      banner,
      bannerImgSwitching,
      bannerPrev,
      bannerNext,
      dotChange,
      bannerEnter,
      bannerLeave,
      jumpDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './banner.less';
</style>
