<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentTotal }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img
        class="user-avatar"
        :src="songListDetailData?.playlist?.creator?.avatarUrl"
      />
      <textarea
        class="comment-textarea"
        v-model="commentText"
        placeholder="评论"
      ></textarea>
    </div>
    <div class="operate">
      <div class="operate-icon">
        <i @click="isEmoj=!isEmoj" class="icon expression"></i>
        <i class="icon att"></i>
      </div>
      <div class="operate-publish">
        <span class="text" :class="{ 'words-beyond': commentTextLength < 0 }">
          {{ commentTextLength }}
        </span>
        <button class="publish" @click="commentSubmit">评论</button>
      </div>
    </div>
    <!--表情-->
    <div v-if="isEmoj" class="auto-content">
      <div class="e-emts">
        <div class="emtwrap">
          <span v-for="(item,index) in emoList" :key="index">
            <img :src="item" @click="chooseEmoj(item,index)" />
          </span>
        </div>
        <div class="page">
          <a @click="add(0)" href="#" hidefocus="true" class="j-flag u-btn u-btn-prv" id="auto-id-d414v9B35WEzCRTC"></a>
            <span class="j-flag text s-fc3">{{current}}/{{total}}</span>
          <a @click="add(1)" href="#" hidefocus="true" class="j-flag u-btn u-btn-nxt" id="auto-id-hDGi7NQeJN29A4Tg"></a>
        </div>
      </div>
    </div>
    <!-- 精彩评论 -->
    <h3 class="comment-list-title" v-if="hotCommentsList?.length > 0">
      精彩评论
    </h3>
    <ul class="comment-list" v-if="hotCommentsList?.length > 0">
      <li class="item" v-for="(item, index) in hotCommentsList" :key="index">
        <img class="user-avatar" :src="item?.user?.avatarUrl" />
        <div class="item-right">
          <div class="detail-text">
            <span class="name">
              {{ item?.user?.nickname }}
            </span>
            <span class="text">: {{ item?.content }}</span>
          </div>
          <!-- 他人回复部分 -->
          <template v-if="item?.beReplied.length > 0">
            <div
              class="comment-content-detail"
              v-for="(i, ind) in item?.beReplied"
              :key="ind"
            >
              <template v-if="i.status === 0">
                <span class="name">
                  {{ i?.user?.nickname }}
                </span>
                <span class="text">: {{ i?.content }}</span>
              </template>
              <template v-if="i.status === -5">
                <span class="text delete-text">该评论已删除</span>
              </template>
            </div>
          </template>
          <div class="item-operate">
            <span class="time">{{ formatDate(item?.time) }}</span>
            <div class="reply-operate">
              <span class="delete" @click="deleteCommentList(item.commentId)">
                删除
              </span>
              <span class="delete-line">|</span>
              <!-- 点赞 -->
              <i
                class="like liked"
                v-if="item.liked"
                @click="songSheetLikeList(item.commentId, 0)"
              ></i>
              <i
                class="like no-like"
                v-else
                @click="songSheetLikeList(item.commentId, 1)"
              ></i>
              <span class="like-num" v-if="item.likedCount > 0">
                ({{ item.likedCount }})
              </span>
              <span class="line">|</span>
              <span class="reply" @click="replyComment(item.commentId, index)">
                回复
              </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply" v-if="item?.replyShow || false">
            <div class="comment-content">
              <textarea
                class="comment-textarea"
                v-model="replyText"
                :placeholder="`回复${item?.user?.nickname}`"
              ></textarea>
            </div>
            <div class="operate">
              <div class="operate-icon">
                <i class="icon expression"></i>
                <i class="icon att"></i>
              </div>
              <div class="operate-publish">
                <span
                  class="text"
                  :class="{ 'words-beyond': replyTextLength < 0 }"
                >
                  {{ replyTextLength }}
                </span>
                <button class="publish" @click="replySubmit">评论</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 最新评论 -->
    <h3 class="comment-list-title" v-if="commentList?.length > 0">
      最新评论({{ commentTotal }})
    </h3>
    <ul class="comment-list" v-if="commentList?.length > 0">
      <li class="item" v-for="(item, index) in commentList" :key="index">
        <img class="user-avatar" :src="item?.user?.avatarUrl" />
        <div class="item-right">
          <div class="detail-text">
            <span class="name">
              {{ item?.user?.nickname }}
            </span>
