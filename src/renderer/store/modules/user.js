import Vue from 'vue';

const state = {
  //用户信息
  info: null,

  // 0：未划菜，1：划菜
  type: 0,

  // 是否显示备注
  remark: true,

  // 区域1高
  card1Height: 0,

  // 区域23高
  card23Height: 0,

  // 是否全屏
  full: false,

  dbInfo: {},

};

const getters = {

  UserInfo: state => state.info,
  Type: state => state.type,
  remark: state => state.remark,
  card1Height: state => state.card1Height,
  card23Height: state => state.card23Height,
  full: state => state.full,
};

const mutations = {
  SET_USER_INFO(state, info) {
    state.info = info;
  },
  SET_TYPE(state, type) {
    state.type = type;
  },

  SET_REMARK(state, remark) {
    state.remark = remark
  },

  SET_CARD1HEIGHT(state, height) {
    state.card1Height = height;
  },
  SET_CARD23HEIGHT(state, height) {
    state.card23Height = height;
  },
  SET_FULL(state, full) {
    state.full = full
  },

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
