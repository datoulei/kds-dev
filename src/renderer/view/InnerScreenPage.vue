<template>
  <div class="content">
    <v-desk :food="order" v-for="order in dish" :key="order.id" />
  </div>
</template>
<script>
import Desk from '@/components/Desk/Desk.vue';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
const testData = [
  {
    id: '6746017381518159539',
    tableName: '1A',
    createdAt: '2019-10-10T03:52:51.000Z',
    data: [
      {
        createdAt: '2019-10-10T03:52:51.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 11,
        isDone: false,
        orderKey: '6746017381518159539',
        remark: 'bula',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T16:46:41.000Z',
        version: 16
      }
    ]
  },
  {
    id: '6746016539570347699',
    tableName: '1A',
    createdAt: '2019-10-10T03:49:34.000Z',
    data: [
      {
        createdAt: '2019-10-14T00:26:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 3,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 4,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 11,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 12,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 13,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 14,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 15,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 16,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T15:53:32.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 17,
        isDone: true,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: 3604,
        updatedAt: '2019-10-12T15:53:32.000Z',
        version: 3
      },
      {
        createdAt: '2019-10-10T03:49:34.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: null,
        foodID: 23080807,
        foodName: '遇见小面',
        id: 18,
        isDone: false,
        orderKey: '6746016539570347699',
        remark: '不辣',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '1A',
        timeCost: null,
        updatedAt: '2019-10-12T11:23:39.000Z',
        version: 2
      }
    ]
  },
  {
    id: '6745701761400442544',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442544',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442544',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442545',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442545',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442545',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442546',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442546',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442546',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442549',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442549',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442549',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442548',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442548',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442548',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442568',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442568',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442568',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442567',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442567',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442567',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442566',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442566',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442566',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442588',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442588',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442588',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  },
  {
    id: '6745701761400442598',
    tableName: '桌台001',
    createdAt: '2019-10-09T07:28:04.000Z',
    data: [
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:43.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 1,
        isDone: true,
        orderKey: '6745701761400442598',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:43.000Z',
        version: 1
      },
      {
        createdAt: '2019-10-09T07:28:04.000Z',
        createdBy: null,
        deletedAt: null,
        doneTime: '2019-10-12T09:40:37.000Z',
        foodID: 23080807,
        foodName: '遇见小面',
        id: 2,
        isDone: true,
        orderKey: '6745701761400442598',
        remark: '',
        shopID: 76258995,
        shopName: '遇见小面(环球虚拟店)',
        tableName: '桌台001',
        timeCost: 4453,
        updatedAt: '2019-10-12T09:40:37.000Z',
        version: 1
      }
    ]
  }
];
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