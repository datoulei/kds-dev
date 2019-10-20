import dayjs from 'dayjs';
import db from '../../../db';


const state = {

  // 超时时间
  overTime: {},

  // 分类
  categories: [],

  // 菜品
  dishes: [],

  // 订单
  orderList: [],

  // 待推送订单列表
  uploadOrderList: [],



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
  },

  getOrderList: state => state.orderList,
};

const mutations = {

  // 划菜、撤销
  SET_ORDER_LIST(state, dish) {
    const orderList = state.orderList;
    const _orderList = orderList.map(order => {
      if (order.key === dish.key) {
        if (order.isDone === false) {
          order.isDone = true;
          order.finishTime = dayjs().format('YYYYMMDDHHmmss');
        } else {
          order.isDone = false;
          order.finishTime = null;
        }
      }
      return order;
    });
    state.orderList = _orderList;

    //持久化
    console.log(state.orderList);
    db.set('orderList', _orderList).write();

  },

  PUSH_ORDER_LIST(state, newOrders) {
    const orderList = state.orderList;
    state.orderList = [...orderList, ...newOrders];
    // 持久化
    db.set('orderList', [...orderList, ...newOrders]).write();
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

  ADD_UPLOAD_LIST(state, uploadList) {
    const temp = state.uploadOrderList;
    state.uploadOrderList = [...temp, ...uploadList];
    // 持久化
    db.set('uploadList', [...temp, ...uploadList]).write();
  },

  RM_UPLOAD_LIST(state, dish) {
    const temp = state.uploadOrderList;
    const _uploadList = temp.filter(item => {
      if (item.orderKey !== dish.orderKey) {
        return item;
      }
    });
    state.uploadOrderList = _uploadList;
    // 持久化
    db.set('uploadList', _uploadList).write();
  }
};

const actions = {
  pushOrderList({ commit }, newOrders) {
    commit('PUSH_ORDER_LIST', newOrders);
  },

  setOrderList({ commit }, dish) {
    commit('SET_ORDER_LIST', dish);
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

  setUploadList({ commit }, uploadList) {
    commit('ADD_UPLOAD_LIST', uploadList);
  },

  rmUploadList({ commit }, dish) {
    commit('RM_UPLOAD_LIST', dish);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
