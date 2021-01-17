<template>
  <div>音乐人</div>
</template>

<script lang="ts" setup>
const a = document.createElement('a') as HTMLAnchorElement;
a.href = 'https://music.163.com/st/musician';
a.target = '_blank';
a.click();
</script>
