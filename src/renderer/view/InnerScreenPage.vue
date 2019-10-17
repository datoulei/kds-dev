<template>
  <div class="content">
    <v-desk :food="order" v-for="order in dish" :key="order.id" />
  </div>
</template>
<script>
import Desk from '@/components/Desk/Desk.vue';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
export default {
  data() {
    return {
      orderList: []
    };
  },
  components: {
    'v-desk': Desk
  },
  created() {},
  beforeDestroy() {
    ipcRenderer.removeAllListeners('getOrderList');
  },
  computed: {
    dish() {
      let dishes = [];
      if (Array.isArray(this.orderList)) {
        this.orderList.map(item => {
          dishes = dishes.concat(item.dishes);
        });

        return this.formatData(dishes);
        //return testData;
      }
      return [];
    }
  },
  methods: {
    formatData(dishes) {
      const temp = _.groupBy(dishes, 'orderKey');
      const arr = [];
      for (var key in temp) {
        arr.push({
          id: key,
          tableName: temp[key][0].tableName,
          createdAt: temp[key][0].createdAt,
          data: temp[key]
        });
      }
      return arr;
    }
  },
  mounted() {
    ipcRenderer.on('getOrderList', (event, data) => {
      this.orderList = data;
    });
    ipcRenderer.once('getOverTime', (event, data) => {
      this.$store.commit('SET_OVERTIME', data);
    });
    ipcRenderer.send('complete', '', '', 'inner');
  }
};
</script>
<style lang="scss" scoped>
.content {
  background-color: #191b1f;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 12px;
  overflow: hidden;
}
</style>