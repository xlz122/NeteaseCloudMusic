<template>
  <template v-if="!nextLook">
    <div class="form-content">
      <div class="label">手机号：</div>
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
      <div class="label">密码：</div>
      <input
        class="input input-password"
        :class="{
          'verify-error': mobileVerify.show && mobileVerify.type === 'password'
        }"
        v-model="mobileFormData.password"
        type="password"
        placeholder="设置登录密码，不少于8位"
        @keyup="passwordChange"
        @focus="passwordFocus"
      />
    </div>
    <div class="verification" v-if="mobileVerify.show">
      <div class="verification-group">
        <i
          class="icon-verification"
          :class="{ 'icon-adopt': mobileVerify.space }"
        ></i>
        <span class="text" :class="{ 'adopt-text': mobileVerify.space }">
          密码不能包含空格
        </span>
      </div>
      <div class="verification-group">
        <i
          class="icon-verification"
          :class="{ 'icon-adopt': mobileVerify.contain }"
        ></i>
        <span class="text" :class="{ 'adopt-text': mobileVerify.contain }">
          包含字母、数字、符号中至少两种
        </span>
      </div>
      <div class="verification-group">
        <i
          class="icon-verification"
          :class="{ 'icon-adopt': mobileVerify.length }"
        ></i>
        <span class="text" :class="{ 'adopt-text': mobileVerify.length }">
          密码长度为8-20位
        </span>
      </div>
    </div>
    <div
      class="mobile-phone-submit"
      :class="{ 'disable-submit': !mobileVerify.allPassed }"
      @click="nextStep"
    >
      <i class="icon-mobile-phone-submit">下一步</i>
    </div>
  </template>
  <!-- 手机验证码 -->
  <template v-else>
    <div class="verification-code">
      <div class="verification-code-title">
        <p class="phone-text">你的手机号：</p>
        <div class="phone-detail">
          <strong>+{{ mobileFormData.code }}</strong>
          <strong class="num">
            {{
              `${mobileFormData.phone.substr(
                0,
                3
              )}****${mobileFormData.phone.substr(7)}`
            }}
          </strong>
        </div>
      </div>
      <p class="verification-code-desc">为了安全，我们会给你发送短信验证码</p>
      <input class="verification-code-text" v-model="verificationCodeText" />
      <div class="send-out">
        <div class="verification" v-if="verificationCodeVerify.show">
          <i class="icon-verification"></i>
          <span class="text">{{ verificationCodeVerify.text }}</span>
        </div>
        <span class="send-text" v-if="verificationCodeVerify.time > 0">
          {{ `${verificationCodeVerify.time}s` }}
        </span>
        <span class="send-text" v-else @click="resend">重新发送</span>
      </div>
    </div>
    <div class="mobile-phone-submit" @click="verifyNextStep">
      <i class="icon-mobile-phone-submit">下一步</i>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { countryCode, captchaSent, captchaVerify } from '@api/login';
import { LoopType, ResponseType } from '@/types/types';

interface MobileFormData {
  code: string;
  phone: string;
  password: string;
}

interface MobileVerify {
  show: boolean;
  space: boolean;
  contain: boolean;
  length: boolean;
  allPassed: boolean;
}

interface VerifyMethod {
  type?: string;
  text: string;
}

