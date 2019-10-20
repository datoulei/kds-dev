<template>
  <div class="table-card" :style="{'height':tableHeight+'px','width':tableWidth+'px'}">
    <div class="header">
      <span class="title">台号：{{food.tableName}}</span>
      <span>{{ moment(food.createTime).format("HH:mm")}}</span>
    </div>
    <div class="body" :style="{height:bodyHeight+'px'}">
      <v-food
        v-for="foo in food.data"
        :key="foo.id"
        :food="foo"
        :width="cardWidth"
        :height="cardHeight"
      />
    </div>
  </div>
</template>

<script>
import Food from './Food.vue';
import moment from 'moment';
export default {
  props: {
    food: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableWidth: 0, // 桌子宽度
      tableHeight: 0, // 桌子高度
      bodyHeight: 0, // 桌子body高度
      cardWidth: 0, // 小卡片宽度
      cardHeight: 0 // 小卡片高度
    };
  },
  created() {
    // 单个卡片的宽度
    const singleCardWidth = Math.round((window.screen.width - 12 * 8) / 6);

    // 计算桌子卡片宽度
    if (this.food.data.length > 5) {
      this.tableWidth = Math.ceil(this.food.data.length / 5) * singleCardWidth;
    } else {
      this.tableWidth = singleCardWidth;
    }

    //计算桌子卡片高度
    this.tableHeight = Math.round((window.screen.height - 36) / 2);
    // 桌子卡片body高度
    this.bodyHeight = this.tableHeight - 54;

    // 计算菜单小卡片宽高
    this.cardWidth = singleCardWidth - 24;

    this.cardHeight = Math.round((this.bodyHeight - 12 * 6) / 5);
  },
  components: {
    'v-food': Food
  },
  computed: {},
  methods: {
    moment
  }
};
</script>

<style lang="scss" scoped>
.table-card {
  border: 1px solid rgba(63, 72, 105, 1);
  background-color: #0c0d13;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
  margin-left: 6px;
  margin-right: 6px;
}
.header {
  height: 54px;
  background: rgba(58, 75, 112, 1);
  border: 1px solid rgba(86, 106, 161, 1);
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  .title {
    flex: 1;
  }
}
.body {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding-left: 12px;
}
</style>