import dayjs from 'dayjs';
const state = {
  time: dayjs()
};

const getters = {
  timer: state => state.time
};

const mutations = {
  SET_TIME(state, time) {
    state.time = time;
  }
};

const actions = {
  updateTime({ commit }) {
    commit('SET_TIME', dayjs());
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
