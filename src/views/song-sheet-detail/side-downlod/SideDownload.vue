<template>
  <div class="side-download">
    <ul class="download-list">
      <li class="item">
        <a
          class="link ios"
          href="https://itunes.apple.com/cn/app/id590338362"
          target="_blank"
        ></a>
      </li>
      <li class="item">
        <a
          class="link pc"
          href="https://music.163.com/api/pc/download/latest"
          target="_blank"
        ></a>
      </li>
      <li class="item">
        <a
          class="link aos"
          href="https://music.163.com/api/android/download/latest2"
          target="_blank"
        ></a>
      </li>
    </ul>
    <p class="desc">同步歌单，随时畅听320k好音乐</p>
  </div>
</template>

<style lang="less" scoped>
.side-download {
  padding-bottom: 40px;

  .download-list {
    height: 65px;
    margin-bottom: 10px;
    background: url('~@/assets/image/song-sheet/song-sheet-detail-download.png');
    background-position: 0 -392px;

    .item {
      display: inline-block;
      vertical-align: top;

      .link {
        display: block;
        text-indent: -9999px;

        &:hover {
          background: url('~@/assets/image/song-sheet//song-sheet-detail-download.png');
        }
      }

      .ios {
        width: 42px;
        height: 48px;

        &:hover {
          background-position: 0 -472px;
        }
      }

      .pc {
        width: 60px;
        height: 48px;
        margin: 0 26px 0 30px;

        &:hover {
          background-position: -72px -472px;
        }
      }

      .aos {
        width: 42px;
        height: 48px;

        &:hover {
          background-position: -158px -472px;
        }
      }
    }
  }

  .desc {
    color: #999;
    text-align: left;
  }
}
</style>
