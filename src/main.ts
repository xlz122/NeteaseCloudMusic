import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import audioPlayer from '@/components/audio-player';
import message from '@/components/message';
import loginDialog from '@/components/login-dialog';
import songCollect from '@/components/song-collect';
import copyrightDialog from '@/components/copyright-dialog';
import verifyDialog from '@/components/verify-dialog';
import '@/index.css';

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
