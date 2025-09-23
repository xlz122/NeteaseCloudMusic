<template>
  <div class="level">
    <div class="level-container">
      <div class="level-title">
        当前等级:
        <i class="level-icon"></i>
        <p class="num">{{ level.current }}</p>
      </div>
      <div class="sub">
        <div class="subbg">
          <div :style="`width:${(25 + 81) * level.current * 0.835}px;`">
            <span></span>
          </div>
        </div>
        <div class="subnum">
          <div class="divison">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="divnum">
            <ul>
              <li
                v-for="(item, index) in level.list"
                :key="index"
                :class="[{ 'z-ov': index < level.current }, { 'z-on': index === level.current }]"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <span class="level-desc">等级数据每天下午2点更新</span>
      </div>
      <div class="level-privilege-title">
        当前等级特权:
        <div class="telist">
          <ul class="privilege-list" v-if="level.current !== 0">
            <li class="privilege-list-item" v-for="(item, index) in privilege" :key="index">
              {{ item }}
            </li>
          </ul>
          <ul class="privilege-list" v-else>
            <li class="privilege-list-item">没有任何特权，加油升级哦!</li>
          </ul>
        </div>
      </div>
      <div class="aboutmore" @click="jumpLevelDetail">了解等级特权></div>
      <div class="next-level-title">
        距离下一个等级:
        <i class="level-icon"></i>
        <p class="num">{{ level.current + 1 }}</p>
        <i class="n-iconpoint"></i>
        <div class="uitl">
          <span class="text">听歌：</span>
          <div class="bar">
            <div class="barbox">
              <span class="current" :style="`width: ${nextLevel.playProgress * 100}%;`"></span>
            </div>
          </div>
          还需听歌{{ nextLevel.playCount }}首
        </div>
        <div class="uitl">
          <span class="text">登录：</span>
          <div class="bar">
            <div class="barbox">
              <span class="current" :style="`width: ${nextLevel.loginProgress * 100}%;`"></span>
            </div>
          </div>
          还需登录{{ nextLevel.loginCount }}天
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { userLevel } from '@/api/user';
import type { ResponseType } from '@/types';

type NextLevel = {
  playCount: number;
  playProgress: number;
  loginCount: number;
  loginProgress: number;
};

const store = useStore();
const router = useRouter();

// 用户等级
const level = reactive({
  current: 0,
  list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
});
// 用户特权
const privilege = ref<string[]>([]);
// 下一等级
const nextLevel = reactive<NextLevel>({
  playCount: 0,
  playProgress: 0,
  loginCount: 0,
  loginProgress: 0
});

function getUserLevel(): void {
  userLevel()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      level.current = res.data?.level ?? 0;
      privilege.value = res.data?.info?.split?.('$') ?? [];

      const nowPlayCount = res.data?.nowPlayCount ?? 0;
      const nextPlayCount = res.data?.nextPlayCount ?? 0;
      const nowLoginCount = res.data?.nowLoginCount ?? 0;
      const nextLoginCount = res.data?.nextLoginCount ?? 0;

      nextLevel.playCount = nextPlayCount - nowPlayCount;
      nextLevel.loginCount = nextLoginCount - nowLoginCount;
      nextLevel.playProgress = nowPlayCount / nextPlayCount.toFixed?.(3);
      nextLevel.loginProgress = nowLoginCount / nextLoginCount.toFixed?.(3);
    })
    .catch(() => ({}));
}
getUserLevel();

function jumpLevelDetail(): void {
  router.push({ path: '/level-detail' });
}

onMounted(() => {
  store.commit('setMenuIndex', -1);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./level.less');
</style>
