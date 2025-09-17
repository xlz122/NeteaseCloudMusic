<template>
  <div class="member">
    <div class="member-container">
      <!-- 用户信息 -->
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
          <div class="user-profile dis-flex">
            <div class="avatar">
              <img class="avatar-img" :src="userInfo.profile?.avatarUrl" alt="头像" />
            </div>
            <div class="user-content dis-flex direction-column justify-between">
              <div>
                <div class="dis-flex align-center">
                  <div class="f22">{{ userInfo.profile?.nickname }}</div>
                  <template v-if="vipInfo.redVipLevelIcon">
                    <img class="vip-level" :src="vipInfo.redVipLevelIcon" alt="等级" />
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

      <!-- 充值模块 -->
      <div class="scene-card">
        <div class="vip-tab dis-flex">
          <div
            class="f14 text-gray9 pointer lia"
            :class="{ active: tabInd === 0 }"
            @click="changeTab(0)"
          >
            黑胶VIP
            <img src="../../../assets/image/user/member-vip.png" alt="VIP" />
          </div>
          <div
            class="f14 text-gray9 pointer lia"
            :class="{ active: tabInd === 1 }"
            @click="changeTab(1)"
          >
            音乐包
            <img src="../../../assets/image/user/member-music.png" alt="音乐包" />
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
                <template v-if="item.type === 1"> 折合￥{{ item.amount }}/月 </template>
                <span class="line-through" v-else-if="item.type === 2"> ￥{{ item.amount }} </span>
              </div>
              <div class="discount" v-show="item.discount">限时{{ item.discount }}折</div>
            </li>
          </ul>
          <div class="text-gray9 ml10">
            <template v-if="tabInd === 0">
              到期自动续费13元，可取消，芒果月卡限领1次
              <span class="help pointer inline-block" @click="dialog.dialogShow = true"></span>
            </template>
            <template v-else>到期自动续费，可随时取消</template>
          </div>
          <div class="mt10">
            <span class="f14 text-gray3 ml10">选择优惠券</span>
            <span class="f12 text-blued4 ml10 pointer" @click="coupon.exchange = !coupon.exchange">
              {{ coupon.exchange ? '兑换优惠券' : '取消兑换优惠券' }}
            </span>
          </div>
          <div class="coupon" v-show="coupon.exchange">
            <div class="coupon-form-select mt20 ml10 pointer" @click="dropdownHandle">
              <input
                class="select-placeholder f12 ml10"
                type="text"
                autocomplete="off"
                placeholder="该活动价不支持使用优惠券"
                v-model="coupon.couponValue"
              />
              <span class="select-arrow"></span>
            </div>
            <div class="select-dropdown" v-show="coupon.dropdown">
              <ul>
                <li
                  class="dropdown-menu not-allowed text-grayc"
                  v-if="coupon.couponList.length === 0"
                >
                  无可用优惠券
                </li>
                <li
                  class="dropdown-menu pointer"
                  v-for="(item, index) in coupon.couponList"
                  :key="index"
                  @click="chooseCoupon(item)"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div class="exchange dis-flex align-center ml10 mt20" v-show="!coupon.exchange">
            <input
              type="text"
              placeholder="请输入优惠券兑换码"
              class="f12 text-graya"
              v-model="coupon.exchangeCode"
            />
            <button type="button" class="pointer" @click="exchangeCoupons">兑换</button>
          </div>
          <div class="payment mt20 ml10">
            <div class="f14 text-gray3">支付方式</div>
            <div class="scan dis-flex">
              <div class="scan-img">
                <img src="../../../assets/image/user/scanImg.png" alt="二维码" />
              </div>
              <div class="ml20">
                <div class="f14 text-gray3">使用支付宝、微信扫码支付</div>
                <div class="pay-img mt10">
                  <img src="../../../assets/image/user/pay-zfb.png" alt="支付宝" />
                  <img src="../../../assets/image/user/pay-wx.png" alt="微信" class="ml10" />
                </div>
                <div class="text-gray3"><span class="f45">13</span>元</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- vip特权 -->
      <div class="privilege">
        <p class="title f22 tc"><em>黑胶VIP特权</em></p>
        <div class="privilege-icon-list">
          <ul class="dis-flex flex-wrap">
            <li v-for="(item, index) in privilege.list" :key="index">
              <img
                :src="privilege.status === 2 ? item.imgNo || item.img : item.img"
                alt="特权图标"
              />
              <p class="f14">{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <p class="title f22 tc mt60"><em>VIP专享下载曲库</em></p>
        <p class="slogan">畅享2574万首VIP下载歌曲</p>
        <div class="song mt10">
          <div class="more">
            <p class="tc">
              <a href="/" class="text-blued4 f12 pointer">查看全部</a>
              <i class="ff1 text-blued4 f12">></i>
            </p>
          </div>
          <div class="songlist">
            <ul class="dis-flex flex-wrap justify-between">
              <li class="pointer" v-for="item in songList" :key="item.id">
                <img :src="item.img" alt="音乐" />
                <span class="mask"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 服务协议 -->
      <div class="service tc">
        <a
          target="_blank"
          href="https://music.163.com/prime/vip-contract"
          class="mr15 pointer outline-none text-gray9 f12 text-decoration-underline"
        >
          黑胶VIP服务协议
        </a>
        <a
          target="_blank"
          href="https://music.163.com/prime/package-contract"
          class="mr15 pointer outline-none text-gray9 f12 text-decoration-underline"
        >
          音乐包服务协议
        </a>
        <a
          target="_blank"
          href="https://music.163.com/html/web2/vipAndroidAutopay.html"
          class="mr15 pointer outline-none text-gray9 f12 text-decoration-underline"
        >
          自动续费服务协议
        </a>
        <span
          class="pointer outline-none text-gray9 f12 text-decoration-underline"
          @click="dialogProblem = !dialogProblem"
        >
          常见问题解答
        </span>
      </div>

      <!-- 连续包月服务须知 -->
      <Dialog
        class="vip-service-modal"
        :visible="dialog.dialogShow"
        title="连续包月服务须知"
        @cancel="dialog.dialogShow = false"
      >
        <div class="dialog-content">
          <p class="f14 text-gray3" v-for="(item, index) in dialog.dialogContent" :key="index">
            {{ item }}
          </p>
        </div>
      </Dialog>

      <!-- 兑换优惠券提示 -->
      <Prompt
        :show="dialog.promptShow"
        :icon="dialog.promptIcon"
        :content="dialog.promptContent"
        @close="closePrompt"
      >
      </Prompt>

      <!-- 会员常见问题 -->
      <Dialog
        class="problem-modal"
        :visible="dialogProblem"
        title="会员常见问题"
        customText="我知道了"
        showCustomButton
        @cancel="dialogProblem = false"
      >
        <div class="dialog-content">
          <h2 class="tc f16 text-gray3 fw-bold">会员常见问题</h2>
          <div>
            <p class="h text-gray3 fw-bold">【黑胶VIP和音乐包分别是什么，有什么权益？】</p>
            <div class="fold-content">
              <p>
                答：黑胶VIP是网易云音乐站内全平台的最高级别付费包月服务，畅享付费曲库、无损音质、免费下载、会员电台、头像挂件、歌词图片、个性皮肤、票务特权、福利券等丰富权益。
              </p>
              <p>
                ·
                音乐包是网易云音乐和版权方合作推出的正版音乐付费包月服务，开通音乐包即可免费下载会员专属曲库歌曲、畅享在线试听高音质等付费音乐权益；
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【音乐包的播放下载权益具体指什么？】</p>
            <div class="fold-content">
              <p>
                答：黑胶VIP、音乐包都可以免费播放及下载会员包内歌曲（不包括数字专辑、下架歌曲，此外极少数特殊歌曲应版权方要求可能不允许在线播放或下载），黑胶VIP、普通音乐包
                每月可下载300首付费歌曲，豪华音乐包每月可下载500首付费歌曲；
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【普通音乐包可否升级为豪华音乐包？】</p>
            <div class="fold-content">
              <p>
                答：可以，路径：进入我的会员页—点击会员身份片上的[本月下载]，进入付费歌曲下载量页面—点击[升级到500首]，即可进入豪华音乐包购买页，购买成功后您的豪华音乐包即刻生效，下载限额变为500首，
                未用完的普通音乐包剩余时长及其下载限额不会受影响，将会后移至豪华音乐包有效期之后。
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【音乐包和黑胶VIP是什么关系？】</p>
            <div class="fold-content">
              <p>
                答：·
                音乐包和黑胶VIP是2个独立计费、独立计时的2个会员服务，用户可以同时是黑胶VIP和音乐包身份。
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【原普通会员和豪华会员对应什么身份？】</p>
            <div class="fold-content">
              <p>
                答：
                2018年6月12日前购买的普通会员在其剩余有效期内对应新会员体系下的音乐包身份，其权益没有任何变化。2018年6月12日前购买的豪华会员在其剩余有效期内将免费升级为黑胶VIP+豪华音乐包身份，
                在原有权益基础上新增头像挂件、票务特权、福利券3大权益。
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【付费歌曲的下载限额】</p>
            <div class="fold-content">
              <p>
                答：每个计时周期内，黑胶VIP和音乐包专属歌曲的下载限额合计为300首（豪华音乐包为500首）。
              </p>
              <p>在会员套餐有效期内下载过的所有会员专属歌曲，都可在“会员中心-本月下载”中查看。</p>
              <p>· 同一首歌曲的不同音质下载都只算作一首；</p>
              <p>· 这部分已下载过的歌曲，可在会员有效期内无限下载；</p>
              <p>
                ·
                但如果会员到期，只有用户再次开通会员才能重新下载这部分歌曲，而之前已下载到本地的歌曲文件仍可以正常播放，但是部分付费歌曲应版权方要求仅可在会员有效期内本地使用，会员到期后需重新开通才可继续本地使用；
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【会员在海外能用吗？】</p>
            <div class="fold-content">
              <p>
                答：抱歉，因版权限制，部分歌曲仅限在中国大陆地区使用，购买会员后并不能在海外正常使用，请海外用户慎重购买。
              </p>
            </div>
          </div>
          <div>
            <p class="h text-gray3 fw-bold">【会员购买成功后没生效？】</p>
            <div class="fold-content">
              <p>
                答：因网络延迟问题，有可能出现会员购买成功后未及时到账，请尝试在5分钟后重启客户端查看。
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getImageUrl } from '@/utils/utils';
import { userVipInfo } from '@/api/user';
import type { ResponseType } from '@/types';
import Dialog from '@/components/Dialog.vue';
import Prompt from '@/components/Prompt.vue';

