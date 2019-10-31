<template>
  <div class="content scroll_content">
    <div class="content-left">
      <div class="card" :style="{'height':card1Height+'px'}">
        <div class="header">
          <span style="margin-left:12px;">
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="[0]">
              <a-menu-item v-for="item in menu[0].list" :key="item.id" @click="checkType(item,1)">
                <div class="item">{{ item.name}}</div>
              </a-menu-item>
            </a-menu>
          </span>
          <div class="divider"></div>
          <div class="item" @click="sort(1)">时间排序</div>
        </div>
        <div class="body scroll_content">
          <v-food
            v-for="foo in area1"
            :key="foo.id"
            :food="foo"
            :width="width"
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
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="[0]">
              <a-menu-item v-for="item in menu[1].list" :key="item.id" @click="checkType(item,2)">
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
            v-for="foo in area2"
            :key="foo.id"
            :food="foo"
            :width="width"
            :showRemark="showRemark"
            @click.native="doneDish(foo)"
          />
        </div>
      </div>
      <div class="card card-3" :style="{'height':card23Height+'px'}">
        <div class="header">
          <span style="margin-left:12px;">
            <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="[0]">
              <a-menu-item v-for="item in menu[2].list" :key="item.id" @click="checkType(item,3)">
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
            v-for="foo in area3"
            :key="foo.id"
            :food="foo"
            :width="width"
            :showRemark="showRemark"
            @click.native="doneDish(foo)"
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
import mysql from 'mysql';
import { mapState, mapActions, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import db from '../../db';

var connection = null;
var timer;
export default {
  data() {
    return {
      currentCategory1: 0,
      currentCategory2: 0,
      currentCategory3: 0,
      sort1: 'desc',
      sort2: 'desc',
      sort3: 'desc'
    };
  },
  components: {
    'v-food': Food
  },
  created() {
    // 获取超时配置信息
    this.getOverTime();

    // 初始化(打包必须注释一下两行)
    //db.set('orderList', []).write();
    //db.set('queryTime', null).write();

    // mysql
    this.connectMysql().then(rst => {
      if (rst) {
        // 读取本地存储的数据
        this.readLocalOrderList();

        // 查询数据库新增订单
        this.queryOrder();

        // 定时读取新增订单
        setInterval(() => {
          this.queryOrder();
        }, 10000);

        // 定时上传已完成的订单,5秒后上传退单的数据
        setInterval(() => {
          this.uploadOrder();
          setTimeout(() => {
            this.cancelRemoteOrder();
          }, 5000);
        }, 60000);

        // 获取分类
        this.GetCategory().then(categories => {
          this.setCategories(categories);
        });

        // 获取菜品
        this.GetDishes().then(dishes => {
          this.setDishes(dishes);
        });
      }
    });
  },
  beforeDestroy() {},
  computed: {
    ...mapGetters(['getFinishOrder', 'getUnFinishOrder', 'getOrderList']),
    // 小卡片的宽
    width() {
      const width = (window.screen.width - 36) / 2;
      return Math.ceil((width - 42) / 4);
      // return Math.ceil((width - 48) / 5);
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

    //是否显示备注
    showRemark() {
      return this.$store.state.user.remark;
    },

    // 区域中包含对应的分类
    menu() {
      return this.$store.getters.areaCategories;
    },

    area1() {
      if (this.type === 0) {
        return this.build(
          this.getUnFinishOrder[0],
          this.currentCategory1,
          this.sort1
        );
      } else {
        return this.build(
          this.getFinishOrder[0],
          this.currentCategory1,
          this.sort1
        );
      }
    },
    area2() {
      if (this.type === 0) {
        return this.build(
          this.getUnFinishOrder[1],
          this.currentCategory2,
          this.sort2
        );
      } else {
        return this.build(
          this.getFinishOrder[1],
          this.currentCategory2,
          this.sort2
        );
      }
    },
    area3() {
      if (this.type === 0) {
        return this.build(
          this.getUnFinishOrder[2],
          this.currentCategory3,
          this.sort3
        );
      } else {
        return this.build(
          this.getFinishOrder[2],
          this.currentCategory3,
          this.sort3
        );
      }
    }
  },
  methods: {
    ...mapActions([
      'setOrderList',
      'pushOrderList',
      'setCategories',
      'setDishes',
      'setUploadList',
      'rmUploadList',
      'clearUploadList',
      'updateOrderList',
      'getOverTime'
    ]),
    // 读取本地存储的数据
    readLocalOrderList() {
      const list = db.get('orderList').value();
      if (!list) {
        this.$store.dispatch('pushOrderList', []);
      } else {
        this.$store.dispatch('pushOrderList', list);
      }
    },

    // 查询哗啦啦订单
    queryOrder() {
      this.GetOrderList().then(newOrders => {
        var temp = [];
        newOrders.map(order => {
          if (order.foodCancel > 0) {
            for (var i = 0; i < order.foodCancelNumber; i++) {
              temp.push({
                key: v4(),
                isDone: false,
                isCancel: true,
                finishTime: null,
                ...order
              });
            }
          } else {
            for (var i = 0; i < order.foodNumber; i++) {
              temp.push({
                key: v4(),
                isDone: false,
                isCancel: false,
                finishTime: null,
                ...order
              });
            }
          }
        });
        this.$store.dispatch('pushOrderList', temp);
      });

      // 退单
      setTimeout(() => {
        this.getCancelOrderList().then(rst => {
          this.updateOrderList(rst);
        });
      }, 2000);
    },

    // 构建订单列表格式
    build(orders, currentCategory, sort) {
      const order = orders.filter(item => {
        if (currentCategory === 0) {
          return true;
        } else {
          return item.categoryId === currentCategory;
        }
      });

      return _.sortBy(order, item => {
        if (sort === 'asc') {
          return item.createTime;
        } else {
          return -item.createTime;
        }
      });
    },

    // 划菜、撤销划菜
    doneDish(data) {
      console.log('划菜：', data.foodName);
      if (!data.isDone) {
        this.setOrderList(data);
        this.addUploadOrderList(data);
      } else {
        this.$confirm({
          title: '提示',
          content: '确定要撤销划菜?',
          onOk: () => {
            this.setOrderList(data);
            this.rmUploadList(data);
            this.cancelUploadOrder(data);
            //this.$socket.emit('undo-dish', data);
          },
          onCancel() {}
        });
      }
    },

    // 点击分类
    checkType(data, dish) {
      if (dish === 1) {
        this.currentCategory1 = data.id;
      } else if (dish === 2) {
        this.currentCategory2 = data.id;
      } else if (dish === 3) {
        this.currentCategory3 = data.id;
      }
    },

    // 排序
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

    // 关闭全屏
    closeScreenFull() {
      this.$store.commit('SET_FULL', false);
      this.$store.commit('SET_CARD1HEIGHT', window.screen.height - 100 - 24);
      this.$store.commit(
        'SET_CARD23HEIGHT',
        (window.screen.height - 100 - 36) / 2
      );
    },

    // 连接mysql
    async connectMysql() {
      const config = await this.getConfig();
      return new Promise((resolve, reject) => {
        connection = mysql.createConnection({
          host: config.host,
          port: `${config.port}`,
          user: config.username,
          password: config.password,
          database: 'db_mendian'
        });

        connection.connect(err => {
          if (err) {
            this.$message.error('数据库连接失败,error code:' + err.code, 60);
            resolve(false);
          } else {
            console.log('db连接成功...');
            resolve(true);
          }
        });
      });
    },

    // 获取分类
    async GetCategory() {
      try {
        return await this.$http.get('/categories');
      } catch (error) {}
    },

    //获取所有菜品
    async GetDishes() {
      try {
        return await this.$http.get('/dishes', {
          params: {
            all: true
          }
        });
      } catch (error) {}
    },

    // 查询订单数据
    async GetOrderList() {
      return new Promise((resolve, reject) => {
        const queryTime = db.get('queryTime').value();
        let sql = '';
        if (!queryTime) {
          //第一次启动，查询四个小时前
          const date = dayjs()
            .subtract(30, 'minute')
            .format('YYYYMMDDHHmmss');
          sql =
            'SELECT f.orderKey,f.orderStatus,f.orderSubType,f.tableName,f.foodName,f.foodKey,f.foodNumber,f.foodCancelNumber,f.unit,f.cancelTime,f.itemKey,p.createTime ' +
            'FROM tbl_mendian_order_food f LEFT JOIN	tbl_mendian_order_pay p ON f.orderKey = p.orderKey ' +
            'WHERE f.orderStatus = 40 AND p.createTime >= ' +
            date;
        } else {
          // 查询上一次执行后的时间段
          sql =
            'SELECT f.orderKey,f.orderStatus,f.orderSubType,f.tableName,f.foodName,f.foodKey,f.foodNumber,f.foodCancelNumber,f.unit,f.cancelTime,f.itemKey,p.createTime ' +
            'FROM tbl_mendian_order_food f LEFT JOIN	tbl_mendian_order_pay p ON f.orderKey = p.orderKey ' +
            'WHERE f.orderStatus = 40 AND p.createTime >= ' +
            queryTime;
        }

        db.set('queryTime', dayjs().format('YYYYMMDDHHmmss')).write();

        connection.query(sql, function(err, rows, fields) {
          if (err) {
            console.log('dishes查询错误：', err.fatal);
          } else {
            console.log('查询成功...');
            resolve(rows);
          }
        });
      });
    },

    // 查询撤销订单
    async getCancelOrderList() {
      return new Promise((resolve, reject) => {
        const date = dayjs()
          .subtract(2, 'hour')
          .format('YYYYMMDDHHmmss');
        const sql =
          'SELECT f.orderKey,f.orderStatus,f.orderSubType,f.tableName,f.foodName,f.foodKey,f.foodNumber,f.foodCancelNumber,f.unit,f.cancelTime,f.itemKey,p.createTime ' +
          'FROM tbl_mendian_order_food f LEFT JOIN	tbl_mendian_order_pay p ON f.orderKey = p.orderKey ' +
          'WHERE f.cancelTime >= ' +
          date;

        connection.query(sql, function(err, rows, fields) {
          if (err) {
            console.log('撤销订单查询错误：', err.fatal);
          } else {
            console.log('撤销查询成功...');
            resolve(rows);
          }
        });
      });
    },

    async cancelRemoteOrder() {
      const cancelOrderList = await this.getCancelOrderList();
      if (cancelOrderList.length === 0) {
        return;
      }
      try {
        await this.$http.post('/order/cancel', {
          list: cancelOrderList
        });
      } catch (error) {}
    },

    // 往待上传的订单列表中添加数据
    addUploadOrderList(data) {
      const orderList = this.getOrderList;
      const orders = orderList.filter(item => item.orderKey === data.orderKey);
      const unDone = orders.filter(item => item.isDone === false);
      if (unDone.length === 0) {
        this.setUploadList(orders);
      }
    },

    // 推送已完成的订单
    async uploadOrder() {
      const orderList = this.$store.state.order.uploadOrderList;

      try {
        if (orderList.length === 0) {
          return;
        }
        const rst = await this.$http.post('/order/upload', {
          list: orderList
        });
        this.$message.success('订单上传成功');
        this.clearUploadList();
      } catch (error) {
        console.log(error);
      }
    },

    // 撤销划菜取消远程完成的订单
    async cancelUploadOrder(data) {
      try {
        const rst = await this.$http.post('/order/undo', {
          orderKey: data.orderKey
        });
      } catch (error) {
        console.log(error);
      }
    },

    async getConfig() {
      try {
        const rst = await this.$http.get('/setting/config');
        if (!rst) {
          return {
            host: '127.0.0.1',
            port: '3306',
            username: 'q_user',
            password: 'q_user'
          };
        } else {
          return rst;
        }
      } catch (error) {
        return {
          host: '127.0.0.1',
          port: '3306',
          username: 'q_user',
          password: 'q_user'
        };
      }
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