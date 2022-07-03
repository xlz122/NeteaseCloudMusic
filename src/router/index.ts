import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
        // meta: {
        //   keepAlive: true
        // },
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
      // 个人中心 - 我的等级
      {
        path: '/level',
        name: 'level',
        component: () =>
          import(
            /* webpackChunkName: "user-level" */ '../views/user/level/Level.vue'
          )
      },
      // 个人中心 - 我的等级 - 等级详情
      {
        path: '/level-detail',
        name: 'level-detail',
        component: () =>
          import(
            /* webpackChunkName: "level-detail" */ '../views/user/level/level-detail/LevelDetail.vue'
          )
      },
      // 个人中心 - VIP会员
      {
        path: '/member',
        name: 'member',
        component: () =>
          import(
            /* webpackChunkName: "user-level" */ '../views/user/member/Member.vue'
          )
      },
      // 首页 - 每日推荐
      {
        path: '/home-recommend',
        name: 'home-recommend',
        component: () =>
          import(
            /* webpackChunkName: "home-recommend" */ '../views/home-recommend/HomeRecommend.vue'
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
      // 首页 - 主播电台
      {
        path: '/home-djprogram',
        name: 'home-djprogram',
        component: () =>
          import(
            /* webpackChunkName: "home-djprogram" */ '../views/home-djprogram/HomeDjprogram.vue'
          )
      },
      {
        path: '/home-djDetail',
        name: 'home-djDetail',
        component: () =>
          import(
            '../views/home-djprogram/radioStation/radioDetails/RadioDetails.vue'
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
            /* webpackChunkName: "home-new-disc" */ '../views/home-new-disc/HomeNewDisc.vue'
          )
      },
      // 歌曲详情
      {
        path: '/song-detail',
        name: 'song-detail',
        component: () =>
          import(
            /* webpackChunkName: "song-detail" */ '../views/song-detail/SongDetail.vue'
          )
      },
      // 歌单详情
      {
        path: '/song-sheet-detail',
        name: 'song-sheet-detail',
        component: () =>
          import(
            /* webpackChunkName: "song-sheet-detail" */ '../views/song-sheet-detail/SongSheetDetail.vue'
          )
      },
      // 电台节目详情
      {
        path: '/program-detail',
        name: 'program-detail',
        component: () =>
          import(
            /* webpackChunkName: "program-detail" */ '../views/program-detail/ProgramDetail.vue'
          )
      },
      // 歌手详情
      {
        path: '/singer-detail',
        name: 'singer-detail',
        component: () =>
          import(
            /* webpackChunkName: "singer-detail" */ '../views/singer-detail/SingerDetail.vue'
          )
      },
      // 专辑详情
      {
        path: '/album-detail',
        name: 'album-detail',
        component: () =>
          import(
            /* webpackChunkName: "album-detail" */ '../views/album-detail/AlbumDetail.vue'
          )
      },
      // 用户资料
      {
        path: '/user-profile',
        name: 'user-profile',
        component: () =>
          import(
            /* webpackChunkName: "user-profile" */ '../components/user-profile/UserProfile.vue'
          )
      },
      // 视频详情
      {
        path: '/video-detail',
        name: 'video-detail',
        component: () =>
          import(
            /* webpackChunkName: "video-detail" */ '../views/video-detail/VideoDetail.vue'
          )
      },
      // mv详情
      {
        path: '/mv-detail',
        name: 'mv-detail',
        component: () =>
          import(
            /* webpackChunkName: "mv-detail" */ '../views/mv-detail/MvDetail.vue'
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
