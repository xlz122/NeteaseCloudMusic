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
        component: () =>
          import(
            /* webpackChunkName: "my-music" */ '../views/my-music/MyMusic.vue'
          )
      },
      {
        path: '/friend',
        name: 'friend',
        component: () =>
          import(/* webpackChunkName: "friend" */ '../views/friend/Friend.vue')
      },
      {
        path: '/shopping-mall',
        name: 'shopping-mall',
        component: () =>
          import(
            /* webpackChunkName: "shopping-mall" */ '../views/shopping-mall/ShoppingMall.vue'
          )
      },
      {
        path: '/musician',
        name: 'musician',
        component: () =>
          import(
            /* webpackChunkName: "musician" */ '../views/musician/Musician.vue'
          )
      },
      {
        path: '/download',
        name: 'download',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/download/Download.vue'
          )
      },
      {
        path: '/my-home-page',
        name: 'my-home-page',
        component: () =>
          import(
            /* webpackChunkName: "my-home-page" */ '../views/my-home-page/MyHomePage.vue'
          )
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
