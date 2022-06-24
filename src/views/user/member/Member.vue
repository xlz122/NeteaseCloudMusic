<template>
  <div class="message box-border">
    <div class="user-info">
      <div class="user-head">
        <div class="payment">
          <router-link to="">
            本月已下载的付费歌曲
            <i>></i>
          </router-link>
          <router-link to="">
            我购买的单曲
            <i>></i>
          </router-link>
        </div>
        <div class="member dis-flex">
          <div class="avatar">
            <img
              class="avatar-img"
              :src="userInfo?.profile?.avatarUrl"
              alt="头像"
            />
          </div>
          <div class="user-content dis-flex direction-column justify-between">
            <div>
              <div class="dis-flex align-center">
                <div class="f22">{{ userInfo?.profile?.nickname }}</div>
                <template v-if="vipInfo?.redVipLevelIcon">
                  <img
                    class="vip-level"
                    :src="vipInfo?.redVipLevelIcon"
                    alt="等级"
                  />
                </template>
              </div>
              <div class="mt6">当前未开通</div>
            </div>
            <div class="dis-flex">
              <div class="text-gray6 f14 btn-gray">买会员赠好友</div>
              <div class="text-gray6 f14 btn-gray">使用兑换码</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="scene-card">
      <div class="vip-tab dis-flex">
        <div
          class="f14 text-gray9 pointer lia"
          :class="{ active: tabInd === 0 }"
          @click="changeTab(0)"
        >
          黑胶VIP
          <img src="../../../assets/image/user/member-vip.png" />
        </div>
        <div
          class="f14 text-gray9 pointer lia"
          :class="{ active: tabInd === 1 }"
          @click="changeTab(1)"
        >
          音乐包
          <img src="../../../assets/image/user/member-music.png" />
        </div>
      </div>
      <div class="vip-product">
        <ul class="dis-flex flex-wrap">
          <li
            class="lia"
            :class="{ active: index === itemInd }"
            v-for="(item, index) in listData"
            :key="index"
            @click="changeItem(index)"
          >
            <div class="corner" v-show="item.desc">{{ item.desc }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="origin">
              ￥<span class="f30">{{ item.price }}</span>
            </div>
            <div class="price">
              <template v-if="item.type === 1">
                折合￥{{ item.amount }}/月
              </template>
              <span class="line-through" v-else-if="item.type === 2">
                ￥{{ item.amount }}
              </span>
            </div>
            <div class="discount" v-show="item.discount">
              限时{{ item.discount }}折
            </div>
          </li>
        </ul>
        <div class="text-gray9 ml10">
          <template v-if="tabInd === 0">
            到期自动续费13元，可取消，芒果月卡限领1次
            <span class="help pointer inline-block"></span>
          </template>
          <template v-else>到期自动续费，可随时取消</template>
        </div>
        <div class="mt10">
          <span class="f14 text-gray3 ml10">选择优惠券</span>
          <span
            class="f12 text-blued4 ml10 pointer"
            @click="exchange = !exchange"
          >
            {{ exchange ? '兑换优惠券' : '取消兑换优惠券' }}
          </span>
        </div>
        <div class="coupon" v-show="exchange">
          <div
            class="coupon-form-select mt20 ml10 pointer"
            @click="dropdown = true"
          >
            <input
              class="select-placeholder f12 ml10"
              type="text"
              autocomplete="off"
              placeholder="该活动价不支持使用优惠券"
              @blur="dropdown = false"
              v-model="couponValue"
            />
            <span class="select-arrow"></span>
          </div>
          <div class="select-dropdown" v-show="dropdown">
            <ul>
              <li
                class="dropdown-menu not-allowed text-grayC"
                v-if="couponList.length === 0"
              >
                无可用优惠券
              </li>
              <li
                class="dropdown-menu pointer"
                v-for="(item, index) in couponList"
                :key="index"
                @click="chooseCoupon(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div
          class="exchange dis-flex align-center ml10 mt20"
          v-show="!exchange"
        >
          <input
            type="text"
            placeholder="请输入优惠券兑换码"
            class="f12 text-grayA"
            v-model="exchangeCode"
          />
          <button type="button" class="pointer">兑换</button>
        </div>
        <div class="payment mt20 ml10">
          <div class="f14 text-gray3">支付方式</div>
          <div class="scan dis-flex">
            <div class="scanImg"></div>
            <div class="ml20">
              <div class="f14 text-gray3">使用支付宝、微信扫码支付</div>
              <div class="pay-img mt10">
                <img
                  src="../../../assets/image/user/pay-zfb.png"
                  alt="支付宝"
                />
                <img
                  src="../../../assets/image/user/pay-wx.png"
                  alt="微信"
                  class="ml10"
                />
              </div>
              <div class="text-gray3"><span class="f45">13</span>元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { userVipInfo } from '@api/user';
import type { ResponseType } from '@/types/types';

type listType = {
  name: string;
  desc: string;
  price: number;
  amount: number;
  type: number;
  discount: string;
}[];

export default defineComponent({
  name: 'MemberView',
  setup() {
    const $store = useStore();
    const userInfo = computed(() => $store.getters.userInfo);
    const vipInfo = ref({});

    // 获取登录用户vip信息
    function getVipInfo() {
      userVipInfo()
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            vipInfo.value = res?.data;
          }
        })
        .catch(() => ({}));
    }
    getVipInfo();

    // 黑胶VIP列表
    const vip = [
      {
        name: '连续包月',
        desc: '免费送芒果月卡',
        price: 13,
        amount: 13,
        type: 1,
        discount: ''
      },
      {
        name: '连续包年',
        desc: '私信领爱奇艺季卡',
        price: 128,
        amount: 138,
        type: 2,
        discount: '9.3'
      },
      {
        name: '连续包季',
        desc: '私信领喜马月卡',
        price: 30,
        amount: 10,
        type: 1,
        discount: '7.7'
      },
      {
        name: '12个月',
        desc: '私信领严选年卡',
        price: 158,
        amount: 216,
        type: 2,
        discount: ''
      },
      {
        name: '6个月',
        desc: '',
        price: 88,
        amount: 108,
        type: 2,
        discount: ''
      },
      {
        name: '3个月',
        desc: '',
        price: 45,
        amount: 54,
        type: 2,
        discount: ''
      },
      {
        name: '1个月',
        desc: '',
        price: 16,
        amount: 18,
        type: 2,
        discount: ''
      }
    ];
    // 音乐包
    const music = [
      {
        name: '连续包月',
        desc: '推荐',
        price: 8,
        amount: 8,
        type: 1,
        discount: ''
      },
      {
        name: '12个月',
        desc: '',
        price: 88,
        amount: 7.33,
        type: 1,
        discount: ''
      },
      {
        name: '6个月',
        desc: '',
        price: 45,
        amount: 7.5,
        type: 1,
        discount: ''
      },
      {
        name: '1个月',
        desc: '',
        price: 8,
        amount: 8,
        type: 1,
        discount: ''
      }
    ];
    // 页面显示列表
    const listData = ref<listType>(vip);

    const tabInd = ref(0);
    const itemInd = ref(0);
    // tab切换
    function changeTab(ind: number) {
      tabInd.value = ind;
      itemInd.value = 0;
      if (ind === 0) listData.value = vip;
      else listData.value = music;
    }
    // 充值模块选择
    function changeItem(index: number) {
      itemInd.value = index;
    }

    // 优惠券兑换选择
    const exchange = ref(true);
    // 优惠券选择
    const dropdown = ref(false);
    // 优惠券列表
    const couponList = ref(['优惠券1', '优惠券2', '优惠券3']);
    // 优惠券选择
    const couponValue = ref('');
    // 优惠券选择
    function chooseCoupon(item: string) {
      couponValue.value = item;
      dropdown.value = false;
    }
    // 兑换码
    const exchangeCode = ref('');

    return {
      userInfo,
      vipInfo,
      tabInd,
      listData,
      itemInd,
      exchange,
      dropdown,
      couponList,
      couponValue,
      chooseCoupon,
      changeTab,
      changeItem,
      exchangeCode
    };
  }
});
</script>

<style lang="less" scoped>
@import './member.less';
</style>
