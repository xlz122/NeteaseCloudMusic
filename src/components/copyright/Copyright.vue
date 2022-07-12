<template>
  <my-dialog
    class="copyright-dialog"
    :visible="copyright.visible"
    :confirmtext="'知道了'"
    showConfirmButton
    @confirm="confirm"
    @cancel="cancel"
  >
    <p class="content">
      {{ copyright.message || '由于版权保护，您所在的地区暂时无法使用。' }}
    </p>
  </my-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  name: 'NoCopyright',
  components: {
    MyDialog
  },
  setup() {
    const $store = useStore();

    const copyright = computed(() => $store.getters.copyright);

    function confirm(): void {
      $store.commit('setCopyright', {
        visible: false,
        message: ''
      });
    }

    function cancel(): void {
      $store.commit('setCopyright', {
        visible: false,
        message: ''
      });
    }

    return {
      copyright,
      confirm,
      cancel
    };
  }
});
</script>

<style lang="less" scoped>
.copyright-dialog {
  .my-dialog-box {
    width: 480px;
  }

  .content {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
}
</style>
