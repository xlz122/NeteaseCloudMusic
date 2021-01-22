import { render, createVNode } from 'vue';
import MusicAudioComponent from './MusicAudio.vue';

const MusicAudio = {
  install: (app: Record<string, any>) => {
    // 创建虚拟dom
    const vm = createVNode(MusicAudioComponent, {});

    // 这句很关键，关联数据
    vm.appContext = app._context;

    const musicAudio = document.getElementById('musicAudio') as HTMLElement;

    // 容器挂载
    render(vm, musicAudio);
  }
};

export default MusicAudio;
