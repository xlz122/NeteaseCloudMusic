<template>
  <div class="comment-replay">
    <div class="comment-content">
      <!-- :placeholder="`回复${nickname}:`" -->
      <textarea
        class="comment-textarea"
        v-model="replay.text"
        :rows="rows"
        :style="commentReplayStyle"
      ></textarea>
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
            @click="expressionSwitch('next')"
            href="#"
            hidefocus="true"
            class="j-flag u-btn u-btn-nxt"
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, computed } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import { expressionList } from './comment-replay';

type Replay = {
  text: string;
  length: number;
};

type ExproessionPage = {
  list: unknown;
  current: number;
  total: number;
};

export default defineComponent({
  props: {
    clearText: {
      type: Boolean,
      default: false
    },
    rows: {
      type: [Number, String],
      default: 1
    },
    width: {
      type: [Number, String],
      default: 300
    },
    nickname: {
      type: String,
      default: ''
    }
  },
  setup(
    props: {
      clearText: boolean;
      width: number | string;
    },
    { emit }
  ) {
    // 样式设置
    const commentReplayStyle = computed(() => {
      return {
        width: `${props.width}px`
      };
    });
    // 回复数据
    const replay = reactive<Replay>({
      text: '',
      length: 140
    });

    // 监听最大可以输入数量
    watch(
      () => replay.text,
      (curVal: string) => {
        replay.length = 140 - curVal.length;
      }
    );

    // 监听清除文本内容
    watch(
      () => props.clearText,
      (curVal: boolean) => {
        if (curVal) {
          replay.text = '';
        }
      }
    );

    // 表情显隐
    const expressionShow = ref<boolean>(false);
    // 分页数据
    const exproessionPage = reactive<ExproessionPage>({
      list: [],
      current: 1,
      total: 0
    });
    function isEmoj(): void {
      expressionShow.value = !expressionShow.value;
      // 显示的时候计算页数
      if (expressionShow.value) {
        exproessionPage.list = expressionList.slice(0, 50);
        exproessionPage.current = 1;
        exproessionPage.total = Math.ceil(expressionList.length / 50);
      }
    }

    // 表情页数切换
    function expressionSwitch(type: string): boolean | undefined {
      // 上一页
      if (type === 'prev') {
        if (exproessionPage.current === 0) {
          return false;
        }
        exproessionPage.current--;
        exproessionPage.list = expressionList.slice(0, 50);
      }
      // 下一页
      if (type === 'next') {
        if (exproessionPage.current === exproessionPage.total) {
          return false;
        }
        exproessionPage.current++;
        exproessionPage.list = expressionList.slice(
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
      emit('submit', replay.text);
    }

    // 监听点击
    onMounted(() => {
      document.addEventListener('click', function (e: MouseEvent): void {
        const target = e.target as HTMLElement;
        // 点击表情以外得地方，关闭表情弹框
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

    return {
      expressionList,
      commentReplayStyle,
      replay,
      expressionShow,
      isEmoj,
      exproessionPage,
      expressionSwitch,
      chooseEmoj,
      submit
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment-replay.less';
</style>
