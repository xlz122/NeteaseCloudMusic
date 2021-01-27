<template>
  <div class="ctx" ref="ctx" @click="handleClick">
    <div class="red"></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'home',
  data() {
    return {
      move: false,
      left: 0,
      num: 0, // 可能用的到的100%比
    };
  },
  methods: {
    handleClick(e) {
      const moveElem = document.querySelector('.red');
      const width = this.$refs.ctx.offsetWidth;
      moveElem.style.left = e.offsetX + 'px';
      this.num = e.offsetX / width;
    },
  },
  mounted() {
    const moveElem = document.querySelector('.red'); //待拖拽元素
    const width = this.$refs.ctx.offsetWidth;
    //监听鼠标按下事件
    document.addEventListener('mousedown', (e) => {
      if (e.target === moveElem) {
        this.move = true; //激活拖拽状态
        var moveElemRect = moveElem.getBoundingClientRect();
        this.left = e.clientX - moveElemRect.left; //鼠标按下时和选中元素的坐标偏移:x坐标
      }
    });
    //监听鼠标放开事件
    document.addEventListener('mouseup', (e) => {
      this.move = false;
      this.num = parseInt(moveElem.style.left) / width;
    });
    //监听鼠标移动事件
    document.addEventListener('mousemove', (e) => {
      if (this.move) {
        let moveX = e.clientX - this.left;
        if (moveX >= width) moveX = width - 10;
        if (moveX <= 0) moveX = 0;
        moveElem.style.left = moveX + 'px';
      }
    });
  },
  watch: {
    num(val) {
      // console.log(val);
    },
  },
};
</script>

<style lang="less">
.ctx {
  min-height: 6px;
  position: relative;
  margin: 6px 6px;
  background-color: #000;
  border-radius: 2px;

  .red {
    position: absolute;
    left: 0;
    top: -3px;
    width: 12px;
    height: 12px;
    background: yellow;
    border: 1px solid red;
    border-radius: 50%;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
