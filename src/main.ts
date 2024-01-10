import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store/index';
import login from '@/components/login/index';
import musicAudio from '@/components/music-audio/index';
import message from '@/components/message/index';
import songCollect from '@/components/song-collect/index';
import copyright from '@/components/copyright/index';
import verify from '@/components/verify-modal/index';
import '@/index.less';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(login);
app.use(musicAudio);
app.use(message);
app.use(songCollect);
app.use(copyright);
app.use(verify);
app.mount('#app');
