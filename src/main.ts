import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@router/index';
import store from '@store/index';
import login from '@components/login/index';
import musicAudio from '@components/music-audio/index';
import message from '@components/message/index';
import '@/index.less';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(login);
app.use(musicAudio);
app.use(message);
app.mount('#app');
