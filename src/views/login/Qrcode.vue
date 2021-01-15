<template>
  <div class="qrcode" v-if="!qrcodeAuthorized">
    <i class="icon-phone"></i>
    <div class="qrcode-right">
      <p class="title">扫码登录</p>
      <!-- 二维码 -->
      <div class="qrcode-img">
        <div class="canvas">
          <img class="canvas-img" :src="qrcodeImgSrc" alt="Scan me!" />
        </div>
      </div>
      <!-- 二维码失效 -->
      <div class="tip" v-if="qrcodeInvalid">
        <div class="text">二维码已失效</div>
        <span class="refresh" @click="refresh">点击刷新</span>
      </div>
      <div class="text">
        使用
        <router-link class="link" to="/download" target="_blank">
          网易云音乐APP
        </router-link>
        扫码登录
      </div>
    </div>
  </div>
  <!-- 扫码成功 - 待确认 -->
  <div class="qrcode-authorized" v-else>
    <i class="icon-phone"></i>
    <p class="title">扫描成功</p>
    <p class="text">请在手机上确认登录</p>
  </div>
  <button class="other-btn" @click="otherLogin">
    选择其他登录模式
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {
  qrcodeKey,
  qrcodeImg,
  qrcodeStatus,
  accountInfo,
  userInfo
} from '@api/login';
import { ResponseDataType } from '@/types/types';

export default defineComponent({
  emits: ['otherLogin'],
  setup(props, ctx) {
    const $store = useStore();

    // 获取二维码登录key
    const qrcodeImgKey = ref<string>('');
    function getQrcodeImgKey() {
      qrcodeKey().then((res: ResponseDataType) => {
        if (res.code === 200) {
          qrcodeImgKey.value = res.data.unikey;
          getQrcodeImg();
        }
      });
    }

    onMounted(() => {
      getQrcodeImgKey();
    });

    // 二维码图片路径
    const qrcodeImgSrc = ref<string>('');
    function getQrcodeImg() {
      qrcodeImg({
        key: qrcodeImgKey.value,
        qrimg: true
      }).then((res: ResponseDataType) => {
        if (res.code === 200) {
          qrcodeImgSrc.value = res.data.qrimg;
          getQrcodeStatus();
        }
      });
    }

    // 二维码失效
    const qrcodeInvalid = ref<boolean>(false);
    // 二维码待确认
    const qrcodeAuthorized = ref<boolean>(false);
    // 定时器
    const timer = ref<number>(0);

    function getQrcodeStatus() {
      qrcodeStatus({
        key: qrcodeImgKey.value
      }).then((res: ResponseDataType) => {
        console.log(res);
        // 800失效，
        if (res.code === 800) {
          qrcodeInvalid.value = true;
        }
        // 801等待扫码，
        if (res.code === 801) {
          if (timer.value) {
            clearTimeout(timer.value);
          }
          timer.value = setTimeout(() => {
            getQrcodeStatus();
          }, 1000);
        }
        // 802待确认
        if (res.code === 802) {
          if (timer.value) {
            clearTimeout(timer.value);
          }
          timer.value = setTimeout(() => {
            getQrcodeStatus();
          }, 1000);
          qrcodeAuthorized.value = true;
        }
        // 803授权成功
        if (res.code === 803) {
          document.cookie = `${res.cookie}`;
          getAccount();
        }
      });
    }

    // 获取账号信息
    function getAccount(): void {
      accountInfo().then((res: ResponseDataType) => {
        if (res.code === 200) {
          // 存储账户信息
          localStorage.setItem('token', res?.token || '');
          localStorage.setItem('accountInfo', JSON.stringify(res?.account));
          $store.commit('setAccountInfo', res?.account);
          // 获取用户详情
          getUserInfo(res?.account?.id);
        }
      });
    }

    // 获取用户详情
    function getUserInfo(uid: string): void {
      userInfo({ uid }).then((res: ResponseDataType) => {
        if (res.code === 200) {
          // 存储用户信息
          localStorage.setItem('userInfo', JSON.stringify(res));
          $store.commit('setUserInfo', res);
          // 关闭登录对话框
          $store.commit('setLoginDialog', false);
        } else {
          alert(res?.msg);
        }
      });
    }

    // 刷新
    function refresh(): void {
      getQrcodeImgKey();
    }

    // 其他登录
    function otherLogin(): void {
      ctx.emit('otherLogin');
    }

    onUnmounted(() => {
      if (timer.value) {
        clearTimeout(timer.value);
      }
      qrcodeImgKey.value = '';
      qrcodeImgSrc.value = '';
    });
    return {
      qrcodeImgSrc,
      qrcodeInvalid,
      qrcodeAuthorized,
      refresh,
      otherLogin
    };
  }
});
</script>

<style lang="less">
.qrcode {
  margin: 0 auto;
  text-align: center;
  .icon-phone {
    display: inline-block;
    width: 125px;
    height: 220px;
    background: url(../../assets/image/login/qrcode-phone.png) no-repeat;
    background-size: contain;
    vertical-align: middle;
  }
  .qrcode-right {
    display: inline-block;
    margin-left: 25px;
    vertical-align: middle;
    .title {
      font-size: 18px;
      font-weight: 500;
    }
    .qrcode-img {
      position: relative;
      width: 130px;
      height: 130px;
      padding: 4px;
      margin: 13px auto;
      .tip {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: block;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        .text {
          width: 100%;
          margin: 45px auto 6px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.8);
          font-weight: 500;
        }
        .refresh {
          display: block;
          margin: 0 auto;
          padding-right: 0;
          width: 64px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 4px;
          background: linear-gradient(180deg, #81dd81 0%, #55a055 100%);
          border: 1px solid #5baf5b;
          box-shadow: inset 0 -1px 1px 1px rgba(185, 230, 185, 0.31);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
      }
      .canvas {
        width: 100%;
        height: 100%;
        .canvas-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .text {
      font-size: 12px;
      width: 200px;
      line-height: 17px;
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
      .link {
        color: #0c73c2;
      }
    }
  }
}
.qrcode-authorized {
  widows: 100%;
  .icon-phone {
    display: block;
    background-size: contain;
    width: 140px;
    height: 140px;
    margin: 0 auto;
    background: url(../../assets/image/login/qrcode-phone-authorized.png)
      no-repeat;
    background-size: contain;
  }
  .title {
    margin-top: 12px;
    font-size: 18px;
    font-weight: 450;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.8);
    text-align: center;
  }
  .text {
    margin-top: 4px;
    margin-bottom: 30px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}
.other-btn {
  display: block;
  width: 118px;
  height: 100%;
  margin: 20px auto 25px;
  padding-right: 0;
  font-size: 12px;
  border: 1px solid #979797;
  border-radius: 15px;
  line-height: 28px;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  background-color: #fff;
  outline: none;
  cursor: pointer;
}
</style>
