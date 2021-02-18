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
        component: () => import(/* webpackChunkName: "musician" */ '../Bug.vue')
      },
      {
        path: '/download',
        name: 'download',
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/download/Download.vue'
          )
      },
      // 创作者中心
      {
        path: '/creator-center',
        name: 'creator-center',
        component: () =>
          import(
            /* webpackChunkName: "creator-center" */ '../views/header/creator-center/CreatorCenter.vue'
          )
        // component: () => {
        //   // 判断路由是否存在
        //   if (location.href.includes(process.env.BASE_URL)) {
        //     return window.open(
        //       `${location.origin}${process.env.BASE_URL}/creator-center`,
        //       '_blank'
        //     );
        //   }
        //   return window.open(`${location.origin}/creator-center`, '_blank');
        // }
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