<!--            <span class="text">: {{ item?.content }}</span>-->
            <div class="text" v-html="item.content"></div>
          </div>
          <!-- 他人回复部分 -->
          <template v-if="item?.beReplied.length > 0">
            <div
              class="comment-content-detail"
              v-for="(i, ind) in item?.beReplied"
              :key="ind"
            >
              <template v-if="i.status === 0">
                <span class="name">
                  {{ i?.user?.nickname }}
                </span>
                <span class="text">: {{ i?.content }}</span>
              </template>
              <template v-if="i.status === -5">
                <span class="text delete-text">该评论已删除</span>
              </template>
            </div>
          </template>
          <div class="item-operate">
            <span class="time">{{ formatDate(item?.time) }}</span>
            <div class="reply-operate">
              <span class="delete" @click="deleteCommentList(item.commentId)">
                删除
              </span>
              <span class="delete-line">|</span>
              <!-- 点赞 -->
              <i
                class="like liked"
                v-if="item.liked"
                @click="songSheetLikeList(item.commentId, 0)"
              ></i>
              <i
                class="like no-like"
                v-else
                @click="songSheetLikeList(item.commentId, 1)"
              ></i>
              <span class="like-num" v-if="item.likedCount > 0">
                ({{ item.likedCount }})
              </span>
              <span class="line">|</span>
              <span class="reply" @click="replyComment(item.commentId, index)">
                回复
              </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply" v-if="item?.replyShow || false">
            <div class="comment-content">
              <textarea
                class="comment-textarea"
                v-model="replyText"
                :placeholder="`回复${item?.user?.nickname}`"
              ></textarea>
            </div>
            <div class="operate">
              <div class="operate-icon">
                <i class="icon expression"></i>
                <i class="icon att"></i>
              </div>
              <div class="operate-publish">
                <span
                  class="text"
                  :class="{ 'words-beyond': replyTextLength < 0 }"
                >
                  {{ replyTextLength }}
                </span>
                <button class="publish" @click="replySubmit">评论</button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 删除歌曲弹框 -->
    <my-dialog
      class="delete-comment-dialog"
      :visible="deleteCommentDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm="deleteCommentConfirm"
      @cancel="deleteCommentCancel"
    >
      <p class="content">确定删除评论？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import MyDialog from '@/components/MyDialog.vue';
import {
  commentPlayList,
  addSongSheetComment,
  deleteSongSheetComment,
  songSheetLike,
  replySongSheetComment
} from '@api/my-music';
import { formatDate } from '@utils/utils';
import { ResponseType, LoopType } from '@/types/types';

