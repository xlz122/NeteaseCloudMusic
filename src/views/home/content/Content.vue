<template>
  <div class="content">
    <div class="group">
      <div class="list-title">
        <span class="title">热门推荐</span>
        <ul class="tab">
          <li class="item first-item">华语</li>
          <li class="item">流行</li>
          <li class="item">摇滚</li>
          <li class="item">民谣</li>
          <li class="item last-item">电子</li>
        </ul>
        <span class="more">更多</span>
      </div>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">个性化推荐</span>
      </div>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">新碟上架</span>
        <span class="more">更多</span>
      </div>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title">榜单</span>
        <span class="more">更多</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  padding: 20px 20px 40px;
  .group {
    .list-title {
      position: relative;
      height: 33px;
      padding: 0 10px 0 34px;
      background-position: -225px -156px;
      border-bottom: 2px solid #c10d0c;
      text-align: left;
      .title {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        line-height: 28px;
        font-family: 'Microsoft Yahei', Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: normal;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: -31px;
          width: 34px;
          height: 33px;
          background: url('../../../assets/image/home/home-icon.png');
          background-position: -225px -156px;
        }
      }
      .tab {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin: 0px 0 0 20px;
        .item {
          position: relative;
          display: inline-block;
          margin-left: 10px;
          margin-right: 10px;
          color: #666;
          cursor: pointer;
          &::after {
            content: '|';
            position: absolute;
            top: 1px;
            right: -10px;
            width: 1px;
            color: #666;
          }
        }
        .first-item {
          margin-left: 0;
        }
        .last-item {
          &::after {
            content: '';
          }
        }
      }
      .more {
        position: absolute;
        top: 50%;
        right: 28px;
        transform: translateY(-50%);
        color: #666;
        cursor: pointer;
        &::after {
          content: '';
          position: absolute;
          top: 2px;
          right: -15px;
          width: 12px;
          height: 12px;
          background: url('../../../assets/image/home/home-icon.png');
          background-position: 0 -240px;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
