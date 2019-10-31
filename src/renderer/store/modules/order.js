import dayjs from 'dayjs';
import db from '../../../db';
import { ipcRenderer } from 'electron';
import Vue from 'vue';

const state = {

  // 分类
  categories: [],

  // 菜品
  dishes: [],

  // 订单
  orderList: [],

  // 待推送订单列表
  uploadOrderList: [],

  // 当前时间
  currentTime: dayjs(),

  // 超时时间
  overTime: {
    halfTime: 10,
    allTime: 20,
    halfColor: '#FFA90A',
    allColor: '#FF2424'
  },

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

      // 未在分类中的
      if (order.isDone) {
        const filter = state.dishes.filter(item => order.foodName === item.foodName && order.isCancel !== true);
        if (filter.length === 0) {
          if (order.isCancel !== true) {
            orders[0].push({ ...order, categoryId: 0 });
          }
        }
      }
      // 在分类中
      state.dishes.map(dish => {
        if (order.foodName === dish.foodName && order.isDone === true && order.isCancel !== true) {
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

      // 未在分类中的
      if (!order.isDone) {
        const filter = state.dishes.filter(item => order.foodName === item.foodName);
        if (filter.length === 0) {
          if (order.isCancel !== true) {
            orders[0].push({ ...order, categoryId: 0 });
          }
        }

        // 在分类中的
        state.dishes.map(dish => {
          if (order.foodName === dish.foodName && order.isDone === false && order.isCancel !== true) {
            if (menu[2].includes(dish.categoryId)) {
              orders[2].push({ ...order, categoryId: dish.categoryId });
            } else if (menu[1].includes(dish.categoryId)) {
              orders[1].push({ ...order, categoryId: dish.categoryId });
            } else {
              orders[0].push({ ...order, categoryId: dish.categoryId });
            }
          }
        })
      }


    })
    return orders;
  },

  getOrderList: state => state.orderList,

  // 当前时间
  currentTime: state => state.currentTime,

  //超时时间
  overTime: state => state.overTime,
};

const mutations = {

  // 划菜、撤销
  SET_ORDER_LIST(state, dish) {
    const orderList = state.orderList;
    const _orderList = orderList.map(order => {
      if (order.key === dish.key) {
        if (order.isDone === false) {
          order.isDone = true;
          order.finishTime = Number(dayjs().format('YYYYMMDDHHmmss'));
        } else {
          order.isDone = false;
          order.finishTime = null;
        }
      }
      return order;
    });
    state.orderList = _orderList;

    //在主进程中持久化
    ipcRenderer.send('write2db', 'orderList', _orderList);
    ipcRenderer.send('orderList', _orderList);

  },

  PUSH_ORDER_LIST(state, newOrders) {
    let orderList = Object.assign([], state.orderList);

    // 最多记录1000调
    // newOrders.map(order => {
    //   if (orderList.length >= 1000) {
    //     orderList.shift(); //删除第一个，
    //      orderList.push(order);  // 添加
    //   } else {
    //     orderList.push(order);
    //   }
    // })
    orderList = orderList.concat(...newOrders);

    if (orderList.length >= 200) {
      orderList = orderList.splice(orderList.length - 200);
    }

    state.orderList = orderList;
    //在主进程中持久化
    ipcRenderer.send('write2db', 'orderList', orderList)
    ipcRenderer.send('orderList', orderList);
  },


  UPDATE_ORDER_LIST(state, cancelOrderList) {
    const orderList = state.orderList;
    const cancelArray = cancelOrderList.map(cancelOrder => {
      return cancelOrder.itemKey;

    })

    const newOrderList = orderList.map(order => {
      if (cancelArray.includes(order.itemKey)) {
        order.isCancel = true;
      }
      return order
    })

    ipcRenderer.send('write2db', 'orderList', newOrderList);
    ipcRenderer.send('orderList', newOrderList);
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
    ipcRenderer.send('write2db', 'uploadList', [...temp, ...uploadList])
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
    ipcRenderer.send('write2db', 'uploadList', _uploadList);
  },


  CLEAR_UPLOAD_LIST(state) {
    state.uploadOrderList = [];
  },

  UPDATE_TIME(state) {
    state.currentTime = dayjs()
  },

  SET_OVERTIME(state, overTime) {
    state.overTime = overTime
  },
};

const actions = {
  pushOrderList({ commit }, newOrders) {
    commit('PUSH_ORDER_LIST', newOrders);
  },

  setOrderList({ commit }, dish) {
    commit('SET_ORDER_LIST', dish);
  },

  updateOrderList({ commit }, cancelOrder) {
    commit('UPDATE_ORDER_LIST', cancelOrder);
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
  },

  clearUploadList({ commit }) {
    commit('CLEAR_UPLOAD_LIST');
  },

  updateTime({ commit }) {
    commit('UPDATE_TIME')
  },

  async getOverTime({ commit }) {
    const overTime = await Vue.http.get('/setting/overtime');
    commit('SET_OVERTIME', overTime);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
