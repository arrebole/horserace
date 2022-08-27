import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/Home.vue';
import Team from './views/Team.vue';


createApp(App)
  .use(createPinia())
  .use(createRouter({
    history: createWebHashHistory(),
    routes: [
      { name: 'home', path: '/', component: Home },
      { name: 'team', path: '/team', component: Team },
    ]
  }))
  .mount('#app');
