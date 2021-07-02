<template>
  <div class="content">
    <div class="title">
      <span class="text">动态</span>
      <span
        class="title-btn dynamic"
        title="发动态"
        @click="releaseDynamic"
      ></span>
      <span
        class="title-btn video"
        title="发布视频"
        @click="releaseVideo"
      ></span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in eventList" :key="index">
        <!-- 单曲 电台 -->
        <template v-if="item.type === 18">
          <div class="cover">
            <img
              class="img"
              :src="`${item?.user?.avatarUrl}?param=45y45`"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-title">
              <span class="t-text">{{ item?.user?.nickname }}</span>
              <i class="t-icon"></i>
              <span class="t-desc">分享单曲</span>
            </div>
            <div class="time">{{ formatDate(item?.showTime) }}</div>
            <div class="mood" v-html="item?.json?.msg"></div>
            <div class="music-info">
              <div class="music-cover">
                <img
                  class="cover-img"
                  :src="`${item?.json?.song?.album?.picUrl}?param=40y40`"
                  alt=""
                />
                <i class="play-icon"></i>
              </div>
              <div class="music-detail">
                <h3 class="music-detail-title">{{ item?.json?.song?.name }}</h3>
                <h4 class="music-detail-name">
                  {{ item?.json?.song?.artists[0].name }}
                </h4>
              </div>
            </div>
            <div class="operate">
              <span class="operate-btn">
                <i
                  class="operate-btn-icon operate-btn-active-icon"
                  v-if="item?.info?.liked"
                  @click="setDynamicLike(item.id, item.info.threadId, 0)"
                ></i>
                <i
                  class="operate-btn-icon"
                  v-else
                  @click="setDynamicLike(item.id, item.info.threadId, 1)"
                ></i>
                <span
                  v-if="item?.info?.likedCount > 0"
                  class="operate-btn-text"
                >
                  ({{ item?.info?.likedCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">转发</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.insiteForwardCount > 0"
                >
                  ({{ item?.insiteForwardCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">评论</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.info?.commentThread?.commentCount > 0"
                >
                  ({{ item?.info?.commentThread?.commentCount }})
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 专辑 -->
        <template v-if="item.type === 19">
          <div class="cover">
            <img
              class="img"
              :src="`${item?.user?.avatarUrl}?param=45y45`"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-title">
              <span class="t-text">{{ item?.user?.nickname }}</span>
              <i class="t-icon"></i>
              <span class="t-desc">分享专辑</span>
            </div>
            <div class="time">{{ formatDate(item?.showTime) }}</div>
            <div class="mood" v-html="item?.json?.msg"></div>
            <div class="music-info">
              <div class="music-cover">
                <img
                  class="cover-img"
                  :src="`${item?.json?.album?.picUrl}?param=40y40`"
                  alt=""
                />
                <i class="play-icon"></i>
              </div>
              <div class="music-detail">
                <h3 class="music-detail-title">
                  {{ item?.json?.album?.name }}
                </h3>
                <h4 class="music-detail-name">
                  {{ item?.json?.album?.artist?.name }}
                </h4>
              </div>
            </div>
            <div class="operate">
              <span class="operate-btn">
                <i
                  class="operate-btn-icon operate-btn-active-icon"
                  v-if="item?.info?.liked"
                  @click="setDynamicLike(item.id, item.info.threadId, 0)"
                ></i>
                <i
                  class="operate-btn-icon"
                  v-else
                  @click="setDynamicLike(item.id, item.info.threadId, 1)"
                ></i>
                <span
                  v-if="item?.info?.likedCount > 0"
                  class="operate-btn-text"
                >
                  ({{ item?.info?.likedCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">转发</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.insiteForwardCount > 0"
                >
                  ({{ item?.insiteForwardCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">评论</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.info?.commentThread?.commentCount > 0"
                >
                  ({{ item?.info?.commentThread?.commentCount }})
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 歌单 -->
        <template v-if="item.type === 13">
          <div class="cover">
            <img
              class="img"
              :src="`${item?.user?.avatarUrl}?param=45y45`"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-title">
              <span class="t-text">{{ item?.user?.nickname }}</span>
              <i class=""></i>
              <span class="t-desc">分享歌单</span>
            </div>
            <div class="time">{{ formatDate(item?.showTime) }}</div>
            <div class="mood" v-html="item?.json?.msg"></div>
            <div class="music-info">
              <div class="music-cover">
                <img
                  class="cover-img"
                  :src="`${item?.json?.playlist?.coverImgUrl}?param=40y40`"
                  alt=""
                />
                <i class="play-icon"></i>
              </div>
              <div class="music-detail">
                <h3 class="music-detail-title">
                  {{ item?.json?.playlist?.name }}
                </h3>
                <h4 class="music-detail-name">
                  by {{ item?.json?.playlist?.creator?.nickname }}
                </h4>
              </div>
            </div>
            <div class="operate">
              <span class="operate-btn">
                <i
                  class="operate-btn-icon operate-btn-active-icon"
                  v-if="item?.info?.liked"
                  @click="setDynamicLike(item.id, item.info.threadId, 0)"
                ></i>
                <i
                  class="operate-btn-icon"
                  v-else
                  @click="setDynamicLike(item.id, item.info.threadId, 1)"
                ></i>
                <span
                  v-if="item?.info?.likedCount > 0"
                  class="operate-btn-text"
                >
                  ({{ item?.info?.likedCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">转发</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.insiteForwardCount > 0"
                >
                  ({{ item?.insiteForwardCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">评论</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.info?.commentThread?.commentCount > 0"
                >
                  ({{ item?.info?.commentThread?.commentCount }})
                </span>
              </span>
            </div>
          </div>
        </template>
        <!-- 话题 -->
        <template v-if="item.type === 33">
          <div class="cover">
            <span class="img"></span>
          </div>
          <div class="topic">
            <img class="topic-img" :src="item?.json?.coverPCListUrl" />
            <span class="topic-img-mask"></span>
            <div class="topic-content">
              <h3 class="topic-content-title">#{{ item?.json?.title }}#</h3>
              <span class="participate-count">
                {{ item?.json?.participateCount }}人参与
              </span>
            </div>
            <i class="topic-close"></i>
          </div>
        </template>
        <!-- 文案 -->
        <template v-if="item.type === 35">
          <div class="cover">
            <img
              class="img"
              :src="`${item?.user?.avatarUrl}?param=45y45`"
              alt=""
            />
          </div>
          <div class="info">
            <div class="info-title">
              <span class="t-text">{{ item?.user?.nickname }}</span>
              <i class="t-icon copywriting"></i>
              <span class="t-desc"></span>
            </div>
            <div class="time">{{ formatDate(item?.showTime) }}</div>
            <div class="mood" v-html="item?.json?.msg"></div>
            <div class="operate">
              <span class="operate-btn">
                <i
                  class="operate-btn-icon operate-btn-active-icon"
                  v-if="item?.info?.liked"
                  @click="setDynamicLike(item.id, item.info.threadId, 0)"
                ></i>
                <i
                  class="operate-btn-icon"
                  v-else
                  @click="setDynamicLike(item.id, item.info.threadId, 1)"
                ></i>
                <span
                  v-if="item?.info?.likedCount > 0"
                  class="operate-btn-text"
                >
                  ({{ item?.info?.likedCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">转发</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.insiteForwardCount > 0"
                >
                  ({{ item?.insiteForwardCount }})
                </span>
              </span>
              <span class="operate-line">|</span>
              <span class="operate-btn">
                <span class="operate-btn-text">评论</span>
                <span
                  class="operate-btn-text"
                  v-if="item?.info?.commentThread?.commentCount > 0"
                >
                  ({{ item?.info?.commentThread?.commentCount }})
                </span>
              </span>
            </div>
          </div>
        </template>
      </li>
    </ul>
    <!-- loading -->
    <div class="loading" v-if="!lock">
      <i class="loading-icon"></i>
      加载中...
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { friendEvent, dynamicLike, FirendEvent } from '@api/friend';
import { LoopType, ResponseType } from '@/types/types';
import { formatDate, getPageBottomHeight } from '@utils/utils';
import { formatMixedText } from '@utils/formatMixedText';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 发动态
    function releaseDynamic(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 发布视频
    function releaseVideo(): void {
      window.open(
        'https://music.163.com/st/creator/upload/video?from=%2Ffriend#/',
        '_blank'
      );
    }

    // 是否继续加载
    const lock = ref<boolean>(true);
    // 动态列表参数
    const firendEventParams = reactive<FirendEvent>({
      pagesize: 20,
      lasttime: -1
    });

    // 列表数据
    const eventList = ref<LoopType[]>([]);
    // 获取动态列表数据
    function getFriendEvent(): void {
      friendEvent({ ...firendEventParams })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // json字符串转为对象
            res.event.forEach((item: LoopType) => {
              item.json = JSON.parse(item.json);
              // 单曲 电台，处理混合文本
              if (item.type === 18) {
                item.json.msg = formatMixedText(item.json.msg);
              }
            });
            eventList.value = eventList.value.concat(res.event);
            // 下一页所需参数
            firendEventParams.lasttime = res.lasttime;
            // 返回条数少于每页条数，不再加载
            if (res.event.length < firendEventParams.pagesize) {
              lock.value = false;
              return false;
            }
            // 继续加载
            lock.value = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    getFriendEvent();

    // 动态点赞
    function setDynamicLike(id: number, threadId: number, type: number): void {
      // 页面静态修改
      const likeIndex = eventList.value.findIndex(
        (item: LoopType) => item.id === id
      );
      if (type === 0) {
        eventList.value[likeIndex].info.liked = false;
        eventList.value[likeIndex].info.likedCount--;
      } else {
        eventList.value[likeIndex].info.liked = true;
        eventList.value[likeIndex].info.likedCount++;
      }
      // 接口修改
      dynamicLike({
        cid: id,
        threadId,
        t: type
      });
    }

    // 监听滚动
    onMounted(() => {
      document.addEventListener('scroll', function (e: Event): void {
        const bottomHeight = getPageBottomHeight(e);
        // 并非第一次加载 距离底部高度 是否可请求
        if (eventList.value.length > 0 && bottomHeight <= 400 && lock.value) {
          lock.value = false;
          getFriendEvent();
        }
      });
    });

    onUnmounted(() => {
      document.removeEventListener('scroll', function (): void {
        console.log('friend/Content.vue 滚动事件移除');
      });
    });
    return {
      formatDate,
      releaseDynamic,
      releaseVideo,
      eventList,
      lock,
      setDynamicLike
    };
  }
});
</script>

<style lang="less" scoped>
@import './content.less';
</style>
