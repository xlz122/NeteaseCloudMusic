export interface State {
  heaerActiveIndex: number;
}

const state: State = {
  heaerActiveIndex: Number(sessionStorage.getItem('heaerActiveIndex')) || 0
};

export default state;
