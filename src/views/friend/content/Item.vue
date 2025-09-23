<template>
  <!-- 歌单 -->
  <template v-if="item.type === 13">
    <div class="cover" @click="jumpUserProfile(item.user?.userId)">
      <img class="img" :src="`${item.user?.avatarUrl}?param=45y45`" alt="" />
    </div>
    <div class="info">
      <div class="info-title">
        <span class="t-text" @click="jumpUserProfile(item.user?.userId)">
          {{ item.user?.nickname }}
        </span>
        <i class=""></i>
        <span class="t-desc">分享歌单</span>
      </div>
      <div class="time">{{ formatDate(item.showTime) }}</div>
      <p class="mood" v-html="item.json?.msg"></p>
      <div class="music-info">
        <div class="music-cover">
          <img class="cover-img" :src="`${item.json?.playlist?.coverImgUrl}?param=40y40`" alt="" />
          <i class="play-icon"></i>
        </div>
        <div class="music-detail">
          <h3 class="music-detail-title">
            {{ item.json?.playlist?.name }}
          </h3>
          <h4 class="music-detail-name">by {{ item.json?.playlist?.creator?.nickname }}</h4>
        </div>
      </div>
      <div class="operate">
        <span class="operate-btn">
          <i
            class="operate-btn-icon operate-btn-active-icon"
            v-if="item.info?.liked"
            @click="setDynamicLike(item.id, item.info?.threadId, 0)"
          ></i>
          <i
            class="operate-btn-icon"
            v-else
            @click="setDynamicLike(item.id, item.info?.threadId, 1)"
          ></i>
          <span v-if="item.info?.likedCount > 0" class="operate-btn-text">
            ({{ item.info?.likedCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">转发</span>
          <span class="operate-btn-text" v-if="item.insiteForwardCount > 0">
            ({{ item.insiteForwardCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">评论</span>
          <span class="operate-btn-text" v-if="item.info?.commentThread?.commentCount > 0">
            ({{ item.info?.commentThread?.commentCount }})
          </span>
        </span>
      </div>
    </div>
  </template>
  <!-- 电台节目 -->
  <template v-if="item.type === 17">
    <div class="cover" @click="jumpUserProfile(item.user?.userId)">
      <img class="img" :src="`${item.user?.avatarUrl}?param=45y45`" alt="" />
    </div>
    <div class="info">
      <div class="info-title">
        <span class="t-text" @click="jumpUserProfile(item.user?.userId)">
          {{ item.user?.nickname }}
        </span>
        <i class="t-icon program"></i>
        <span class="t-desc">分享节目</span>
      </div>
      <div class="time">{{ formatDate(item.showTime) }}</div>
      <p class="mood" v-html="item.json?.msg"></p>
      <div class="music-info">
        <div class="music-cover">
          <img class="cover-img" :src="`${item.json?.program?.radio?.picUrl}?param=40y40`" alt="" />
          <i class="play-icon"></i>
        </div>
        <div class="music-detail">
          <h3 class="music-detail-title">{{ item.json?.program?.name }}</h3>
          <h4 class="music-detail-name">
            <span class="program-tag">
              <i class="program-tag-icon"></i>
              {{ item.json?.program?.radio?.category }}
            </span>
            {{ item.json?.program?.radio?.name }}
          </h4>
        </div>
      </div>
      <div class="operate">
        <span class="operate-btn">
          <i
            class="operate-btn-icon operate-btn-active-icon"
            v-if="item.info?.liked"
            @click="setDynamicLike(item.id, item.info?.threadId, 0)"
          ></i>
          <i
            class="operate-btn-icon"
            v-else
            @click="setDynamicLike(item.id, item.info?.threadId, 1)"
          ></i>
          <span v-if="item.info?.likedCount > 0" class="operate-btn-text">
            ({{ item.info?.likedCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">转发</span>
          <span class="operate-btn-text" v-if="item.insiteForwardCount > 0">
            ({{ item.insiteForwardCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">评论</span>
          <span class="operate-btn-text" v-if="item.info?.commentThread?.commentCount > 0">
            ({{ item.info?.commentThread?.commentCount }})
          </span>
        </span>
      </div>
    </div>
  </template>
  <!-- 单曲、电台 -->
  <template v-if="item.type === 18">
    <div class="cover" @click="jumpUserProfile(item.user?.userId)">
      <img class="img" :src="`${item.user?.avatarUrl}?param=45y45`" alt="" />
    </div>
    <div class="info">
      <div class="info-title">
        <span class="t-text" @click="jumpUserProfile(item.user?.userId)">
          {{ item.user?.nickname }}
        </span>
        <i class="t-icon"></i>
        <span class="t-desc">分享单曲</span>
      </div>
      <div class="time">{{ formatDate(item.showTime) }}</div>
      <p class="mood" v-html="item.json?.msg"></p>
      <div class="music-info">
        <div class="music-cover" @click="playSingleSong(item.json?.song)">
          <img class="cover-img" :src="`${item.json?.song?.album?.picUrl}?param=40y40`" alt="" />
          <i class="play-icon"></i>
        </div>
        <div class="music-detail">
          <h3 class="music-detail-title" @click="jumpSongDetail(item.json?.song?.id)">
            {{ item.json?.song?.name }}
          </h3>
          <h4 class="music-detail-name" @click="jumpSingerDetail(item.json?.song?.artists[0]?.id)">
            {{ item.json?.song?.artists?.[0]?.name }}
          </h4>
        </div>
      </div>
      <div class="operate">
        <span class="operate-btn">
          <i
            class="operate-btn-icon operate-btn-active-icon"
            v-if="item.info?.liked"
            @click="setDynamicLike(item.id, item.info?.threadId, 0)"
          ></i>
          <i
            class="operate-btn-icon"
            v-else
            @click="setDynamicLike(item.id, item.info?.threadId, 1)"
          ></i>
          <span v-if="item.info?.likedCount > 0" class="operate-btn-text">
            ({{ item.info?.likedCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">转发</span>
          <span class="operate-btn-text" v-if="item.insiteForwardCount > 0">
            ({{ item.insiteForwardCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">评论</span>
          <span class="operate-btn-text" v-if="item.info?.commentThread?.commentCount > 0">
            ({{ item.info?.commentThread?.commentCount }})
          </span>
        </span>
      </div>
    </div>
  </template>
  <!-- 专辑 -->
  <template v-if="item.type === 19">
    <div class="cover" @click="jumpUserProfile(item.user?.userId)">
      <img class="img" :src="`${item.user?.avatarUrl}?param=45y45`" alt="" />
    </div>
    <div class="info">
      <div class="info-title">
        <span class="t-text" @click="jumpUserProfile(item.user?.userId)">
          {{ item.user?.nickname }}
        </span>
        <i class="t-icon"></i>
        <span class="t-desc">分享专辑</span>
      </div>
      <div class="time">{{ formatDate(item.showTime) }}</div>
      <p class="mood" v-html="item.json?.msg"></p>
      <div class="music-info">
        <div class="music-cover cover-album">
          <img class="cover-img" :src="`${item.json?.album?.picUrl}?param=40y40`" alt="" />
          <i class="play-icon"></i>
        </div>
        <div class="music-detail">
          <span class="music-detail-datg">专辑</span>
          <h3 class="music-detail-title" @click="jumpAlbumDetail(item.json?.album?.id)">
            {{ item.json?.album?.name }}
          </h3>
          <h4 class="music-detail-name" @click="jumpSingerDetail(item.json?.album?.artist?.id)">
            {{ item.json?.album?.artist?.name }}
          </h4>
        </div>
      </div>
      <div class="operate">
        <span class="operate-btn">
          <i
            class="operate-btn-icon operate-btn-active-icon"
            v-if="item.info?.liked"
            @click="setDynamicLike(item.id, item.info?.threadId, 0)"
          ></i>
          <i
            class="operate-btn-icon"
            v-else
            @click="setDynamicLike(item.id, item.info?.threadId, 1)"
          ></i>
          <span v-if="item.info?.likedCount > 0" class="operate-btn-text">
            ({{ item.info?.likedCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">转发</span>
          <span class="operate-btn-text" v-if="item.insiteForwardCount > 0">
            ({{ item.insiteForwardCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">评论</span>
          <span class="operate-btn-text" v-if="item.info?.commentThread?.commentCount > 0">
            ({{ item.info?.commentThread?.commentCount }})
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
      <img class="topic-img" :src="item.json?.coverPCListUrl" />
      <span class="topic-img-mask"></span>
      <div class="topic-content">
        <h3 class="topic-content-title">#{{ item.json?.title }}#</h3>
        <span class="participate-count"> {{ item.json?.participateCount }}人参与 </span>
      </div>
      <i class="topic-close"></i>
    </div>
  </template>
  <!-- 文案 -->
  <template v-if="item.type === 35">
    <div class="cover" @click="jumpUserProfile(item.user?.userId)">
      <img class="img" :src="`${item.user?.avatarUrl}?param=45y45`" alt="" />
    </div>
    <div class="info">
      <div class="info-title">
        <span class="t-text" @click="jumpUserProfile(item.user?.userId)">
          {{ item.user?.nickname }}
        </span>
        <i class="t-icon copywriting"></i>
        <span class="t-desc"></span>
      </div>
      <div class="time">{{ formatDate(item.showTime) }}</div>
      <p class="mood" v-html="item.json?.msg"></p>
      <div class="operate">
        <span class="operate-btn">
          <i
            class="operate-btn-icon operate-btn-active-icon"
            v-if="item.info?.liked"
            @click="setDynamicLike(item.id, item.info?.threadId, 0)"
          ></i>
          <i
            class="operate-btn-icon"
            v-else
            @click="setDynamicLike(item.id, item.info?.threadId, 1)"
          ></i>
          <span v-if="item.info?.likedCount > 0" class="operate-btn-text">
            ({{ item.info?.likedCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">转发</span>
          <span class="operate-btn-text" v-if="item.insiteForwardCount > 0">
            ({{ item.insiteForwardCount }})
          </span>
        </span>
        <span class="operate-line">|</span>
        <span class="operate-btn">
          <span class="operate-btn-text">评论</span>
          <span class="operate-btn-text" v-if="item.info?.commentThread?.commentCount > 0">
            ({{ item.info?.commentThread?.commentCount }})
          </span>
        </span>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';

defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits([
  'playSingleSong',
  'setDynamicLike',
  'jumpUserProfile',
  'jumpSongDetail',
  'jumpSingerDetail',
  'jumpAlbumDetail'
]);

function playSingleSong(item: SongType): void {
  emits('playSingleSong', item);
}

function setDynamicLike(id: number, threadId: number, type: number): void {
  emits('setDynamicLike', id, threadId, type);
}

function jumpUserProfile(userId: number): void {
  emits('jumpUserProfile', userId);
}

function jumpSongDetail(id: number): void {
  emits('jumpSongDetail', id);
}

function jumpSingerDetail(id: number): void {
  emits('jumpSingerDetail', id);
}

function jumpAlbumDetail(id: number): void {
  emits('jumpAlbumDetail', id);
}
</script>

<style lang="less" scoped>
@import url('./item.less');
</style>