interface VerificationCodeVerify {
  show: boolean;
  text: string;
  time: number;
}

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
      countryCode().then((res: ResponseType) => {
        if (res.code === 200) {
          res.data.forEach((item: LoopType) => {
            item?.countryList.forEach((i: LoopType) => {
              countryCodeList.value.push(i);
            });
          });
        }
      });
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
      space: false,
      contain: false,
      length: false,
      allPassed: false // 验证全部通过
    });

    // 密码输入
    function passwordChange(): void {
      passwordVerify();
    }

    // 密码获得焦点
    function passwordFocus(): void {
      passwordVerify();
    }

    // 密码验证
    function passwordVerify(): void {
      mobileVerify.show = true;

      // 是否包含空格
      if (/\s/.test(mobileFormData.password)) {
        mobileVerify.space = false;
      } else {
        mobileVerify.space = true;
      }
      // 包含字母、数字、符号中至少两种
      if (
        /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]/.test(
          mobileFormData.password
        )
      ) {
        mobileVerify.contain = true;
      } else {
        mobileVerify.contain = false;
      }
      // 长度在8~20之间
      if (
        mobileFormData.password.length >= 8 &&
        mobileFormData.password.length <= 20
      ) {
        mobileVerify.length = true;
      } else {
        mobileVerify.length = false;
      }

      // 全部通过
      if (mobileVerify.space && mobileVerify.contain && mobileVerify.length) {
        mobileVerify.show = false;
        mobileVerify.allPassed = true;
      }
    }

    // 下一步
    const nextLook = ref<boolean>(false);
    function nextStep(): void {
      // 发送验证码
      sendVerificationCode();
    }

    // 验证码
    const verificationCodeText = ref<string>('');

    // 验证码验证
    const verificationCodeVerify = reactive<VerificationCodeVerify>({
      show: false,
      text: '',
      time: 60 // 验证码定时器时间
    });

    // 表单验证方法
    function verifyMethod({ text }: VerifyMethod) {
      verificationCodeVerify.show = true;
      verificationCodeVerify.text = text;
    }

    // 发送验证码
    function sendVerificationCode(): void {
      captchaSent({
        ctcode: mobileFormData.code,
        phone: mobileFormData.phone
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            nextLook.value = true;
            verificationCodeTiming();
          }
        })
        .catch(err => {
          // 发送超过限制次数
          if (err.response.status === 400) {
            $store.commit('setMessage', {
              type: 'error',
              title: err.response.data.message
            });
          }
          // 发送时间间隔太短
          if (err.response.status === 405) {
            $store.commit('setMessage', {
              type: 'error',
              title: err.response.data.message
            });
          }
        });
    }

    // 验证码定时器计时
    const verificationCodeTimer = ref<number>(0);
    function verificationCodeTiming(): void {
      if (verificationCodeTimer.value) {
        clearInterval(verificationCodeTimer.value);
      }
      verificationCodeVerify.time = 60;
      verificationCodeTimer.value = setInterval(() => {
        verificationCodeVerify.time--;
        if (verificationCodeVerify.time <= 0) {
          clearInterval(verificationCodeTimer.value);
        }
      }, 1000);
    }

    // 重新发送
    function resend(): void {
      sendVerificationCode();
    }
    // 验证码下一步
    function verifyNextStep(): boolean | undefined {
      // 验证
      verificationCodeVerify.show = false;
      if (!verificationCodeText.value) {
        verifyMethod({ text: '请输入验证码' });
        return false;
      }
      getCaptchaVerify().then(() => {
        $store.commit('setMessage', {
          type: 'error',
          title: '很抱歉，余下功能未开发'
        });
      });
    }

    // 验证验证码
    function getCaptchaVerify(): Promise<void> {
      return new Promise(resolve => {
        captchaVerify({
          captcha: verificationCodeText.value,
          phone: mobileFormData.phone,
          ctcode: mobileFormData.code
        })
          .then(() => {
            resolve();
          })
          .catch(err => {
            // 验证码错误
            if (err.response.status === 503) {
              verifyMethod({ text: err.response.data.message });
            }
          });
      });
    }

    // 监听点击
    onMounted(() => {
      document.addEventListener('click', function(e: MouseEvent): void {
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
      document.removeEventListener('click', function(): void {
        console.log('MobileRegister.vue 点击事件移除');
      });
    });
    return {
      countryCodeList,
      mobileFormData,
      countryCodeShow,
      toggleCountryCode,
      countryCodeChange,
      mobilePhoneChange,
      nextLook,
      passwordChange,
      passwordFocus,
      mobileVerify,
      nextStep,
      verificationCodeText,
      verificationCodeVerify,
      resend,
      verifyNextStep
    };
  }
});
</script>

<style lang="less" scoped>
@import './mobile-register.less';
</style>
