export interface State {
  heaerActiveIndex: number;
}

const state: State = {
  heaerActiveIndex: Number(localStorage.getItem('heaerActiveIndex')) || 0
};

export default state;
