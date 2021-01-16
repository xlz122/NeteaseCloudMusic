import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
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
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
