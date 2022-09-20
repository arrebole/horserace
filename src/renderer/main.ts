import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/Home.vue';
import Game from './views/Game.vue';
import Select from './views/Select.vue';


createApp(App)
  .use(createPinia())
  .use(createRouter({
    history: createWebHashHistory(),
    routes: [
      { name: 'home', path: '/', component: Home },
      { name: 'select', path: '/select', component: Select },
      { name: 'game', path: '/game', component: Game },
    ]
  }))
  .mount('#app');
