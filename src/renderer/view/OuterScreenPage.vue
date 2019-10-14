<template>
  <div class="content scroll_content">
    <div class="content-left">
      <div class="card" :style="{'height':card1Height+'px'}">
        <div class="header">
          <span style="margin-left:12px;">
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="current">
              <a-menu-item v-for="item in menuList1" :key="item.id" @click="checkType(item,1)">
                <div class="item">{{ item.name}}</div>
              </a-menu-item>
            </a-menu>
          </span>
          <div class="divider"></div>
          <div class="item" @click="sort(1)">时间排序</div>
        </div>
        <div class="body scroll_content">
          <v-food
            v-for="foo in dish1"
            :key="foo.id"
            :food="foo"
            :width="width"
            :overTime="overTime"
            :showRemark="showRemark"
            @click.native="doneDish(foo)"
          />
        </div>
      </div>
    </div>

    <div class="content-right">
      <div class="card" :style="{'height':card23Height+'px'}">
        <div class="header">
          <span style="margin-left:12px;">
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="current">
              <a-menu-item v-for="item in menuList2" :key="item.id" @click="checkType(item,2)">
                <div class="item">{{ item.name}}</div>
              </a-menu-item>
            </a-menu>
          </span>
          <div class="divider"></div>
          <div class="item" @click="sort(2)">时间排序</div>
        </div>
        <div class="body scroll_content">
          <v-food
            class="desk"
            v-for="foo in dish2"
            :key="foo.id"
            :food="foo"
            :width="width"
            :overTime="overTime"
          />
        </div>
      </div>
      <div class="card card-3" :style="{'height':card23Height+'px'}">
        <div class="header">
          <span style="margin-left:12px;">
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="current">
              <a-menu-item v-for="item in menuList3" :key="item.id" @click="checkType(item,3)">
                <div class="item">{{ item.name}}</div>
              </a-menu-item>
            </a-menu>
          </span>
          <div class="divider"></div>
          <div class="item" @click="sort(3)">时间排序</div>
        </div>
        <div class="body scroll_content">
          <v-food
            class="desk"
            v-for="foo in dish3"
            :key="foo.id"
            :food="foo"
            :width="width"
            :overTime="overTime"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron';
