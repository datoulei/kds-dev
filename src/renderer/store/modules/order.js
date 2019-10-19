
const state = {

  // 超时时间
  overTime: {},

  // 分类
  categories: [],

  // 菜品
  dishes: [],

  // 订单
  orderList: [],




};

const getters = {
  //区域分类
  areaCategories: function (state) {
    let menu = [
      { area: 1, list: [{ id: 0, name: '全部' }], ids: [] },
      { area: 2, list: [{ id: 0, name: '全部' }], ids: [] },
      { area: 3, list: [{ id: 0, name: '全部' }], ids: [] }
    ];
    state.categories.map(item => {
      menu[item.area - 1].list.push({
        id: item.id,
        name: item.name
      });
      menu[item.area - 1].ids.push(item.id);
    });
    return menu;
  },

  //已经划菜
  getFinishOrder: function (state) {
    let menu = [
      [], [], []
    ];
    state.categories.map(item => {
      menu[item.area - 1].push(item.id);
    });

    let orders = [[], [], []];
    state.orderList.map(order => {
      state.dishes.map(dish => {
        if (order.foodName === dish.foodName && order.isDone === true) {
          if (menu[2].includes(dish.categoryId)) {
            orders[2].push({ ...order, categoryId: dish.categoryId });
          } else if (menu[1].includes(dish.categoryId)) {
            orders[1].push({ ...order, categoryId: dish.categoryId });
          } else {
            orders[0].push({ ...order, categoryId: dish.categoryId });
          }
        }
      })
    })
    return orders;
  },

  // 未划菜
  getUnFinishOrder: function (state) {
    let menu = [
      [], [], []
    ];
    state.categories.map(item => {
      menu[item.area - 1].push(item.id);
    });

    let orders = [[], [], []];
    state.orderList.map(order => {
      state.dishes.map(dish => {
        if (order.foodName === dish.foodName && order.isDone === false) {
          if (menu[2].includes(dish.categoryId)) {
            orders[2].push({ ...order, categoryId: dish.categoryId });
          } else if (menu[1].includes(dish.categoryId)) {
            orders[1].push({ ...order, categoryId: dish.categoryId });
          } else {
            orders[0].push({ ...order, categoryId: dish.categoryId });
          }
        }
      })
    })
    return orders;
  }
};

const mutations = {


  SET_ORDER_LIST(state, newOrders) {
    const orderList = state.orderList;
    state.orderList = [...orderList, ...newOrders]
  },

  SET_OVERTIME(state, overTime) {
    state.overTime = overTime
  },

  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },

  SET_DISHES(state, dishes) {
    state.dishes = dishes
  },

};

const actions = {
  setOrderList({ commit }, newOrders) {
    commit('SET_ORDER_LIST', newOrders);
  },

  setOverTime({ commit }, overTime) {
    commit('SET_OVERTIME', overTime);
  },

  setCategories({ commit }, categories) {
    commit('SET_CATEGORIES', categories);
  },

  setDishes({ commit }, dishes) {
    commit('SET_DISHES', dishes);
  },

  setUnFinishList({ commit }, list) {

  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
