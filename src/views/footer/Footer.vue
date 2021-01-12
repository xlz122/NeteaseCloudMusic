<template>
  <div class="footer">
    <div class="content">
      <div class="content-left">
        <ul class="left-nav">
          <li class="item">
            <router-link class="link" to="">服务条款</router-link>
            <span class="line">|</span>
          </li>
          <li class="item">
            <router-link class="link" to="">服务条款</router-link>
            <span class="line">|</span>
          </li>
          <li class="item">
            <router-link class="link" to="">服务条款</router-link>
            <span class="line">|</span>
          </li>
          <li class="item">
            <router-link class="link" to="">服务条款</router-link>
            <span class="line">|</span>
          </li>
          <li class="item">
            <router-link class="link" to="">服务条款</router-link>
          </li>
        </ul>
        <div class="group">
          <span>网易公司版权所有©1997-2021</span>
          <span class="sep">杭州乐读科技有限公司运营：</span>
          <router-link class="link" to="">浙网文[2018]3506-263号</router-link>
        </div>
        <div class="group">
          <span class="sep">违法和不良信息举报电话：0571-89853516</span>
          <span>举报邮箱：</span>
          <router-link class="link" to="">ncm5990@163.com</router-link>
        </div>
        <div class="group">
          <router-link class="link sep" to="">
            粤B2-20090191-18 工业和信息化部备案管理系统网站
          </router-link>
          <router-link class="link" to="">
            <span class="logo"></span>
            浙公网安备 33010902002564号
          </router-link>
        </div>
      </div>
      <div class="content-right">
        <ul class="right-nav">
          <li class="item">
            <router-link class="link amped-icon" to=""></router-link>
            <span class="text amped-text"></span>
          </li>
          <li class="item">
            <router-link class="link auth-icon" to=""></router-link>
            <span class="text auth-text"></span>
          </li>
          <li class="item">
            <router-link class="link musician-icon" to=""></router-link>
            <span class="text musician-text"></span>
          </li>
          <li class="item">
            <router-link class="link reward-icon" to=""></router-link>
            <span class="text reward-text"></span>
          </li>
          <li class="item">
            <router-link class="link cash-icon" to=""></router-link>
            <span class="text cash-text"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  height: 172px;
  overflow: hidden;
  border-top: 1px solid #d3d3d3;
  background: #f2f2f2;
  .content {
    position: relative;
    width: 980px;
    margin: 0 auto;
    .content-left {
      position: absolute;
      top: 0px;
      left: 0;
      display: inline-block;
      width: 520px;
      padding-top: 15px;
      line-height: 24px;
      text-align: left;
      .left-nav {
        .item {
          display: inline-block;
          .link {
            color: #999;
          }
          .line {
            margin: 0 8px 0 10px;
            color: #c2c2c2;
          }
        }
      }
      .group {
        color: #666;
        .sep {
          margin-right: 14px;
        }
        .link {
          color: #666;
          .logo {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url(../../assets/image/police-logo.png) no-repeat;
            background-size: cover;
            display: inline-block;
            margin-right: 2px;
            vertical-align: -2px;
          }
        }
        .link:hover {
          color: #666;
          text-decoration: underline;
        }
      }
    }
    .content-right {
      position: absolute;
      top: 0px;
      right: 0;
      display: inline-block;
      vertical-align: top;
      margin-top: 33px;
      .right-nav {
        display: inline-block;
        vertical-align: middle;
        .item {
          display: inline-block;
          width: 72px;
          height: 70px;
          text-align: center;
          color: #666;
          .link {
            display: inline-block;
            width: 50px;
            height: 45px;
            margin: 0 auto;
            margin-left: -6px;
            background: url(../../assets/image/foot_enter.png) no-repeat;
            background-size: 110px 552px;
          }
          .amped-icon {
            background-position: -63px -456.5px;
          }
          .auth-icon {
            background-position: -63px -101px;
          }
          .musician-icon {
            background-position: 0 0;
          }
          .reward-icon {
            background-position: -60px -50px;
          }
          .cash-icon {
            background-position: 0 -101px;
          }
          .text {
            display: inline-block;
            width: 100%;
            height: 14px;
            margin: 5px 5px 0;
            background: url(../../assets/image/foot_enter_tt.png) no-repeat;
            background-size: 180px 139px;
          }
          .amped-text {
            margin-left: -5px;
            background-position: 0 -108px;
          }
          .auth-text {
            margin-left: 7px;
            background-position: -1px -91px;
          }
          .musician-text {
            margin-left: 8px;
            background-position: 0 0;
          }
          .reward-text {
            margin-left: 10px;
            background-position: 0 -54px;
          }
          .cash-text {
            margin-left: 8px;
            background-position: -1px -72px;
          }
        }
      }
    }
  }
}
</style>
