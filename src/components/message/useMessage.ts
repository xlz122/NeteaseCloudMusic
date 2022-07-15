import { reactive } from 'vue';

type Message = {
  type?: string;
  title?: string;
  time?: number;
};

const message = reactive<Message>({
  type: 'info',
  title: '',
  time: 1000
});

function setMessage<T extends Message>({ type, title, time }: T): void {
  message.type = 'info';
  message.title = '';
  message.time = 1000;

  if (type) {
    message.type = type;
  }
  if (title) {
    message.title = title;
  }
  if (time) {
    message.time = time;
  }
}

function useMessage(): Message {
  return message;
}

export { setMessage };
export default useMessage;
