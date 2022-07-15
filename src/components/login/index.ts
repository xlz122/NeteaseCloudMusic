import { AppContext, createVNode, render } from 'vue';
import Component from '@views/login/Login.vue';

const Login = {
  install: (app: { _context: AppContext | null }): void => {
    // 创建虚拟dom
    const vm = createVNode(Component, {});

    // 关联数据
    vm.appContext = app._context;

    const element = document.getElementById('login') as HTMLDivElement;

    // 挂载
    render(vm, element);
  }
};

export default Login;
