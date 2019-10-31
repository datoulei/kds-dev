<template>
  <div class="content">
    <v-desk :food="order" v-for="order in orderList" :key="order.key" />
  </div>
</template>
<script>
import Desk from '@/components/Desk/Desk.vue';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      orderList: []
    };
  },
  components: {
    'v-desk': Desk
  },
  created() {
    this.getOverTime();
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners('getOrderList');
  },
  computed: {},
  methods: {
    ...mapActions(['getOverTime']),
    formatData(dishes) {
      const temp = _.groupBy(dishes, 'orderKey');
      const arr = [];
      for (var key in temp) {
        arr.push({
          id: key,
          tableName: temp[key][0].tableName,
          createTime: temp[key][0].createTime,
          orderSubType: temp[key][0].orderSubType,
          data: temp[key]
        });
      }
      // [
      //   {id:0,tableName:'A1',createTime:201910202240,data:[{}]}
      // ]
      return arr.filter(item => {
        const finish = item.data.filter(
          _item => !_item.isDone && !_item.isCancel
        );
        if (finish.length !== 0) {
          return {
            item
          };
        }
      });
    }
  },
  mounted() {
    ipcRenderer.on('getOrderList', (event, data) => {
      if (Array.isArray(data)) {
        this.orderList = this.formatData(data);
      }
    });
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