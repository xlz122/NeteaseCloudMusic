import { createVNode, render } from 'vue';
import MessageComponent from './Message.vue';

const Message = {
  install: (app: Record<string, any>) => {
    // 创建虚拟dom
    const vm = createVNode(MessageComponent, {});

    // 这句很关键，关联数据
    vm.appContext = app._context;

    const message = document.getElementById('message') as HTMLElement;

    // 容器挂载
    render(vm, message);
  }
};

export default Message;
