import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/Main.vue'),
    children: [
      {
        path: '/',
        name: 'home',
        // meta: {
        //   keepAlive: true
        // },
        component: () => import('../views/home/Home.vue')
      },
      {
        path: '/my-music',
        name: 'my-music',
        component: () => import(/* webpackChunkName: "my-music" */ '../views/my-music/MyMusic.vue')
      },
      {
        path: '/friend',
        name: 'friend',
        component: () => import(/* webpackChunkName: "friend" */ '../views/friend/Friend.vue')
      },
      {
        path: '/download',
        name: 'download',
        component: () => import(/* webpackChunkName: "download" */ '../views/download/Download.vue')
      },
      {
        path: '/creator-center',
        name: 'creator-center',
        component: () =>
          import(
            /* webpackChunkName: "creator-center" */ '../views/header/creator-center/CreatorCenter.vue'
          )
      },
      {
        path: '/home-recommend',
        name: 'home-recommend',
        component: () =>
          import(
            /* webpackChunkName: "home-recommend" */ '../views/home-recommend/HomeRecommend.vue'
          )
      },
      {
        path: '/home-toplist',
        name: 'home-toplist',
        component: () =>
          import(/* webpackChunkName: "home-toplist" */ '../views/home-toplist/HomeToplist.vue')
      },
      {
        path: '/home-song-sheet',
        name: 'home-song-sheet',
        component: () =>
          import(
            /* webpackChunkName: "home-song-sheet" */ '../views/home-song-sheet/HomeSongSheet.vue'
          )
      },
      {
        path: '/home-djprogram',
        name: 'home-djprogram',
        component: () =>
          import(
            /* webpackChunkName: "home-djprogram" */ '../views/home-djprogram/HomeDjprogram.vue'
          )
      },
      {
        path: '/home-singer',
        name: 'home-singer',
        component: () =>
          import(/* webpackChunkName: "home-singer" */ '../views/home-singer/HomeSinger.vue')
      },
      {
        path: '/home-album',
        name: 'home-album',
        component: () =>
          import(/* webpackChunkName: "home-album" */ '../views/home-album/HomeAlbum.vue')
      },
      {
        path: '/song-detail',
        name: 'song-detail',
        component: () =>
          import(/* webpackChunkName: "song-detail" */ '../views/song-detail/SongDetail.vue')
      },
      {
        path: '/song-sheet-detail',
        name: 'song-sheet-detail',
        component: () =>
          import(
            /* webpackChunkName: "song-sheet-detail" */ '../views/song-sheet-detail/SongSheetDetail.vue'
          )
      },
      {
        path: '/djradio-detail',
        name: 'djradio-detail',
        component: () =>
          import(
            /* webpackChunkName: "djradio-detail" */ '../views/djradio-detail/DjradioDetail.vue'
          )
      },
      {
        path: '/program-detail',
        name: 'program-detail',
        component: () =>
          import(
            /* webpackChunkName: "program-detail" */ '../views/program-detail/ProgramDetail.vue'
          )
      },
      {
        path: '/singer-detail',
        name: 'singer-detail',
        component: () =>
          import(/* webpackChunkName: "singer-detail" */ '../views/singer-detail/SingerDetail.vue')
      },
      {
        path: '/album-detail',
        name: 'album-detail',
        component: () =>
          import(/* webpackChunkName: "album-detail" */ '../views/album-detail/AlbumDetail.vue')
      },
      {
        path: '/video-detail',
        name: 'video-detail',
        component: () =>
          import(/* webpackChunkName: "video-detail" */ '../views/video-detail/VideoDetail.vue')
      },
      {
        path: '/mv-detail',
        name: 'mv-detail',
        component: () =>
          import(/* webpackChunkName: "mv-detail" */ '../views/mv-detail/MvDetail.vue')
      },
      {
        path: '/user-profile',
        name: 'user-profile',
        component: () =>
          import(/* webpackChunkName: "user-profile" */ '../views/user-profile/UserProfile.vue')
      },
      {
        path: '/level',
        name: 'level',
        component: () =>
          import(/* webpackChunkName: "user-level" */ '../views/user/level/Level.vue')
      },
      {
        path: '/level-detail',
        name: 'level-detail',
        component: () =>
          import(
            /* webpackChunkName: "level-detail" */ '../views/user/level-detail/LevelDetail.vue'
          )
      },
      {
        path: '/member',
        name: 'member',
        component: () =>
          import(/* webpackChunkName: "user-level" */ '../views/user/member/Member.vue')
      },
      {
        path: '/search-details',
        name: 'search-details',
        component: () =>
          import(
            /* webpackChunkName: "search-details" */ '../views/search-details/SearchDetails.vue'
          )
      }
    ]
  },
  // 未匹配的路径名称导航到该路径
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '../views/not-found/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { left: 0, top: 0 };
  }
});

export default router;
