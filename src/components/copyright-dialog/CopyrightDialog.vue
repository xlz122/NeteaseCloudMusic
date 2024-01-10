<template>
  <my-dialog
    class="copyright-dialog"
    :visible="copyrightDialog.visible"
    :confirmtext="'知道了'"
    showConfirmButton
    @confirm="confirm"
    @cancel="cancel"
  >
    <p class="content">
      {{
        copyrightDialog.message || '由于版权保护，您所在的地区暂时无法使用。'
      }}
    </p>
  </my-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';

const $store = useStore();
const copyrightDialog = computed(() => $store.getters.copyrightDialog);

function confirm(): void {
  $store.commit('setCopyrightDialog', {
    visible: false,
    message: ''
  });
}

function cancel(): void {
  $store.commit('setCopyrightDialog', {
    visible: false,
    message: ''
  });
}
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
