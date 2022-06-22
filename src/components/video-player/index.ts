import { AppContext, createVNode, render } from 'vue';
import VideoPlayerComponent from './VideoPlayer.vue';

const VideoPlayer = {
  install: (app: { _context: AppContext | null }): void => {
    // 创建虚拟dom
    const vm = createVNode(VideoPlayerComponent, {});

    // 关联数据
    vm.appContext = app._context;

    const element = document.getElementById('video-palyer') as HTMLDivElement;

    // 挂载
    render(vm, element);
  }
};

export default VideoPlayer;
