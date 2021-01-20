import { createApp, h } from 'vue';
import MusicAudioComponent from './MusicAudio.vue';

const MusicAudio = {
  install: () => {
    // 创建
    const app = createApp({
      render() {
        return h(MusicAudioComponent);
      }
    });

    // 容器挂载
    app.mount('#musicAudio');
  }
}

export default MusicAudio;
