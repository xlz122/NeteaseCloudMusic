import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('../views/home/Home.vue')
      },
      {
        path: '/my-music',
        name: 'my-music',
        component: () => import('../views/my-music/MyMusic.vue')
      },
      {
        path: '/friend',
        name: 'friend',
        component: () => import('../views/friend/Friend.vue')
      },
      {
        path: '/shopping-mall',
        name: 'shopping-mall',
        component: () => import('../views/shopping-mall/ShoppingMall.vue')
      },
      {
        path: '/musician',
        name: 'musician',
        component: () => import('../views/musician/Musician.vue')
      },
      {
        path: '/download',
        name: 'download',
        component: () => import('../views/download/Download.vue')
      },
      {
        path: '/my-home-page',
        component: () => import('../views/my-home-page/MyHomePage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
