<template>
  <div class="level-detail">
    <div class="detail-container">
      <h2 class="title">
        等级特权
        <span class="title-right-text" @click="jumpLevel">
          查看我的等级
          <i class="icon"></i>
        </span>
      </h2>
      <div class="content">
        <div class="tip">
          <span class="text">等级</span>
          <span class="text">特权</span>
        </div>
        <ul class="list">
          <li class="item" v-for="(item, index) in list" :key="index">
            <span class="n-level">
              <i class="icon"></i>
              {{ item.level }}
            </span>
            <span>{{ item.capacity }}</span>
            <span class="point"></span>
            <span>{{ item.blacklist }}</span>
            <span class="point" v-if="item.additional"></span>
            <span v-if="item.additional?.coupon">
              {{ item.additional?.coupon }}
            </span>
            <span class="point" v-if="item.additional"></span>
            <span v-if="item.additional?.value">
              {{ item.additional?.value }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const list = ref([
  {
    level: 1,
    capacity: '5G音乐云盘免费容量',
    blacklist: '黑名单上限20'
  },
  {
    level: 2,
    capacity: '20G音乐云盘免费容量',
    blacklist: '黑名单上限20'
  },
  {
    level: 3,
    capacity: '40G音乐云盘免费容量',
    blacklist: '黑名单上限20',
    additional: {
      coupon: '云音乐商城满100减3元优惠券',
      value: '价值50云贝'
    }
  },
  {
    level: 4,
    capacity: '40G音乐云盘免费容量',
    blacklist: '黑名单上限20'
  },
  {
    level: 5,
    capacity: '40G音乐云盘免费容量',
    blacklist: '黑名单上限20',
    additional: {
      coupon: '云音乐商城满100减6元优惠券',
      value: '价值100云贝'
    }
  },
  {
    level: 6,
    capacity: '60G音乐云盘免费容量',
    blacklist: '黑名单上限40'
  },
  {
    level: 7,
    capacity: '60G音乐云盘免费容量',
    blacklist: '黑名单上限80',
    additional: {
      coupon: '云音乐商城满100减9元优惠券',
      value: '价值400云贝'
    }
  },
  {
    level: 8,
    capacity: '60G音乐云盘免费容量',
    blacklist: '黑名单上限100'
  },
  {
    level: 9,
    capacity: '60G音乐云盘免费容量',
    blacklist: '黑名单上限120',
    additional: {
      coupon: '云音乐商城满100减12元优惠券',
      value: '价值1200云贝'
    }
  },
  {
    level: 10,
    capacity: '100G音乐云盘免费容量',
    blacklist: '黑名单上限140'
  }
]);

function jumpLevel(): void {
  router.push({ path: '/level' });
}
</script>

<style lang="less" scoped>
@import url('./level-detail.less');
</style>
