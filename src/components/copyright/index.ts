import { createVNode, render } from 'vue';
import CopyrightComponent from '@/components/copyright/Copyright.vue';

const Copyright = {
  install: (app: Record<string, any>): void => {
    // 创建虚拟dom
    const vm = createVNode(CopyrightComponent, {});

    // 关联数据
    vm.appContext = app._context;

    const copyright = document.getElementById('copyright') as HTMLElement;

    // 容器挂载
    render(vm, copyright);
  }
};

export default Copyright;