import Food from '@/components/Desk/Food-1.vue';
import _ from 'lodash';
export default {
  sockets: {
    // 新菜
    'create-order'(data) {
      console.log('create-order => ', data);
    },
    'done-dish-confirm'(data) {
      if (data.code === 0) {
        this.GetOrderList().then(rst => {
          this.$store.commit('SET_ORDER_LIST', rst);
          ipcRenderer.send('orderList', rst);
        });
      }
    },
    'undo-dish-confirm'(data) {
      if (data.code === 0) {
        this.GetOrderList().then(rst => {
          this.$store.commit('SET_ORDER_LIST', rst);
          ipcRenderer.send('orderList', rst);
        });
      }
    }
  },

  data() {
    return {
      overTime: {},
      current: [0],
      category1: 0,
      category2: 0,
      category3: 0,
      sort1: 'asc',
      sort2: 'asc',
      sort3: 'asc'
    };
  },
  components: {
    'v-food': Food
  },
  created() {
    this.GetOrderList().then(rst => {
      // 菜单分类
      this.$store.commit('SET_ORDER_LIST', rst);
      ipcRenderer.send('complete', rst, '', 'outer');
    });

    this.GetOverTime().then(rst => {
      this.overTime = rst;
      ipcRenderer.send('complete', '', rst, '_outer');
    });
  },
  beforeDestroy() {},
  computed: {
    // 小卡片的宽
    width() {
      const width = (window.screen.width - 36) / 2;
      return Math.ceil((width - 48) / 5);
    },
    // 区域2/3
    card23Height() {
      return Math.ceil(this.$store.state.user.card23Height);
    },
    // 区域1
    card1Height() {
      return this.$store.state.user.card1Height;
    },
    // 按钮标识：划菜或未划菜
    type() {
      return this.$store.state.user.type;
    },
    // 菜单列表
    orderList() {
      const orderList = this.$store.state.user.orderList;
      return Array.isArray(orderList) ? orderList : [];
    },

    // 区域1内容
    orderList1() {
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        // 未划菜
        if (this.type === 0) {
          if (this.category1 === 0) {
            // 全部
            return this.orderList[0].dishes.filter(item => !item.isDone);
          } else {
            return this.orderList[0].dishes.filter(
              item => !item.isDone && item.Dish.categoryId === this.category1
            );
          }
        } else {
          // 划菜
          if (this.category1 === 0) {
            // 全部
            return this.orderList[0].dishes.filter(item => item.isDone);
          } else {
            return this.orderList[0].dishes.filter(
              item => item.isDone && item.Dish.categoryId === this.category1
            );
          }
        }
      } else {
        return [];
      }
    },
    // 区域2内容
    orderList2() {
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        // 未划菜
        if (this.type === 0) {
          if (this.category2 === 0) {
            // 全部
            return this.orderList[1].dishes.filter(item => !item.isDone);
          } else {
            return this.orderList[1].dishes.filter(
              item => !item.isDone && item.Dish.categoryId === this.category2
            );
          }
        } else {
          // 划菜
          if (this.category2 === 0) {
            // 全部
            return this.orderList[1].dishes.filter(item => item.isDone);
          } else {
            return this.orderList[1].dishes.filter(
              item => item.isDone && item.Dish.categoryId === this.category2
            );
          }
        }
      } else {
        return [];
      }
    },
    // 区域3内容
    orderList3() {
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        // 未划菜
        if (this.type === 0) {
          if (this.category2 === 0) {
            // 全部
            return this.orderList[2].dishes.filter(item => !item.isDone);
          } else {
            return this.orderList[2].dishes.filter(
              item => !item.isDone && item.Dish.categoryId === this.category2
            );
          }
        } else {
          // 划菜
          if (this.category2 === 0) {
            // 全部
            return this.orderList[2].dishes.filter(item => item.isDone);
          } else {
            return this.orderList[2].dishes.filter(
              item => item.isDone && item.Dish.categoryId === this.category2
            );
          }
        }
      } else {
        return [];
      }
    },

    dish1() {
      let dishList = _.sortBy(this.orderList1, item => {
        if (this.sort1 === 'asc') {
          return new Date(item.createdAt).getTime();
        } else {
          return -new Date(item.createdAt).getTime();
        }
      });
      return dishList;
    },

    dish2() {
      let dishList = _.sortBy(this.orderList2, item => {
        if (this.sort1 === 'asc') {
          return new Date(item.createdAt).getTime();
        } else {
          return -new Date(item.createdAt).getTime();
        }
      });
      return dishList;
    },

    dish3() {
      let dishList = _.sortBy(this.orderList3, item => {
        if (this.sort1 === 'asc') {
          return new Date(item.createdAt).getTime();
        } else {
          return -new Date(item.createdAt).getTime();
        }
      });
      return dishList;
    },

    menuList1() {
      const menu = [{ id: 0, name: '全部' }];
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        return menu.concat(this.orderList[0].categories);
      }
      return menu;
    },
    menuList2() {
      const menu = [{ id: 0, name: '全部' }];
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        return menu.concat(this.orderList[1].categories);
      }
      return menu;
    },
    menuList3() {
      const menu = [{ id: 0, name: '全部' }];
      if (Array.isArray(this.orderList) && this.orderList.length > 0) {
        return menu.concat(this.orderList[2].categories);
      }
      return menu;
    },

    showRemark() {
      return this.$store.state.user.remark;
    }
  },
  methods: {
    // 获取订单列表
    async GetOrderList() {
      try {
        return await this.$http.get('/order/shop', {
          params: {
            timestamp: Date.now()
          }
        });
      } catch (error) {}
    },
    // 超时处理
    async GetOverTime() {
      try {
        return await this.$http.get('/setting/overtime');
      } catch (error) {}
    },

    doneDish(data) {
      console.log('划菜：', data.foodName);
      if (!data.isDone) {
        this.$socket.emit('done-dish', data);
      } else {
        this.$confirm({
          title: '提示',
          content: '确定要撤销划菜?',
          onOk: () => {
            this.$socket.emit('undo-dish', data);
          },
          onCancel() {}
        });
      }
    },

    // 点击分类
    checkType(data, dish) {
      if (dish === 1) {
        this.category1 = data.id;
      } else if (dish === 2) {
        this.category2 = data.id;
      } else if (dish === 3) {
        this.category3 = data.id;
      }
    },

    sort(type) {
      switch (type) {
        case 1:
          if (this.sort1 === 'asc') {
            this.sort1 = ' desc';
          } else {
            this.sort1 = 'asc';
          }
          break;
        case 2:
          if (this.sort2 === 'asc') {
            this.sort2 = ' desc';
          } else {
            this.sort2 = 'asc';
          }
          break;
        case 3:
          if (this.sort3 === 'asc') {
            this.sort3 = ' desc';
          } else {
            this.sort3 = 'asc';
          }
          break;
        default:
          break;
      }
    },

    closeScreenFull() {
      this.$store.commit('SET_FULL', false);
      this.$store.commit('SET_CARD1HEIGHT', window.screen.height - 100 - 24);
      this.$store.commit(
        'SET_CARD23HEIGHT',
        (window.screen.height - 100 - 36) / 2
      );
    }
  },
  mounted() {
    let self = this;
    this.$nextTick(() => {
      document.addEventListener('keyup', e => {
        if (e.keyCode === 27) {
          self.closeScreenFull();
        }
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.ant-menu-horizontal {
  border: 0;
  box-shadow: none;
  line-height: 30px;
  white-space: nowrap;
}
.ant-menu-item {
  padding: 0 12px;
  box-sizing: border-box;
  position: relative;
  &.ant-menu-item-selected {
    background-color: #5f79bf;
  }
}
///////////////////////////////////////////////////////////
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .content-left {
    flex: 1;
    padding-left: 12px;
    padding-top: 12px;
    padding-right: 6px;
  }
  .content-right {
    flex: 1;
    padding-left: 6px;
    padding-right: 12px;
    padding-top: 12px;
  }
}
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(63, 72, 105, 1);
  background-color: #3f4869;
}
.card-3 {
  margin-top: 12px;
}
.header {
  height: 54px;
  background-color: #566aa1;
  padding-top: 12px;
  display: flex;
  flex-direction: row;
  .divider {
    margin-left: 12px;
    margin-right: 24px;
    width: 1px;
    height: 30px;
    background-color: #3a4b70;
  }
}
.body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 12px;
  padding-top: 12px;
  //flex: 1;
}
.item {
  height: 30px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: rgba(208, 224, 255, 1);
  padding: 4px 8px;
}

/*webkit内核*/
.scroll_content {
  overflow: auto;
}
.scroll_content::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
.scroll_content::-webkit-scrollbar-button {
  background-color: rgba(0, 0, 0, 0);
}
.scroll_content::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0);
}
.scroll_content::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0);
}
.scroll_content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
}
.scroll_content::-webkit-scrollbar-corner {
  background-color: rgba(0, 0, 0, 0);
}
.scroll_content::-webkit-scrollbar-resizer {
  background-color: rgba(0, 0, 0, 0);
}
</style>