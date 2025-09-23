<template>
  <div class="form-content">
    <div class="mobmie-phone-input">
      <div class="country-code" @click="toggleCountryCode">
        <span class="country-code-text">+{{ mobileFormData.code }}</span>
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
          <span class="left-text">{{ item.zh }}</span>
          <span class="right-text">+{{ item.code }}</span>
        </li>
      </ul>
    </div>
    <div class="password-item code" v-if="loginType.type === 0">
      <input
        class="input input-password"
        :class="{
          'verify-error': mobileVerify.show && mobileVerify.type === 'captcha'
        }"
        v-model="mobileFormData.captcha"
        placeholder="请输入验证码"
        @keyup.enter="passwordEnter"
      />
      <template v-if="!captcha.show">
        <span class="code-btn" @click="sendVerificationCode">
          <i class="code-text">获取验证码</i>
        </span>
      </template>
      <template v-else>
        <span class="code-btn">
          <i class="code-text">{{ captcha.time }}s</i>
        </span>
      </template>
    </div>
    <div class="password-item" v-if="loginType.type === 1">
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
      <a
        class="forget-password"
        href="https://reg.163.com/naq/findPassword#/verifyAccount"
        target="_blank"
      >
        忘记密码？
      </a>
    </div>
  </div>
  <div class="verification" v-if="mobileVerify.show">
    <i class="icon-verification"></i>
    <span class="text">{{ mobileVerify.text }}</span>
  </div>
  <div class="mobile-phone-checkbox">
    <span class="type" @click="typeChange">{{ loginType.text }}</span>
    <label for="mobile-phone-checkbox">
      <input class="checkbox" id="mobile-phone-checkbox" type="checkbox" />
      <span class="text">自动登录</span>
    </label>
  </div>
  <div class="mobile-phone-submit" @click="mobileSubmit">
    <i class="icon-mobile-phone-submit">{{ mobileSubmitText }}</i>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { countryCode, captchaSent, testCellphone, cellphoneLogin, userInfo } from '@/api/login';
import type { ResponseType } from '@/types';

type MobileFormData = {
  code: string;
  phone: string;
  password: string;
  captcha: string;
};

type CountryCodeItem = {
  code: string;
  zh: string;
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

type Captcha = {
  show: boolean;
  text: string;
  time: number;
  timer: number | null;
};

const store = useStore();

// 表单数据
const mobileFormData = reactive<MobileFormData>({
  code: '86',
  phone: '',
  password: '',
  captcha: ''
});

// 获取国家编码列表
const countryCodeList = ref<CountryCodeItem[]>([]);

function getCountryCode(): void {
  countryCode()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      res.data?.forEach?.((item: { countryList: CountryCodeItem[] }) => {
        item.countryList?.forEach?.((i) => {
          countryCodeList.value.push(i);
        });
      });
    })
    .catch(() => ({}));
}
getCountryCode();

// 编码列表显隐
const countryCodeShow = ref(false);

function toggleCountryCode(): void {
  countryCodeShow.value = !countryCodeShow.value;
}

// 编码改变
function countryCodeChange(code: string): void {
  mobileFormData.code = code;
  countryCodeShow.value = false;
}

// 验证码
const captcha = reactive<Captcha>({
  show: false,
  text: '',
  time: 60,
  timer: null
});

// 验证码定时器计时
function captchaTiming(): void {
  captcha.show = true;

  captcha.timer && clearInterval(captcha.timer);

  captcha.time = 60;
  captcha.timer = setInterval(() => {
    captcha.time--;
    if (captcha.time <= 0) {
      captcha.timer && clearInterval(captcha.timer);
      captcha.show = false;
    }
  }, 1000);
}

const loginType = reactive({
  text: '密码登录',
  type: 0
});

