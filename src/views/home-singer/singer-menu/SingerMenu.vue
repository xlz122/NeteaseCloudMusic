<template>
  <div class="singer-menu">
    <div class="group">
      <h2 class="group-title">推荐</h2>
      <ul class="group-list">
        <li class="item">
          <span class="item-text item-active-text">推荐歌手</span>
        </li>
        <li class="item">
          <span class="item-text">入驻歌手</span>
        </li>
      </ul>
    </div>
    <div class="group language">
      <h2 class="group-title">华语</h2>
      <ul class="group-list">
        <li class="item">
          <span class="item-text">华语女歌手</span>
        </li>
        <li class="item">
          <span class="item-text">华语男歌手</span>
        </li>
      </ul>
    </div>
    <div class="group language">
      <h2 class="group-title">华语</h2>
      <ul class="group-list">
        <li class="item">
          <span class="item-text">华语女歌手</span>
        </li>
        <li class="item">
          <span class="item-text">华语男歌手</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="less">
.singer-menu {
  padding: 0 10px 40px;
  margin-top: 51px;

  .language {
    margin: 5px 0 0;
    padding-top: 16px;
    border-top: 1px solid #d3d3d3;
  }

  .group-title {
    height: 25px;
    padding-left: 14px;
    font-size: 16px;
    font-family: 'Microsoft Yahei';
  }

  .item {
    width: 160px;
    height: 29px;
    line-height: 29px;
    margin-bottom: 2px;

    .item-text {
      display: inline-block;
      width: 133px;
      padding-left: 27px;
      background: url(~@/assets/image/home/singer.png) no-repeat 0 9999px;
      background-position: 0 -30px;
      color: #333;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .item-active-text {
      background-position: 0 0;
      color: #c20c0c;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
