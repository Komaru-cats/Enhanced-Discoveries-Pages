import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

import './assets/global.css';
import './assets/utilities.css';
import './assets/rewards.css';

const app = createApp(App);



app.use(router);
app.mount('#app');