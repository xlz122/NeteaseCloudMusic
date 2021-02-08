<template>
  <div class="album-newest">
    <div class="warp">
      <div class="content">
        <ul class="list" ref="listRef" :style="listStyle">
          <li
            class="item"
            v-for="(item, index) in albumNewestData"
            :key="index"
            ref="liRef"
          >
            <div class="item-img">
              <img class="img" :src="item.picUrl" alt="" />
              <i class="icon"></i>
            </div>
            <div class="title" :title="item?.name">{{ item?.name }}</div>
            <div class="name">{{ item?.artist?.name }}</div>
          </li>
        </ul>
      </div>
      <button class="btn left-btn" @click="albumPrev"></button>
      <button class="btn right-btn" @click="albumNext"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { throttle } from 'lodash';
import { albumNewest } from '@api/home';
import { ResponseType } from '@/types/types';

interface ListOffest {
  index: number;
  transform: number;
  duration: number;
}

export default defineComponent({
  setup() {
    const albumNewestData = ref<unknown[]>([]);
    function getAlbumNewest() {
      albumNewest().then((res: ResponseType) => {
        if (res.code === 200) {
          // 截取前十项，并复制为二倍模板
          albumNewestData.value = res?.albums.slice(0, 10);
          albumNewestData.value.unshift(...albumNewestData.value);
        }
      });
    }
    getAlbumNewest();

    const listRef = ref<HTMLElement>();
    const liRef = ref<HTMLElement>();
    // 列表偏移样式
    const listOffest = reactive<ListOffest>({
      index: 0,
      transform: 0,
      duration: 0
    });

    const listStyle = computed(() => {
      return {
        transform: `translate3d(-${listOffest.transform}px, 0, 0)`,
        transition: `${listOffest.duration}s`
      };
    });

    // 上一轮
    const albumPrev = throttle(
      function() {
        const li = liRef.value as HTMLElement;
        if (listOffest.index == 0) {
          listOffest.index = 2;
          listOffest.duration = 0;
          setTimeout(() => {
            listOffest.index--;
            listOffest.duration = 1.5;
            listOffest.transform = li.clientWidth * listOffest.index * 5;
          });
        } else {
          listOffest.index--;
          listOffest.duration = 1.5;
        }
        listOffest.transform = li.clientWidth * listOffest.index * 5;
      },
      1500,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 下一轮
    const albumNext = throttle(
      function() {
        const li = liRef.value as HTMLElement;
        if (listOffest.index == 2) {
          listOffest.index = 0;
          listOffest.duration = 0;
          setTimeout(() => {
            listOffest.index++;
            listOffest.duration = 1.5;
            listOffest.transform = li.clientWidth * listOffest.index * 5;
          });
        } else {
          listOffest.index++;
          listOffest.duration = 1.5;
        }
        listOffest.transform = li.clientWidth * listOffest.index * 5;
      },
      1500,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );
    return {
      albumNewestData,
      listRef,
      liRef,
      listStyle,
      albumPrev,
      albumNext
    };
  }
});
</script>

<style lang="less" scoped>
.album-newest {
  height: 186px;
  margin: 20px 0 37px;
  border: 1px solid #d3d3d3;
  .warp {
    position: relative;
    width: 654px;
    height: 184px;
    padding-left: 16px;
    padding-right: 16px;
    background: #f5f5f5;
    border: 1px solid #fff;
    overflow: hidden;
    .content {
      width: 625px;
      margin-left: 20px;
      overflow: hidden;
    }
    .list {
      width: 1000%;
      height: 180px;
      margin-top: 28px;
      text-align: left;
      overflow: hidden;
      .item {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 118px;
        height: 150px;
        padding-right: 8px;
        // background: url('../../../../assets/image/home/home-icon.png');
        // background-position: -260px 100px;
        .item-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 118px;
          height: 100px;
          background: url('../../../../assets/image/home/coverall.png');
          background-position: 0 -570px;
          cursor: pointer;
          .img {
            display: block;
            width: 100px;
            height: 100px;
          }
        }
        .title,
        .name {
          margin-top: 106px;
          color: #000;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        .name {
          margin-top: 3px;
          color: #666;
        }
      }
    }
    .btn {
      position: absolute;
      top: 71px;
      width: 17px;
      height: 17px;
      background: url('../../../../assets/image/home/home-icon.png');
      border: none;
      outline: none;
      cursor: pointer;
    }
    .left-btn {
      left: 4px;
      background-position: -260px -75px;
      &:hover {
        background-position: -280px -75px;
      }
    }
    .right-btn {
      right: 4px;
      background-position: -300px -75px;
      &:hover {
        background-position: -320px -75px;
      }
    }
  }
}
</style>
