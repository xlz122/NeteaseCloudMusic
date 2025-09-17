<template>
  <div class="comment-replay">
    <div class="comment-content">
      <!-- :placeholder="`回复${nickname}:`" -->
      <template v-if="isLogin">
        <textarea
          class="comment-textarea"
          v-model="replay.text"
          :rows="rows"
          placeholder="评论"
        ></textarea>
      </template>
      <template v-if="!isLogin">
        <textarea
          class="comment-textarea"
          v-model="replay.text"
          :rows="rows"
          readonly
          @click="jumpToComment"
          placeholder="评论"
        ></textarea>
      </template>
    </div>
    <div class="operate">
      <div class="operate-icon">
        <i class="icon expression" @click="isEmoj"></i>
        <i class="icon att"></i>
      </div>
      <div class="operate-publish">
        <span class="text" :class="{ 'words-beyond': replay.length < 0 }">
          {{ replay.length }}
        </span>
        <button class="publish" @click="submit">评论</button>
      </div>
    </div>
    <!--表情-->
    <div v-if="expressionShow" class="auto-content">
      <div class="e-emts">
        <div class="emtwrap">
          <span
            class="emtwrap-img"
            v-for="(item, index) in exproessionPage.list"
            :key="index"
            :title="item.title"
          >
            <img
              class="emtwrap-expression"
              :src="`http://s1.music.126.net/style/web2/emt/emoji_${item.num}.png`"
              @click="chooseEmoj(index)"
            />
          </span>
        </div>
        <div class="page">
          <a
            @click="expressionSwitch('prev')"
            href="#"
            hidefocus="true"
            class="j-flag u-btn u-btn-prv"
          ></a>
          <span class="j-flag text s-fc3">
            {{ exproessionPage.current }} / {{ exproessionPage.total }}
          </span>
          <a
            class="j-flag u-btn u-btn-nxt"
            href="#"
            hidefocus="true"
            @click="expressionSwitch('next')"
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { expressionList } from './comment-replay';

type ExproessionPage = {
  current: number;
  total: number;
  list: {
    title: string;
    num: number;
  }[];
};

const props = defineProps({
  isClearText: {
    type: Boolean,
    default: false
  },
  rows: {
    type: [Number, String],
    default: 1
  },
  nickname: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['submit']);

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 回复数据
const replay = reactive({
  text: '',
  length: 140
});

// 监听最大可以输入数量
watch(
  () => replay.text,
  () => {
    replay.length = 140 - replay.text.length;
  }
);

// 监听清除文本内容
watch(
  () => props.isClearText,
  () => {
    if (!props.isClearText) {
      return;
    }

    replay.text = '';
  }
);

// 未登录点击评论框
function jumpToComment(): void {
  store.commit('setLoginDialog', true);
}

// 表情
const expressionShow = ref(false);
const exproessionPage = reactive<ExproessionPage>({
  current: 1,
  total: 0,
  list: []
});

function isEmoj(): void {
  expressionShow.value = !expressionShow.value;
  // 计算页数
  if (expressionShow.value) {
    exproessionPage.current = 1;
    exproessionPage.total = Math.ceil(expressionList.length / 50);
    exproessionPage.list = expressionList.slice?.(0, 50);
  }
}

// 表情页数切换
function expressionSwitch(type: string): void {
  // 上一页
  if (type === 'prev') {
    if (exproessionPage.current === 0) {
      return;
    }

    exproessionPage.current--;
    exproessionPage.list = expressionList.slice?.(0, 50);
  }

  // 下一页
  if (type === 'next') {
    if (exproessionPage.current === exproessionPage.total) {
      return;
    }

    exproessionPage.current++;
    exproessionPage.list = expressionList.slice?.(
      (exproessionPage.current - 1) * 50,
      (exproessionPage.current - 1) * 50 + 50
    );
  }
}

// 表情点击
function chooseEmoj(index: number): void {
  const list = JSON.parse(JSON.stringify(exproessionPage.list));
  replay.text += `[${list[index].title}]`;
}

// 回复提交
function submit(): void {
  emits('submit', replay.text);
}

// 点击表情以外得地方, 关闭表情弹框
onMounted(() => {
  document.addEventListener('click', function (e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (
      target.className !== 'icon expression' &&
      target.className !== 'page' &&
      target.className !== 'j-flag u-btn u-btn-prv' &&
      target.className !== 'j-flag u-btn u-btn-nxt' &&
      target.className !== 'emtwrap-expression'
    ) {
      expressionShow.value = false;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', () => ({}));
});
</script>

<style lang="less" scoped>
@import url('./comment-replay.less');
</style>
