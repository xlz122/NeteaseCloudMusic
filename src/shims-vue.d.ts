/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 解决.vue文件导入ts文件时，使用路径别名路径找不到问题
declare module '*.ts';

// window 新增属性，ts检测不到问题
declare interface Window {
  g: string
}

// 声明lodash
declare module 'lodash';
