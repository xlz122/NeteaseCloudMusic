<template>
  <div class="classify-modal">
    <div class="hd">
      <i class="icon"></i>
    </div>
    <div class="bd"></div>
    <div class="ft"></div>
  </div>
</template>

<style lang="less" scoped>
.classify-modal {
  position: absolute;
  top: 35px;
  left: -40px;
  z-index: 5;
  width: 720px;

  .hd {
    height: 32px;
    background: url('../../../assets/image/home/home-song-sheet-modal-hd.png')
      no-repeat;

    .icon {
      position: absolute;
      top: 2px;
      left: 132px;
      display: inline-block;
      width: 24px;
      height: 11px;
      background: url('../../../assets/image/music-audio/iconall.png');
      background-position: -48px 0;
      vertical-align: middle;
    }
  }

  .bd {
    width: 700px;
    height: 100px;
    padding: 0 10px;
    background: url('../../../assets/image/home/home-song-sheet-modal-hd.png');
    background-position: -720px 0;
    background-repeat: repeat-y;
  }

  .ft {
    height: 20px;

    background: url('../../../assets/image/home/home-song-sheet-modal-hd.png');
    background-position: -1440px -12px;
  }
}
</style>
