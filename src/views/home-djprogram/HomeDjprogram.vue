<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <Category @djCategorChange="djCategorChange" />
      <div class="dis-flex justify-between">
        <Recommend />
        <RankiList />
      </div>
      <RadioStation name="音乐推荐" :musicList="musicObj.musicList" />
      <RadioStation name="生活" :musicList="musicObj.lifeList" />
      <RadioStation name="情感" :musicList="musicObj.emotionList" />
      <RadioStation name="创作翻唱" :musicList="musicObj.coverList" />
      <RadioStation name="知识" :musicList="musicObj.knowledgeList" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';
import { setMessage } from '@/components/message/useMessage';
import Category from './category/Category.vue';
import Recommend from './recommend/ReCommend.vue';
import RankiList from './rankiList/RankiList.vue';
import RadioStation from './radioStation/RadioStation.vue';
import { djCatelist, recommendTypeList } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';

type MusicType = {
  djList: object[];
  musicList: object[];
  musicId: number;
  lifeList: object[];
  lifeId: number;
  emotionList: object[];
  emotionId: number;
  coverList: object[];
  coverId: number;
  knowledgeList: object[];
  knowledgeId: number;
};

export default defineComponent({
  name: 'home-djprogram',
  components: {
    Category,
    Recommend,
    RankiList,
    RadioStation
  },
  setup() {
    // 分类点击
    function djCategorChange(id: number): void {
      setMessage({ type: 'info', title: `分类id:${id}` });
    }
    // 获取全部电台类型
    function djcateHandle(): Promise<object[]> {
      return new Promise((resolve, reject) => {
        djCatelist()
          .then((res: ResponseType) => {
            if (res?.code === 200) {
              resolve(res.categories || []);
            } else {
              reject();
            }
          })
          .catch(err => reject(err));
      });
    }
    // 根据电台类型id获取对应推荐
    function recommendTypeHandle(id: number): Promise<object[]> {
      return new Promise((resolve, reject) => {
        recommendTypeList({ type: id })
          .then((res: ResponseType) => {
            if (res?.code === 200) {
              resolve(res.djRadios || []);
            } else {
              reject();
            }
          })
          .catch(() => reject());
      });
    }

    const musicObj = reactive<MusicType>({
      djList: [],
      musicList: [],
      lifeId: 0,
      lifeList: [],
      musicId: 0,
      emotionList: [],
      emotionId: 0,
      coverList: [],
      coverId: 0,
      knowledgeList: [],
      knowledgeId: 0
    });

    async function recommendTypeHandleFn() {
      musicObj.djList = await djcateHandle();
      musicObj.musicId = (
        musicObj?.djList.filter((x: any) => x.name === '音乐推荐')[0] as any
      ).id;
      musicObj.musicList = await recommendTypeHandle(musicObj.musicId);

      musicObj.lifeId = (
        musicObj?.djList.filter((x: any) => x.name === '生活')[0] as any
      ).id;
      musicObj.lifeList = await recommendTypeHandle(musicObj.lifeId);

      musicObj.emotionId = (
        musicObj?.djList.filter((x: any) => x.name === '情感')[0] as any
      ).id;
      musicObj.emotionList = await recommendTypeHandle(musicObj.emotionId);

      musicObj.coverId = (
        musicObj?.djList.filter((x: any) => x.name === '创作翻唱')[0] as any
      ).id;
      musicObj.coverList = await recommendTypeHandle(musicObj.coverId);

      musicObj.knowledgeId = (
        musicObj?.djList.filter((x: any) => x.name === '知识')[0] as any
      ).id;
      musicObj.knowledgeList = await recommendTypeHandle(musicObj.knowledgeId);
    }

    onMounted(() => {
      recommendTypeHandleFn();
    });

    return {
      djCategorChange,
      musicObj
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./home-djprogram.less');
</style>
