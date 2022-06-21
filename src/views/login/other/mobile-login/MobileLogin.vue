<template>
  <div class="form-content">
    <div class="mobmie-phone-input">
      <div class="country-code" @click="toggleCountryCode">
        <span class="country-code-text">+{{ mobileFormData?.code }}</span>
        <i class="country-code-icon"></i>
      </div>
      <input
        class="input"
        :class="{
          'verify-error': mobileVerify.show && mobileVerify.type === 'phone'
        }"
        v-model="mobileFormData.phone"
        @keyup="mobilePhoneChange"
        type="text"
        placeholder="请输入手机号"
      />
      <ul class="country-code-list" v-show="countryCodeShow">
        <li
          class="item"
          v-for="(item, index) in countryCodeList"
          :key="index"
          @click="countryCodeChange(item.code)"
        >
          <span class="left-text">{{ item?.zh }}</span>
          <span class="right-text">+{{ item?.code }}</span>
        </li>
      </ul>
    </div>
    <input
      class="input input-password"
      :class="{
        'verify-error': mobileVerify.show && mobileVerify.type === 'password'
      }"
      v-model="mobileFormData.password"
      type="password"
      placeholder="请输入密码"
      @keyup.enter="passwordEnter"
    />
  </div>
  <div class="verification" v-if="mobileVerify.show">
    <i class="icon-verification"></i>
    <span class="text">{{ mobileVerify?.text }}</span>
  </div>
  <div class="mobile-phone-checkbox">
    <label for="mobile-phone-checkbox">
      <input class="checkbox" id="mobile-phone-checkbox" type="checkbox" />
      <span class="text">自动登录</span>
      <a
        class="forget-password"
        href="https://reg.163.com/naq/findPassword#/verifyAccount"
        target="_blank"
      >
        忘记密码？
      </a>
    </label>
  </div>
  <div class="mobile-phone-submit" @click="mobileSubmit">
    <i class="icon-mobile-phone-submit">{{ mobileSubmitText }}</i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {
  countryCode,
  testCellphone,
  cellphoneLogin,
  userInfo
} from '@api/login';
import { LoopType, ResponseType } from '@/types/types';

type MobileFormData = {
  code: string;
  phone: string;
  password: string;
};

type MobileVerify = {
  show: boolean;
  type: string;
  text: string;
};

type VerifyMethod = {
  type?: string;
  text: string;
};

export default defineComponent({
  setup() {
    const $store = useStore();

    // 表单数据
    const mobileFormData = reactive<MobileFormData>({
      code: '86',
      phone: '',
      password: ''
    });

    // 获取国家编码列表
    const countryCodeList = ref<unknown[]>([]);
    function getCountryCode(): void {
      countryCode()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            res.data.forEach((item: LoopType) => {
              item?.countryList.forEach((i: LoopType) => {
                countryCodeList.value.push(i);
              });
            });
          }
        })
        .catch(() => ({}));
    }
    getCountryCode();

    // 编码列表显隐
    const countryCodeShow = ref<boolean>(false);
    function toggleCountryCode(): void {
      countryCodeShow.value = !countryCodeShow.value;
    }

    // 编码改变
    function countryCodeChange(code: string): void {
      mobileFormData.code = code;
      countryCodeShow.value = false;
    }

    // 手机号正则验证
    function mobilePhoneChange(): void {
      mobileFormData.phone = mobileFormData.phone.replace(/[^\d]/g, '');
    }

    // 登录验证信息
    const mobileVerify = reactive<MobileVerify>({
      show: false,
      type: '',
      text: ''
    });

    // 表单验证方法
    function verifyMethod({ type = '', text }: VerifyMethod) {
      mobileVerify.show = true;
      mobileVerify.type = type;
      mobileVerify.text = text;
    }

    // 登录按钮文本
    const mobileSubmitText = ref<string>('登 录');
    function mobileSubmit(): boolean | undefined {
      mobileVerify.show = false;
      if (!mobileFormData.phone) {
        verifyMethod({ type: 'phone', text: '请输入手机号' });
        return false;
      }
      if (!mobileFormData.password) {
        verifyMethod({ type: 'password', text: '请输入登录密码' });
        return false;
      }

      mobileSubmitText.value = '登录中...';
      // 检测手机号是否注册
      getTestCellphone().then(() => {
        cellphoneLogin({
          countrycode: mobileFormData.code,
          phone: mobileFormData.phone,
          password: mobileFormData.password
        })
          .then((res: ResponseType) => {
            // 账号或密码错误
            if (res.code === 502) {
              verifyMethod({ text: '帐号或密码错误' });
              mobileSubmitText.value = '登 录';
            }
            // 登录成功
            if (res.code === 200 && res.account.status === 0) {
              const cookie = res.cookie as string;
              const cookieArr: string[] = cookie.split(';;');
              cookieArr.forEach(item => {
                document.cookie = item;
              });
              // 存储用户cookie
              $store.commit('setCookie', res.cookie);
              // 获取用户详情
              getUserInfo(res?.account?.id);
            }
          })
          .catch(() => ({}));
      });
    }

    // 密码框监听 - 回车
    function passwordEnter(): void {
      mobileSubmit();
    }

    // 检测手机号是否注册
    function getTestCellphone(): Promise<void> {
      return new Promise(resolve => {
        testCellphone({
          countrycode: mobileFormData.code,
          phone: mobileFormData.phone
        })
          .then((res: ResponseType) => {
            // 未设置密码
            if (res.code === 200 && res.hasPassword) {
              verifyMethod({ text: '该手机号未设置密码，请先设置密码' });
              mobileSubmitText.value = '登 录';
              return false;
            }
            // 手机号不存在
            if (res.code === 200 && res.exist === -1) {
              verifyMethod({ text: '手机号未注册，点击右下角前往注册' });
              mobileSubmitText.value = '登 录';
              return false;
            }
            // 手机号存在
            if (res.code === 200 && res.exist === 1) {
              resolve();
            }
          })
          .catch(() => ({}));
      });
    }

    // 获取用户详情
    function getUserInfo(uid: number): void {
      userInfo({ uid })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 存储用户信息
            $store.commit('setUserInfo', res);
            // 关闭登录对话框
            $store.commit('setLoginDialog', false);
            mobileSubmitText.value = '登 录';
          }
        })
        .catch(() => ({}));
    }

    // 监听点击
    onMounted(() => {
      document.addEventListener('click', function (e: MouseEvent): void {
        const target = e.target as HTMLElement;
        if (
          target.className !== 'country-code' &&
          target.className !== 'country-code-text' &&
          target.className !== 'country-code-icon'
        ) {
          countryCodeShow.value = false;
        }
      });
    });

    // 销毁点击监听
    onUnmounted(() => {
      document.removeEventListener('click', () => ({}));
    });

    return {
      countryCodeList,
      mobileFormData,
      countryCodeShow,
      toggleCountryCode,
      countryCodeChange,
      mobilePhoneChange,
      mobileVerify,
      mobileSubmit,
      passwordEnter,
      mobileSubmitText
    };
  }
});
</script>

<style lang="less" scoped>
@import './mobile-login.less';
</style>
