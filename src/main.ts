import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store/index';
import musicAudio from '@components/music-audio/music-audio';
import '@/index.less';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(musicAudio);
app.mount('#app');