function typeChange(): void {
  if (loginType.type === 0) {
    loginType.text = '短信登录';
    loginType.type = 1;

    if (captcha.timer) {
      clearInterval(captcha.timer);
      captcha.show = false;
    }
    return;
  }

  loginType.text = '密码登录';
  loginType.type = 0;
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

// 发送验证码
function sendVerificationCode(): void {
  mobileVerify.show = false;
  if (!mobileFormData.phone) {
    verifyMethod({ type: 'phone', text: '请输入手机号' });
    return;
  }

  captchaSent({
    ctcode: mobileFormData.code,
    phone: mobileFormData.phone
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      captchaTiming();
      setMessage({ type: 'info', title: '验证码已发送' });
    })
    .catch((error) => {
      // 发送超过限制次数
      if (error.response.status === 400) {
        setMessage({ type: 'error', title: error.response.data?.message });
      }
      // 发送时间间隔太短
      if (error.response.status === 405) {
        setMessage({ type: 'error', title: error.response.data?.message });
      }
    });
}

// 登录按钮文本
const mobileSubmitText = ref('登 录');

function mobileSubmit(): void {
  mobileVerify.show = false;
  if (!mobileFormData.phone) {
    verifyMethod({ type: 'phone', text: '请输入手机号' });
    return;
  }
  if (!mobileFormData.captcha && loginType.type === 0) {
    verifyMethod({ type: 'captcha', text: '请输入验证码' });
    return;
  }
  if (!mobileFormData.password && loginType.type === 1) {
    verifyMethod({ type: 'password', text: '请输入登录密码' });
    return;
  }

  mobileSubmitText.value = '登录中...';
  // 检测手机号是否注册
  getTestCellphone().then(() => {
    cellphoneLogin({
      countrycode: mobileFormData.code,
      phone: mobileFormData.phone,
      password: mobileFormData.password,
      captcha: mobileFormData.captcha
    })
      .then((res: ResponseType) => {
        // 账号或密码错误
        if (res?.code === 502) {
          verifyMethod({ text: '帐号或密码错误' });
          mobileSubmitText.value = '登 录';
        }
        // 登录成功
        if (res?.code === 200 && res.account?.status === 0) {
          const cookie = res.cookie as string;
          const cookieArr: string[] = cookie.split(';;');
          cookieArr.forEach?.((item) => {
            document.cookie = item;
          });
          // 存储用户cookie
          store.commit('setCookie', res.cookie);
          // 获取用户详情
          getUserInfo(res.account?.id);
        }
      })
      .catch((error) => {
        // 验证码错误
        if (error.response?.data?.code === 503) {
          verifyMethod({ text: error.response?.data?.message ?? '' });
          mobileSubmitText.value = '登 录';
        }
      });
  });
}

// 密码框回车
function passwordEnter(): void {
  mobileSubmit();
}

// 检测手机号是否注册
function getTestCellphone(): Promise<void> {
  return new Promise((resolve) => {
    testCellphone({
      countrycode: mobileFormData.code,
      phone: mobileFormData.phone
    })
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        // 未设置密码
        if (!res.hasPassword) {
          verifyMethod({ text: '该手机号未设置密码，请先设置密码' });
          mobileSubmitText.value = '登 录';
          return;
        }
        // 手机号不存在
        if (res.exist === -1) {
          verifyMethod({ text: '手机号未注册，点击右下角前往注册' });
          mobileSubmitText.value = '登 录';
          return;
        }
        // 手机号存在
        if (res.exist === 1) {
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
      if (res?.code !== 200) {
        return;
      }

      store.commit('setUserInfo', res);
      store.commit('setLoginDialog', false);
      mobileSubmitText.value = '登 录';
    })
    .catch(() => ({}));
}

// 监听点击
onMounted(() => {
  document.addEventListener('click', function (e: MouseEvent): void {
    const target = e.target as HTMLDivElement;
    if (
      target.className !== 'country-code' &&
      target.className !== 'country-code-text' &&
      target.className !== 'country-code-icon'
    ) {
      countryCodeShow.value = false;
    }
  });
});

// 销毁监听
onUnmounted(() => {
  document.removeEventListener('click', () => ({}));
});
</script>

<style lang="less" scoped>
@import url('./mobile-login.less');
</style>
