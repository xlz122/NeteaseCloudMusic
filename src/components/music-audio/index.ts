import { AppContext, createVNode, render } from 'vue';
import Component from './MusicAudio.vue';

const MusicAudio = {
  install: (app: { _context: AppContext | null }): void => {
    // 创建虚拟dom
    const vm = createVNode(Component, {});

    // 关联数据
    vm.appContext = app._context;

    // 挂载
    const element = document.getElementById('musicAudio') as HTMLDivElement;
    render(vm, element);
  }
};

export default MusicAudio;