type VipInfo = {
  redVipLevelIcon?: string;
};

type ListType = {
  name: string;
  desc: string;
  price: number;
  amount: number;
  type: number;
  discount: string;
}[];

type CouponType = {
  exchange: boolean;
  dropdown: boolean;
  couponList: string[];
  couponValue: string;
  exchangeCode: string;
};

type DialogType = {
  dialogShow: boolean;
  dialogContent: string[];
  promptShow: boolean;
  promptIcon: string;
  promptContent: string;
};

const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

// 获取用户vip信息
const vipInfo = ref<VipInfo>({});

function getVipInfo(): void {
  userVipInfo()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      vipInfo.value = res.data ?? {};
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
// 音乐包列表
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
// 特权列表
const privilege = reactive({
  status: 1,
  list: [
    {
      code: 1,
      name: '会员曲库',
      img: getImageUrl('/src/assets/image/user/privilege/1.png')
    },
    {
      code: 2,
      name: '免费下载',
      img: getImageUrl('/src/assets/image/user/privilege/2.png')
    },
    {
      code: 1,
      name: '铃声',
      img: getImageUrl('/src/assets/image/user/privilege/1.png')
    },
    {
      code: 3,
      name: '历史日推',
      img: getImageUrl('/src/assets/image/user/privilege/3.png')
    },
    {
      code: 4,
      name: '歌词图片',
      img: getImageUrl('/src/assets/image/user/privilege/4.png'),
      imgNo: getImageUrl('/src/assets/image/user/privilege/4-no.png')
    },
    {
      code: 5,
      name: '无损音质',
      img: getImageUrl('/src/assets/image/user/privilege/5.png')
    },
    {
      code: 6,
      name: '广告特权',
      img: getImageUrl('/src/assets/image/user/privilege/6.png'),
      imgNo: getImageUrl('/src/assets/image/user/privilege/6-no.png')
    },
    {
      code: 7,
      name: '鲸云音效',
      img: getImageUrl('/src/assets/image/user/privilege/7.png'),
      imgNo: getImageUrl('/src/assets/image/user/privilege/7-no.png')
    },
    {
      code: 8,
      name: '头像挂件',
      img: getImageUrl('/src/assets/image/user/privilege/8.png'),
      imgNo: getImageUrl('/src/assets/image/user/privilege/8-no.png')
    },
    {
      code: 9,
      name: '个性皮肤',
      img: getImageUrl('/src/assets/image/user/privilege/9.png'),
      imgNo: getImageUrl('/src/assets/image/user/privilege/9-no.png')
    }
  ]
});

// 页面显示列表
const listData = ref<ListType>(vip);
const tabInd = ref(0);
const itemInd = ref(0);

// tab切换
function changeTab(ind: number) {
  tabInd.value = ind;
  itemInd.value = 0;
  if (ind === 0) {
    listData.value = vip;
    privilege.status = 1;
  } else {
    listData.value = music;
    privilege.status = 2;
  }
}

// 充值模块选择
function changeItem(index: number) {
  itemInd.value = index;
}

// 优惠券
const coupon = reactive<CouponType>({
  exchange: true, // 优惠券兑换选择
  dropdown: false, // 优惠券选择
  couponList: ['优惠券1', '优惠券2', '优惠券3'], // 优惠券列表
  couponValue: '', // 优惠券选择
  exchangeCode: '' // 兑换码
});

// 优惠券选择显示下拉
function dropdownHandle() {
  if (!coupon.dropdown) return (coupon.dropdown = true);
}

// 优惠券选择
function chooseCoupon(item: string) {
  coupon.couponValue = item;
  coupon.dropdown = false;
}

// 监听鼠标按下事件
function mousedown(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (
    target.className !== 'coupon' &&
    !target.className.includes('dropdown-menu') &&
    !target.className.includes('coupon-form-select-menu') &&
    !target.className.includes('coupon-form-select') &&
    !target.className.includes('select-placeholder')
  ) {
    coupon.dropdown = false;
    document.body.removeEventListener('mousedown', mousedown);
  }
}

watch(
  () => coupon.dropdown,
  (newVal: boolean) => {
    if (newVal) {
      document.body.addEventListener('mousedown', mousedown);
    } else {
      document.body.removeEventListener('mousedown', mousedown);
    }
  }
);

// help问号提示
const dialog = reactive<DialogType>({
  dialogShow: false,
  dialogContent: [
    '1.开通本服务后，将在会员到期前1天为您自动续费，续费成功会员自动延长相应时长；',
    '2.您的连续包月费用将从您绑定的支付账号中扣除；',
    '3.如您希望取消续订，请在扣除费期前至少24小时关闭自动续订；',
    '4. 购买成功后，若您的云音乐账户已绑定手机号，1个月芒果TV会员将为您充值至您绑定的手机号；若您的云音乐账户未绑定手机号，支付成功页将提示您绑定手机号，1个月芒果TV会员将跟随手机号到账，每个用户仅限领取1次；',
    '5.您也可以在[账号页-我的订单-订单详情页]领取1个月芒果TV会员；',
    '6. 若您填写的手机号注册过芒果TV，我们将为该手机账号开通会员；',
    '7. 若您填写的手机号没有注册过芒果TV，我们将自动注册手机号并开通会员。您可以用“手机号+动态验证码”快速登录芒果TV；',
    '8.仅支持中国大陆手机号绑定；',
    '9.使用手机话费支付不能参与领取芒果TV会员；',
    '10. 芒果TV会员权益为PC移动影视会员，权益支持在电脑/手机/PAD端体验；',
    '11. 取消自动续费：进入“网易云音乐”-点击左侧边栏-我的客服-管理自动续费，取消订阅自动续费即可，您也可以直接在微信、支付宝等第三方支付客户端内取消自动扣款设置（具体操作方式以各产品实际功能为准）。'
  ],
  promptShow: false, // 提示
  promptIcon: 'success', // 提示图标
  promptContent: '' // 提示文字
});

// 兑换提示
function exchangeCoupons() {
  dialog.promptIcon = 'error';
  dialog.promptContent = '请输入兑换码';
  dialog.promptShow = true;
}

// 关闭兑换提示
function closePrompt(val: boolean) {
  dialog.promptShow = val;
}

// 曲库
const songList = ref([
  {
    id: 1,
    img: getImageUrl('/src/assets/image/user/songs/1.png')
  },
  {
    id: 2,
    img: getImageUrl('/src/assets/image/user/songs/2.png')
  },
  {
    id: 3,
    img: getImageUrl('/src/assets/image/user/songs/3.png')
  },
  {
    id: 4,
    img: getImageUrl('/src/assets/image/user/songs/4.png')
  }
]);

// vip常见问题
const dialogProblem = ref(false);

onMounted(() => {
  store.commit('setMenuIndex', -1);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('@/assets/style/base.less');
@import url('./member.less');
</style>

<style lang="less">
.vip-service-modal .dialog-box {
  width: 760px !important;
  min-height: auto !important;

  .dialog-title {
    font-size: 16px;
    font-weight: initial;
    text-align: center;
  }

  .dialog-content {
    padding: 23px 60px 33px;

    .dialog-content {
      p {
        line-height: 26px;
      }
    }
  }
}

.problem-modal .dialog-box {
  width: 640px;

  .dialog-content {
    height: 250px;
    padding: 11px 34px 0;
    overflow: auto;

    .h {
      padding-top: 16px;
      padding-bottom: 9px;
      font-size: 12px;
    }

    .fold-content {
      margin-top: 8px;
      margin-bottom: 8px;

      p {
        padding-bottom: 8px;
        font-size: 12px;
        line-height: 16px;
        color: #666;
      }
    }
  }
}
</style>
