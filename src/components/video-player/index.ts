import { createVNode, render } from 'vue';
import VideoPlayerComponent from './VideoPlayer.vue';

const VideoPlayer = {
  install: (app: Record<string, any>): void => {
    // 创建虚拟dom
    const vm = createVNode(VideoPlayerComponent, {});

    // 关联数据
    vm.appContext = app._context;

    const videoPlayer = document.getElementById('video-palyer') as HTMLElement;

    // 容器挂载
    render(vm, videoPlayer);
  }
};

export default VideoPlayer;