export default defineComponent({
  components: {
    MyDialog
  },
  props: ({
    songListDetailData: {
      type: Object,
      default: {}
    }
  } as unknown) as undefined,
  setup(props: { songListDetailData: ResponseType }) {
    // 播放列表更新，重新请求评论数据
    watch(
      () => props.songListDetailData,
      () => {
        getCommentPlayList();
      }
    );

    //表情
    const isEmoj=ref(false)
    const emoList:any=ref([]);
    const current=ref(1);
    const total=ref(0)
    const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极'];
    total.value=Math.floor(list.length/50)
    add();

    function add(n:number=0):void{
      emoList.value=[];
      switch (n) {
        case 0://减
          current.value=current.value===1?1:current.value-1;
          break;
        case 1://加
          current.value=current.value===total.value?total.value:current.value+1;
          break;
        default:
          current.value=1;
          break;
      }
      let i=current.value*50-50;
      for(i;i<current.value*50;i++){
        emoList.value.push("https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/"+i+".gif")
      }
    }


    // 评论内容
    const commentText = ref<string>('');
    //输入表情
    function chooseEmoj(item:string,index:number) {
      commentText.value+='['+list[(current.value-1)*50+index]+']';
    }

    // 监听最大可以输入数量
    const commentTextLength = ref<number>(140);
    watch(
      () => commentText.value,
      (curVal: string) => {
        commentTextLength.value = 140 - curVal.length;
      }
    );

    // 评论提交
    function commentSubmit(): boolean | undefined {
      if (commentTextLength.value === 0) {
        alert('输入点内容再提交吧');
        return false;
      }
      if (commentTextLength.value < 0) {
        alert('输入不能超过140个字符');
        return false;
      }
      // let reg = /\[.+?\]/g;
      // let text = commentText.value.replace(reg, function (a:any, b:any) {
      //   let emo=(a.split('[')[1]).split(']')[0]
      //   let index=list.findIndex(item=>item==emo)
      //   return "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/"+index+".gif' />";
      // });
      addSongSheetComment({
        id: props?.songListDetailData?.playlist?.id,
        content: commentText.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          commentText.value = '';
          getCommentPlayList();
        }
      });
    }

    // 获取评论列表
    const hotCommentsList = ref<LoopType>([]);
    const commentList = ref<LoopType>([]);
    const commentTotal = ref<number>(0);
    function getCommentPlayList(): void {
      commentPlayList({
        id: props?.songListDetailData?.playlist?.id
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 精彩评论
          res.hotComments.forEach((item: LoopType) => {
            item.replyShow = false;
          });
          hotCommentsList.value = res.hotComments;
          // 最新评论
          res.comments.forEach((item: LoopType) => {
            item.replyShow = false;
          });
          commentList.value = res.comments;
          commentList.value.map((item:any,index:number)=>{
            let reg = /\[.+?\]/g;
            let text = item?.content.replace(reg, function (a:any, b:any) {
              let emo=(a.split('[')[1]).split(']')[0]
              let index=list.findIndex(item=>item==emo)
              return "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/"+index+".gif' />";
            });
            item.content=text;
          })
          console.log(commentList.value)
          // 最新评论 - 总数
          commentTotal.value = res.total;
        }
      });
    }

    // 删除评论
    const deleteCommentDialog = ref<boolean>(false);
    const deleteCommentId = ref<number>(0);
    function deleteCommentList(commentId: number): void {
      deleteCommentDialog.value = true;
      deleteCommentId.value = commentId;
    }

    // 删除评论 - 确定
    function deleteCommentConfirm() {
      deleteSongSheetComment({
        id: props?.songListDetailData?.playlist?.id,
        commentId: deleteCommentId.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          deleteCommentDialog.value = false;
          getCommentPlayList();
        }
      });
    }

    // 删除评论 - 确定
    function deleteCommentCancel() {
      deleteCommentDialog.value = false;
    }

    // 点赞
    function songSheetLikeList(commentId: number, type: number): void {
      // 页面静态修改
      const likeIndex = commentList.value.findIndex(
        (item: LoopType) => item.commentId === commentId
      );
      if (type === 0) {
        commentList.value[likeIndex].liked = false;
        commentList.value[likeIndex].likedCount--;
      } else {
        commentList.value[likeIndex].liked = true;
        commentList.value[likeIndex].likedCount++;
      }
      // 接口修改
      songSheetLike({
        id: props?.songListDetailData?.playlist?.id,
        cid: commentId,
        t: type
      });
    }

    // 回复
    // 回复内容
    const replyText = ref<string>('');

    // 监听最大可以输入数量
    const replyTextLength = ref<number>(140);
    watch(
      () => replyText.value,
      (curVal: string) => {
        replyTextLength.value = 140 - curVal.length;
      }
    );

    // 显示回复框
    const replyCommentId = ref<number>(0);
    function replyComment(commentId: number, index: number): void {
      commentList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      commentList.value[index].replyShow = true;
      replyCommentId.value = commentId;
    }

    // 回复提交
    function replySubmit(): void {
      replySongSheetComment({
        id: props?.songListDetailData?.playlist?.id,
        content: replyText.value,
        commentId: replyCommentId.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          replyText.value = '';
          getCommentPlayList();
        }
      });
    }
    return {
      formatDate,
      commentText,
      commentTextLength,
      commentSubmit,
      hotCommentsList,
      commentList,
      commentTotal,
      deleteCommentList,
      deleteCommentDialog,
      deleteCommentConfirm,
      deleteCommentCancel,
      songSheetLikeList,
      replyText,
      replyTextLength,
      replyComment,
      replySubmit,
      emoList,
      current,
      total,
      add,
      chooseEmoj,
      isEmoj,
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment.less';
</style>
