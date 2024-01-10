import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store/index';
import loginDialog from '@/components/login-dialog/index';
import musicAudio from '@/components/music-audio/index';
import message from '@/components/message/index';
import songCollect from '@/components/song-collect/index';
import copyrightDialog from '@/components/copyright-dialog/index';
import verifyDialog from '@/components/verify-dialog/index';
import '@/index.less';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(loginDialog);
app.use(musicAudio);
app.use(message);
app.use(songCollect);
app.use(copyrightDialog);
app.use(verifyDialog);
app.mount('#app');
