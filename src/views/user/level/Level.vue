<template>
  <div class="level">
    <div class="level-container">
      <div class="level-title">
        当前等级:
        <i class="level-icon"></i>
        <p class="num">{{ level || 0 }}</p>
      </div>
      <div class="level-privilege-title">
        当前等级特权:
        <div class="telist">
          <ul class="privilege-list">
            <li
              class="privilege-list-item"
              v-for="(item, index) in privilegeList"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="aboutmore">了解等级特权></div>
      <div class="next-level-title">
        距离下一个等级:
        <i class="level-icon"></i>
        <p class="num">{{ level + 1 || 0 }}</p>
        <i class="n-iconpoint"></i>
        <div class="uitl">
          <span class="text">听歌：</span>
          <div class="bar">
            <div class="barbox">
              <span
                class="current"
                :style="`width: ${nextLevel.playProgress * 100}%;`"
              ></span>
            </div>
          </div>
          还需听歌{{ nextLevel.playCount }}首
        </div>
        <div class="uitl">
          <span class="text">登录：</span>
          <div class="bar">
            <div class="barbox">
              <span
                class="current"
                :style="`width: ${nextLevel.loginProgress * 100}%;`"
              ></span>
            </div>
          </div>
          还需登录{{ nextLevel.loginCount }}天
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { userLevel } from '@api/user';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();
    // 用户等级
    const level = ref<number>(0);
    // 特权
    const privilegeList = ref<string[]>([]);
    // 下一级数据
    const nextLevel = reactive({
      loginCount: 0,
      playCount: 0,
      loginProgress: 0,
      playProgress: 0
    });

    // 获取等级数据
    function getUserLevel() {
      userLevel()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            level.value = res.data.level;
            privilegeList.value = res.data.info.split('$');
            // 下一级(计算剩余)
            nextLevel.loginCount =
              res.data.nextLoginCount - res.data.nowLoginCount;
            nextLevel.playCount =
              res.data.nextPlayCount - res.data.nowPlayCount;
            // 下一级(计算百分比)
            nextLevel.loginProgress =
              res.data.nowLoginCount / res.data.nextLoginCount.toFixed(3);
            nextLevel.playProgress =
              res.data.nowPlayCount / res.data.nextPlayCount.toFixed(3);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    getUserLevel();

    return {
      privilegeList,
      level,
      nextLevel
    };
  }
});
</script>

<style lang="less" scoped>
@import './level.less';
</style>
