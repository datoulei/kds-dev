import Vue from 'vue';

const state = {
  info: null,
  type: 0,
  orderList: [],
  remark: true,
  overTime: {},
  card1Height: 0,
  card23Height: 0,
  full: false,
};

const getters = {
  UserInfo: state => state.info,
  Type: state => state.type,
  orderList: state => state.type,
  remark: state => state.remark,
  overTime: state => state.overTime,
  card1Height: state => state.card1Height,
  card1Height: state => state.card23Height,
  full: state => state.full,

};

const mutations = {
  SET_USER_INFO(state, info) {
    state.info = info;
  },
  SET_TYPE(state, type) {
    state.type = type;
  },
  SET_ORDER_LIST(state, orderList) {
    state.orderList = orderList
  },
  SET_REMARK(state, remark) {
    state.remark = remark
  },
  SET_OVERTIME(state, overTime) {
    state.overTime = overTime
  },
  SET_CARD1HEIGHT(state, height) {
    state.card1Height = height;
  },
  SET_CARD23HEIGHT(state, height) {
    state.card23Height = height;
  },
  SET_FULL(state, full) {
    state.full = full
  }
};

const actions = {
  async GetUserInfo({ commit }) {
    const UserInfo = await Vue.http.get('/users/me');
    commit('SET_USER_INFO', UserInfo);
  },
};

export default {
  state,
  getters,
  mutations,
  actions
};
