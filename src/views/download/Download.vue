<template>
  <div class="download-container">
    <div class="qrcode">
      <img
        class="qrcode-img"
        src="https://p1.music.126.net/wCRnpjXHpGRiq1c1uCkIFQ==/109951164246717547.png"
        alt="移动端下载"
      />
      <p class="text">扫描二维码下载</p>
    </div>
    <div class="content">
      <div class="main">
        <div class="other-download" @click="otherDownload">
          <i class="other-icon"></i>
          <p class="other-text">其他操作系统客户端</p>
          <ul class="other-download-modal" v-if="otherDownloadModal" @click.stop>
            <li class="item">
              <i class="icon android"></i>
              <span class="text">Android 版</span>
            </li>
            <li class="item">
              <i class="icon iphone"></i>
              <span class="text">iPhone 版</span>
            </li>
            <li class="item">
              <i class="icon iphone"></i>
              <span class="text">iPad 版</span>
            </li>
            <li class="item">
              <i class="icon mac"></i>
              <span class="text">Mac 版</span>
            </li>
            <li class="item">
              <i class="icon windows"></i>
              <span class="text">PC 版</span>
            </li>
            <li class="item">
              <i class="icon windows"></i>
              <span class="text">UWP 版</span>
            </li>
            <li class="item">
              <i class="icon windows"></i>
              <span class="text">WP 版</span>
            </li>
            <li class="item">
              <i class="icon linux"></i>
              <span class="text">Linux 版</span>
            </li>
          </ul>
        </div>
        <div
          v-if="downloadQrcode"
          class="qrcode download-qrcode"
          :class="{ 'download-pc': isPcDownLoad }"
        >
          <img
            class="qrcode-img"
            src="https://p1.music.126.net/wCRnpjXHpGRiq1c1uCkIFQ==/109951164246717547.png"
            alt="移动端下载"
          />
          <p class="text">扫描二维码下载</p>
        </div>
        <div class="main-pc">
          <div class="title">在电脑上听</div>
          <img class="img" src="../../assets/image/download/pc.png" alt="" />
          <div class="type">
            <span class="info">
              <i class="icon mac"></i>
              <span class="text">macOS</span>
            </span>
            <span class="info">
              <i class="icon windows"></i>
              <span class="text">Windows</span>
            </span>
          </div>
          <div class="download-btn" @click="downloadPc">
            <span class="text">下载电脑端</span>
          </div>
        </div>
        <div class="main-mobile">
          <div class="title">在手机上听</div>
          <img class="img" src="../../assets/image/download/mobile.png" alt="" />
          <div class="type">
            <span class="info">
              <i class="icon iphone"></i>
              <span class="text">iPhone</span>
            </span>
            <span class="info">
              <i class="icon android"></i>
              <span class="text">Android</span>
            </span>
          </div>
          <div class="download-btn" @click="downloadMobile">
            <i class="icon"></i>
            <span class="text">下载手机端</span>
          </div>
        </div>
      </div>
    </div>
    <div class="group quku">
      <div class="group-container">
        <div class="content">
          <h3 class="title">千万曲库 首首CD音质</h3>
          <p class="text">囊括百万无损SQ音乐，你在用手机听歌时，</p>
          <p class="text">也能感受到纤毫毕现的CD音质，更能免费离线收听</p>
        </div>
        <div class="img">
          <img src="../../assets/image/download/quku.jpg" alt="千万曲库  首首CD音质" />
        </div>
      </div>
    </div>
    <div class="group star">
      <div class="group-container">
        <div class="img">
          <img src="../../assets/image/download/star.jpg" alt="千位明星  亲自推荐音乐" />
        </div>
        <div class="content">
          <h3 class="title">千位明星 亲自推荐音乐</h3>
          <p class="text">
            韩红，戴佩妮等
            <span class="attract">千位明星已入驻</span>
            ，亲自创建私房歌单，录制独
          </p>
          <p class="text">家DJ节目，推荐他们心中的好音乐</p>
        </div>
      </div>
    </div>
    <div class="group social-contact">
      <div class="group-container">
        <div class="content">
          <h3 class="title">社交关系 发现全新音乐</h3>
          <p class="text">
            你可以
            <span class="attract">关注明星</span>
            、DJ和好友，通过浏览他们的动态、收藏和
          </p>
          <p class="text">分享，发现更多全新好音乐</p>
        </div>
        <div class="img">
          <img src="../../assets/image/download/social-contact.jpg" alt="社交关系  发现全新音乐" />
        </div>
      </div>
    </div>
    <div class="group real-time">
      <div class="group-container">
        <div class="img">
          <img src="../../assets/image/download/real-time.jpg" alt="手机电脑  歌单实时同步" />
        </div>
        <div class="content">
          <h3 class="title">手机电脑 歌单实时同步</h3>
          <p class="text">只要一个帐号，你就可以同步在手机、电脑上创建、收藏</p>
          <p class="text">
            的歌单，
            <span class="attract">随时随地畅享好音乐</span>
          </p>
        </div>
      </div>
    </div>
    <div class="group distinguish">
      <div class="group-container">
        <div class="content">
          <h3 class="title">听歌识曲 助你疯狂猜歌</h3>
          <p class="text">歌曲很动听却不知道歌名，歌名在嘴边却想不起来……</p>
          <p class="text">
            用
            <span class="attract">听歌识曲</span>
            功能，几秒钟就知道歌名
          </p>
        </div>
        <div class="img">
          <img
            src="../../assets/image/download/recognizing-music.jpg"
            alt="听歌识曲  助你疯狂猜歌"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 其他操作系统
const otherDownloadModal = ref(false);

function otherDownload(): void {
  otherDownloadModal.value = !otherDownloadModal.value;
}

// 下载电脑/手机端
const downloadQrcode = ref(false);
const isPcDownLoad = ref(false);

function downloadPc(): void {
  downloadQrcode.value = true;
  isPcDownLoad.value = true;
}

function downloadMobile(): void {
  downloadQrcode.value = true;
  isPcDownLoad.value = false;
}

onMounted(() => {
  document.addEventListener('click', function (e: MouseEvent): void {
    const target = e.target as HTMLElement;
    // pc、mobile下载
    if (
      target.className !== 'download-qrcode' &&
      target.className !== 'qrcode-img' &&
      target.className !== 'download-btn' &&
      target.className !== 'text'
    ) {
      downloadQrcode.value = false;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', () => ({}));
});
</script>

<style lang="less" scoped>
@import url('./download.less');
</style>
