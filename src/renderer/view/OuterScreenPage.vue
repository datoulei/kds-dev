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
          <a-button @click="uploadOrder">上传</a-button>
        </div>
        <div class="body scroll_content">
          <v-food
            v-for="foo in area1"
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
            :overTime="overTime"
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
            :overTime="overTime"
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
  sockets: {
    // 新菜
    'create-order'(data) {
      console.log('推送菜品 => ', data);
    },
    // 撤单
    'return-order'(data) {
      console.log('取消菜品 => ', data);
    },
    'done-dish-confirm'(data) {
      if (data.code === 0) {
        this.$message.success('划菜成功', 0.5);
      }
    },
    'undo-dish-confirm'(data) {
      if (data.code === 0) {
        this.$message.success('撤销成功', 0.5);
      }
    }
  },

  data() {
    return {
      overTime: {}, // 超时数据
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
    // 初始化
    db.set('orderList', []).write();
    db.set('queryTime', null).write();
    const list = db.get('orderList').value();
    if (!list) {
      this.$store.dispatch('pushOrderList', []);
    } else {
      this.$store.dispatch('pushOrderList', list);
    }

    setInterval(() => {
      this.GetOrderList().then(newOrders => {
        var temp = [];
        newOrders.map(order => {
          for (var i = 0; i < order.foodNumber; i++) {
            temp.push({
              key: v4(),
              isDone: false,
              finishTime: null,
              ...order
            });
          }
        });
        this.$store.dispatch('pushOrderList', temp);
        // 就绪
        ipcRenderer.send('complete', rst, '', 'outer');
      });
    }, 1000);

    // mysql
    this.connectMysql();

    // 超时时间
    this.GetOverTime().then(rst => {
      this.overTime = rst;
      ipcRenderer.send('complete', '', rst, '_outer');
      this.setOverTime(rst);
    });

    // 获取分类
    this.GetCategory().then(categories => {
      this.setCategories(categories);
    });

    // 获取菜品
    this.GetDishes().then(dishes => {
      this.setDishes(dishes);
    });
  },
  beforeDestroy() {},
  computed: {
    ...mapGetters(['getFinishOrder', 'getUnFinishOrder', 'getOrderList']),
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
      'setOverTime',
      'setCategories',
      'setDishes',
      'setUploadList',
      'rmUploadList'
    ]),

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
    connectMysql() {
      connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'q_user',
        password: 'q_user',
        database: 'db_mendian'
      });
      connection.connect(err => {
        if (err) {
          console.log(
            '数据库连接失败!',
            'connect mysql error code:',
            err.code,
            'connect mysql error message:',
            err.fatal
          );
        } else {
          console.log('db连接成功...');
        }
      });
    },

    //=======================================================================
    // 超时处理
    async GetOverTime() {
      try {
        return await this.$http.get('/setting/overtime');
      } catch (error) {}
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
            .subtract(40, 'hour')
            .format('YYYYMMDDHHmmss');
          sql =
            'select orderKey, orderStatus,orderSubType,tableName,foodName,foodKey,foodNumber,foodCancelNumber,unit,createTime from tbl_mendian_order_food where orderStatus=40 and  createTime >=' +
            date;
        } else {
          // 查询上一次执行后的时间段
          sql =
            'select orderKey, orderStatus,orderSubType,tableName,foodName,foodKey,foodNumber,foodCancelNumber,unit,createTime from tbl_mendian_order_food where orderStatus=40 and createTime >= ' +
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

    addUploadOrderList(data) {
      const orderList = this.getOrderList;
      console.log('====orderList:', orderList);
      const orders = orderList.filter(item => item.orderKey === data.orderKey);

      console.log('======orders:', orders);

      const unDone = orders.filter(item => item.isDone === false);
      if (unDone.length === 0) {
        this.setUploadList(orders);
      }
    },

    async uploadOrder() {
      const orderList = this.$store.state.order.uploadOrderList;
      try {
        const rst = await this.$http.post('/order/upload', {
          list: orderList
        });
      } catch (error) {
        console.log(error);
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