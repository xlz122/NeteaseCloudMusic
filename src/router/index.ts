import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        meta: {
          keepAlive: true
        },
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
        path: '/download',
        name: 'download',
        meta: {
          keepAlive: true
        },
        component: () =>
          import(
            /* webpackChunkName: "download" */ '../views/download/Download.vue'
          )
      },
      // 搜索
      {
        path: '/search-details',
        name: 'search-details',
        component: () =>
          import(
            /* webpackChunkName: "search-details" */ '../views/search-details/SearchDetails.vue'
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
      },
      // 个人中心 - 我的主页
      {
        path: '/my-home-page',
        name: 'user-my-home-page',
        component: () =>
          import(
            /* webpackChunkName: "my-home-page" */ '../views/user/my-home-page/MyHomePage.vue'
          )
      },
      // 个人中心 - 我的等级
      {
        path: '/level',
        name: 'user-level',
        component: () =>
          import(
            /* webpackChunkName: "user-level" */ '../views/user/level/Level.vue'
          )
      },
      // 首页 - 排行榜
      {
        path: '/home-toplist',
        name: 'home-toplist',
        component: () =>
          import(
            /* webpackChunkName: "home-toplist" */ '../views/home-toplist/HomeToplist.vue'
          )
      },
      // 首页 - 歌单
      {
        path: '/home-song-sheet',
        name: 'home-song-sheet',
        component: () =>
          import(
            /* webpackChunkName: "home-song-sheet" */ '../views/home-song-sheet/HomeSongSheet.vue'
          )
      },
      // 首页 - 歌手
      {
        path: '/home-singer',
        name: 'home-singer',
        component: () =>
          import(
            /* webpackChunkName: "home-singer" */ '../views/home-singer/HomeSinger.vue'
          )
      },
      // 首页 - 新碟上架
      {
        path: '/home-new-disc',
        name: 'home-new-disc',
        component: () =>
          import(
            /* webpackChunkName: "home-newDisc" */ '../views/home-new-disc/HomeNewDisc.vue'
          )
      }
    ]
  },
  // 未匹配的路径名称导航到该路径
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () =>
      import(
        /* webpackChunkName: "not-found" */ '../views/not-found/NotFound.vue'
      )
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
