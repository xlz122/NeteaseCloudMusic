import { createVNode, render } from 'vue';
import type { AppContext } from 'vue';
import Component from './AudioPlayer.vue';

const AudioPlayer = {
  install: (app: { _context: AppContext | null }): void => {
    const vm = createVNode(Component, {});

    // 关联数据
    vm.appContext = app._context;

    // 挂载
    const element = document.getElementById('audioPlayer')!;
    render(vm, element);
  }
};

export default AudioPlayer;
