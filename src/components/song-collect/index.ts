import { AppContext, createVNode, render } from 'vue';
import Component from './SongCollect.vue';

const SongCollect = {
  install: (app: { _context: AppContext | null }): void => {
    // 创建虚拟dom
    const vm = createVNode(Component, {});

    // 关联数据
    vm.appContext = app._context;

    // 挂载
    const element = document.getElementById('songCollect') as HTMLDivElement;
    render(vm, element);
  }
};

export default SongCollect;
