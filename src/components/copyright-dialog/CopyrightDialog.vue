<template>
  <Dialog
    class="copyright-dialog"
    :visible="copyrightDialog.visible"
    :confirmtext="'知道了'"
    showConfirmButton
    @confirm="confirm"
    @cancel="cancel"
  >
    <template v-if="copyrightDialog.message">
      <p class="content">{{ copyrightDialog.message }}</p>
    </template>
    <template v-else>
      <p class="content">由于版权保护，您所在的地区暂时无法使用。</p>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Dialog from '@/components/Dialog.vue';

const store = useStore();
const copyrightDialog = computed(() => store.getters.copyrightDialog);

function confirm(): void {
  store.commit('setCopyrightDialog', {
    visible: false,
    message: ''
  });
}

function cancel(): void {
  store.commit('setCopyrightDialog', {
    visible: false,
    message: ''
  });
}
</script>

<style lang="less" scoped>
.copyright-dialog {
  .dialog-box {
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
