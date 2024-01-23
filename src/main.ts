import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store/index';
import audioPlayer from '@/components/audio-player/index';
import message from '@/components/message/index';
import loginDialog from '@/components/login-dialog/index';
import songCollect from '@/components/song-collect/index';
import copyrightDialog from '@/components/copyright-dialog/index';
import verifyDialog from '@/components/verify-dialog/index';
import '@/index.less';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(audioPlayer);
app.use(message);
app.use(loginDialog);
app.use(songCollect);
app.use(copyrightDialog);
app.use(verifyDialog);
app.mount('#app');
