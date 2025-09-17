<template>
  <div class="page">
    <span
      class="page-btn prev-btn"
      :class="{ 'prev-disabled-btn': current === 1 }"
      @click="prevChange"
    >
      上一页
    </span>
    <!-- 第一页 -->
    <span
      v-if="prevDot"
      class="page-num"
      :class="{ 'page-active-num': current === 1 }"
      @click="pageChange(1)"
    >
      1
    </span>
    <!-- 页数前省略号 -->
    <span v-if="prevDot" class="page-dot">...</span>
    <span
      class="page-num"
      v-for="(item, index) in pageList"
      :key="index"
      :class="{ 'page-active-num': current === item }"
      @click="pageChange(item)"
    >
      {{ item }}
    </span>
    <!-- 页数后省略号 -->
    <span v-if="nextDot" class="page-dot">...</span>
    <!-- 最后一页 -->
    <span
      v-if="nextDot"
      class="page-num"
      :class="{ 'page-active-num': current === totalPage }"
      @click="pageChange(totalPage)"
    >
      {{ totalPage }}
    </span>
    <span
      class="page-btn next-btn"
      :class="{ 'next-disabled-btn': current === totalPage }"
      @click="nextChange"
    >
      下一页
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue';

const props = defineProps({
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 10
  },
  displayPage: {
    type: Number,
    default: 8
  }
});
const emits = defineEmits(['onChange']);

const { page, pageSize, total: pageTotal, displayPage } = toRefs(props);

// 总页数
const totalPage = ref(0);
// 当前页
const current = ref<number>(page.value);
// 页数前省略号
const prevDot = ref(false);
// 页数后省略号
const nextDot = ref(false);
// page数组
const pageList = ref<number[]>([]);

// 初始化分页
function init(): void {
  pageList.value = [];

  // 切换分页过程，总数改变调用changePage保证分页显示正确
  if (prevDot.value && nextDot.value) {
    changePage();
    return;
  }

  // 总页数
  totalPage.value = Math.ceil(pageTotal.value / pageSize.value);
  // 总页数 = 显示页数
  if (totalPage.value === displayPage.value) {
    for (let i = 1; i <= totalPage.value; i++) {
      if (i <= displayPage.value) {
        pageList.value.push(i);
      }
    }
  }

  // 总页数 > 显示页数
  if (totalPage.value > displayPage.value) {
    nextDot.value = true;
    for (let i = 1; i <= totalPage.value; i++) {
      if (i <= displayPage.value) {
        pageList.value.push(i);
      }
    }
  }

  // 总页数 < 显示页数
  if (totalPage.value < displayPage.value) {
    for (let i = 1; i <= totalPage.value; i++) {
      pageList.value.push(i);
    }
  }
}

// 监听页数
watch(
  () => props.page,
  () => {
    current.value = props.page;
  }
);

// 监听总页数更改
watch(
  () => pageTotal.value,
  () => {
    init();
  },
  { immediate: true }
);

// 上一页
function prevChange(): void {
  if (current.value <= 1) {
    return;
  }
  current.value = current.value - 1;
}

// 下一页
function nextChange(): void {
  if (current.value >= totalPage.value) {
    return;
  }
  current.value = current.value + 1;
}

// 当前页改变
function pageChange(item: number): void {
  current.value = item;
}

// 监听当前页改变
watch(
  () => current.value,
  () => {
    changePage();
  }
);

// 处理当前页改变
function changePage(): void {
  emits('onChange', current.value);
  pageList.value = [];

  // 当前页 = 显示页数，并且是最后一页
  if (current.value === displayPage.value && totalPage.value === displayPage.value) {
    for (let i = 1; i <= totalPage.value; i++) {
      if (i <= displayPage.value) {
        pageList.value.push(i);
      }
    }
    return;
  }

  // 当前页 >= 显示页数
  if (current.value >= displayPage.value) {
    prevDot.value = true;
    nextDot.value = true;

    // 剩余页数 > 4
    if (totalPage.value - current.value > 4) {
      for (let i = current.value - 3; i <= current.value + 3; i++) {
        pageList.value.push(i);
      }
    }
    // 剩余页数 <= 4
    if (totalPage.value - current.value <= 4) {
      nextDot.value = false;
      for (let i = totalPage.value - displayPage.value + 1; i <= totalPage.value; i++) {
        pageList.value.push(i);
      }
    }
    return;
  }

  // 当前页 < 显示页数
  prevDot.value = false;
  init();
}
</script>

<style lang="less" scoped>
@import url('./page.less');
</style>
