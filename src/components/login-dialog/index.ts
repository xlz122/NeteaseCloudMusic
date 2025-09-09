import { createVNode, render } from 'vue';
import type { AppContext } from 'vue';
import Component from './LoginDialog.vue';

const LoginDialog = {
  install: (app: { _context: AppContext | null }): void => {
    const vm = createVNode(Component, {});

    // 关联数据
    vm.appContext = app._context;

    // 挂载
    const element = document.getElementById('loginDialog')!;
    render(vm, element);
  }
};

export default LoginDialog;
