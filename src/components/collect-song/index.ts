import { createVNode, render } from 'vue';
import CollectSongComponent from './CollectSong.vue';

const CollectSong = {
  install: (app: Record<string, any>): void => {
    // 创建虚拟dom
    const vm = createVNode(CollectSongComponent, {});

    // 关联数据
    vm.appContext = app._context;

    const collectSong = document.getElementById('collectSong') as HTMLElement;

    // 容器挂载
    render(vm, collectSong);
  }
};

export default CollectSong;
