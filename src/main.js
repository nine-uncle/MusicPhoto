import 'normalize.css/normalize.css';
import { createApp } from 'vue';
import App from './App.vue';
import { initMusicAudio } from '@/composables/useMusicPlayer';

import '@/styles/common.css';
import '@/styles/App.scss';

initMusicAudio();

createApp(App).mount('#app');
