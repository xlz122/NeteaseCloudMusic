export type State = {
  radioDetailId: number;
};

const state: State = {
  radioDetailId: Number(localStorage.getItem('radioDetailsId')) || 0 // 当前电台id
};

export default state;
