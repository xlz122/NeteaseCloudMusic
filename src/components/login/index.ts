import { createVNode, render } from 'vue';
import LoginComponent from '@views/login/Login.vue';

const Login = {
  install: (app: Record<string, any>): void => {
    // 创建虚拟dom
    const vm = createVNode(LoginComponent, {});

    // 这句很关键，关联数据
    vm.appContext = app._context;

    const login = document.getElementById('login') as HTMLElement;

    // 容器挂载
    render(vm, login);
  }
};

export default Login;
