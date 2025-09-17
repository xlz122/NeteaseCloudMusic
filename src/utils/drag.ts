/**
 * @description 自定义指令 - 弹框拖拽
 */
export const drag = {
  beforeMount: (el: HTMLElement, _binding: unknown, vnode: { el: HTMLElement }): void => {
    const vnodeEl = vnode.el;

    el.onmousedown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 标题栏移动
      if (target.className === 'dialog-title') {
        // (clientX, clientY)点击位置距离当前可视区域的坐标(x, y)
        // offsetLeft、offsetTop 距离上层或父级的左边距和上边距

        // 获取鼠标在弹窗中的位置
        const mouseX = event.clientX - vnodeEl.offsetLeft;
        const mouseY = event.clientY - vnodeEl.offsetTop;

        // 绑定移动和停止函数
        document.onmousemove = (event) => {
          // 获取新的鼠标位置(event.clientX, event.clientY)
          // 弹窗应该在的位置(left, top)
          let left = event.clientX - mouseX;
          let top = event.clientY - mouseY;

          // offsetWidth、offsetHeight 当前元素的宽度
          // innerWidth、innerHeight 浏览器可视区的宽度和高度

          // 获取弹窗在页面中距X轴的最小、最大 位置
          const minX = -vnodeEl.offsetWidth / 2 + 100;
          const maxX = window.innerWidth + vnodeEl.offsetWidth / 2 - 100;
          if (left <= minX) {
            left = minX;
          } else if (left >= maxX) {
            left = maxX;
          }

          // 获取弹窗在页面中距Y轴的最小、最大位置
          const minY = vnodeEl.offsetHeight / 2;
          const maxY = window.innerHeight + vnodeEl.offsetHeight / 2 - 100;
          if (top <= minY) {
            top = minY;
          } else if (top >= maxY) {
            top = maxY;
          }

          // 赋值移动
          vnodeEl.style.left = left + 'px';
          vnodeEl.style.top = top + 'px';
        };
        document.onmouseup = () => {
          document.onmousemove = document.onmouseup = null;
        };
      }
    };
    window.onresize = () => {
      vnodeEl.style.left = '50%';
      vnodeEl.style.top = '50%';
    };
  }
};
