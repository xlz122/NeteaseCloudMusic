<template>
  <div class="category-box">
    <ul class="category-list">
      <li
        class="item"
        v-for="(item, index) in categoryList"
        :key="index"
        :class="[{ 'last-item': !(index % 9) }, { 'active-item': index === 0 }]"
      >
        <div class="item-cover">
          <i
            class="icon"
            :style="{ backgroundImage: `url(${item.picWebUrl})` }"
          ></i>
          <span class="text">{{ item.name }}</span>
        </div>
      </li>
    </ul>
    <span class="btn prev-btn"></span>
    <span class="btn next-btn"></span>
    <ul class="dotpage">
      <li class="dot active-dot"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { djCatelist } from '@api/home-djprogram';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    const categoryList = ref([]);
    // 获取电台banner列表
    function getDjBanner(): void {
      djCatelist()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            categoryList.value = res.categories;
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
    getDjBanner();

    return {
      categoryList
    };
  }
});
</script>

<style lang="less" scoped>
.category-box {
  position: relative;
  margin-bottom: 20px;

  .category-list {
    height: 194px;
    max-height: 194px;
    overflow: hidden;
    text-align: left;

    .item {
      display: inline-block;
      margin: 0 0 25px 33px;
      cursor: pointer;

      .item-cover {
        display: block;
        width: 70px;
        height: 70px;
        background: url('../../../assets/image/home/home-djprogram-border.png')
          no-repeat;
        background-position: 0 9999px;
        text-align: center;
        color: #888;

        &:hover {
          background-position: 0 0;
        }

        .icon {
          display: inline-block;
          vertical-align: middle;
          width: 48px;
          height: 48px;
          margin: 2px auto 0;
          background-position: 0 0;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          color: #888;
          cursor: pointer;
        }
      }
    }

    .active-item {
      .item-cover {
        background-position: -70px 0;

        .icon {
          background-position: -48px 0;
        }

        .text {
          color: #d35757;
        }
      }
    }

    .last-item {
      margin-left: 0;
    }
  }

  .btn {
    position: absolute;
    top: 50%;
    display: inline-block;
    width: 20px;
    height: 30px;
    margin-top: -15px;
    background: url('../../../assets/image/home/home-djprogram-botton.png')
      no-repeat;
    opacity: 0.25;
    filter: alpha(opacity=25);
    text-indent: -9999px;
    cursor: pointer;

    &:hover {
      opacity: 0.4;
    }
  }

  .prev-btn {
    left: -26px;
    background-position: 0 -30px;
  }

  .next-btn {
    right: -26px;
    background-position: -30px -30px;
  }

  .dotpage {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    width: 100%;
    height: 20px;
    text-align: center;
    line-height: 0;

    .dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../../assets/image/home/home-djprogram-botton.png')
        no-repeat;
      background-position: 0 0;
      text-indent: -9999px;
      cursor: pointer;
    }

    .active-dot {
      background-position: -30px 0;
    }
  }
}
</style>
