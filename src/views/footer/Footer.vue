<template>
  <div class="footer">
    <div class="content">
      <div class="content-left">
        <ul class="left-nav">
          <li class="item">
            <a
              class="link"
              href="https://st.music.163.com/official-terms/service"
              target="_blank"
            >
              服务条款
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a
              class="link"
              href="https://st.music.163.com/official-terms/privacy"
              target="_blank"
            >
              隐私政策
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a
              class="link"
              href="https://st.music.163.com/official-terms/children"
              target="_blank"
            >
              儿童隐私政策
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a
              class="link"
              href="https://music.163.com/st/staticdeal/complaints.html"
              target="_blank"
            >
              版权投诉指引
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a
              class="link"
              href="//mp.music.163.com/600948c936c13f4d09752e73/contact-us-web/index.html?source=Music-Main-Station"
              target="_blank"
            >
              联系我们
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a
              class="link"
              href="https://music.163.com/ui/resource"
              target="_blank"
            >
              广告合作
            </a>
            <span class="line">|</span>
          </li>
          <li class="item">
            <a class="link" href="https://jubao.163.com" target="_blank">
              廉正举报
            </a>
          </li>
        </ul>
        <div class="group">
          <span>网易公司版权所有©1997-2022</span>
          <span class="sep">杭州乐读科技有限公司运营：</span>
          <a
            class="link"
            href="https://p1.music.126.net/Mos9LTpl6kYt6YTutA6gjg==/109951164248627501.png"
            target="_blank"
          >
            浙网文[2021] 1186-054号
          </a>
        </div>
        <div class="group">
          <a
            class="link"
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
          >
            粤B2-20090191-18 工业和信息化部备案管理系统网站
          </a>
          <a
            class="link"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902002564"
            target="_blank"
          >
            <i class="logo"></i>
            浙公网安备 33010902002564号
          </a>
        </div>
      </div>
      <div class="content-right">
        <ul class="right-nav">
          <li class="item first-item">
            <a
              class="link amped-icon"
              href="https://web-amped.music.163.com/"
              target="_blank"
            ></a>
            <i class="text amped-text"></i>
          </li>
          <li class="item">
            <a
              class="link auth-icon"
              href="https://music.163.com/st/userbasic#/auth"
              target="_blank"
            ></a>
            <i class="text auth-text"></i>
          </li>
          <li class="item">
            <a
              class="link musician-icon"
              href="https://music.163.com/st/musician"
              target="_blank"
            ></a>
            <i class="text musician-text"></i>
          </li>
          <li class="item">
            <a
              class="link reward-icon"
              href="https://music.163.com/web/reward"
              target="_blank"
            ></a>
            <i class="text reward-text"></i>
          </li>
          <li class="item">
            <a
              class="link cash-icon"
              href="https://music.163.com/uservideo#/plan"
              target="_blank"
            ></a>
            <i class="text cash-text"></i>
          </li>
        </ul>
      </div>
    </div>
    <my-dialog
      class="feedback-dialog"
      :visible="feedbackDialog"
      :confirmtext="'发送意见'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm="feedbackConfirm"
      @cancel="feedbackCancel"
    >
      <div class="feedback-dialog-form">
        <div class="form-content">
          <div class="title">任何产品中的问题，欢迎反馈给我们</div>
          <textarea
            class="area"
            v-model="feedbackData.content"
            @blur="feedbackBlur"
          ></textarea>
          <textarea
            class="area contact"
            v-model="feedbackData.contact"
          ></textarea>
          <span class="verification" v-if="feedbackVerifiy">
            反馈内容不能为空
          </span>
        </div>
      </div>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  name: 'FooterView',
  components: {
    MyDialog
  },
  setup() {
    const $store = useStore();

    const feedbackDialog = ref<boolean>(false);

    // 反馈表单
    const feedbackData = ref({
      content: '',
      contact: ''
    });

    const feedbackVerifiy = ref<boolean>(false);

    // 反馈内容失去焦点
    function feedbackBlur() {
      if (!feedbackData.value.content) {
        feedbackVerifiy.value = true;
      } else {
        feedbackVerifiy.value = false;
      }
    }

    // 意见反馈
    function feedback(): void {
      feedbackDialog.value = true;
    }

    // 意见反馈 - 确定
    function feedbackConfirm(): boolean | undefined {
      if (!feedbackData.value.content) {
        feedbackVerifiy.value = true;
        return false;
      }
      feedbackDialog.value = false;
      $store.commit('setMessage', {
        type: 'info',
        title: '反馈已提交'
      });
      // 清空表单
      feedbackData.value.content = '';
      feedbackData.value.contact = '';
    }
    // 意见反馈 - 取消
    function feedbackCancel(): void {
      feedbackDialog.value = false;
    }
    return {
      feedbackDialog,
      feedbackData,
      feedbackVerifiy,
      feedback,
      feedbackConfirm,
      feedbackCancel,
      feedbackBlur
    };
  }
});
</script>

<style lang="less" scoped>
@import './footer.less';
</style>
