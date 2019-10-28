<template>
  <div class="wrapper">
    <div
      :class="['food-card',foodColor] "
      :style="{'width':width+'px','height':height+'px','background-color':color}"
    >
      <div class="header">
        <span class="order">{{ food.tableName }}</span>
        <span class="time">{{time}}分钟</span>
      </div>
      <div class="body">
        <div class="name">{{ food.foodName }}</div>
        <div class="remark" v-if="showRemark===true">备注：{{ food.unit }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';
export default {
  props: {
    food: { type: Object, required: true },
    width: { type: Number, required: false },
    height: { type: Number, required: false },
    overTime: { type: Object, required: true },
    showRemark: { type: Boolean, required: false }
  },

  data() {
    return {
      color: '#FFF'
    };
  },
  computed: {
    ...mapGetters(['currentTime']),
    time() {
      try {
        return this.currentTime.diff(
          dayjs(`${this.food.createTime}`, 'YYYYMMDDHHmmss'),
          'minute'
        );
      } catch (error) {
        return 0;
      }
    },
    foodColor() {
      if (
        this.time >= this.overTime.halfTime &&
        this.time < this.overTime.allTime
      ) {
        this.color = this.overTime.halfColor;
        return `half-time`;
      } else if (this.time >= this.overTime.allTime) {
        this.color = this.overTime.allColor;
        return `full-time`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: stretch;
  padding-right: 6px;
  padding-bottom: 6px;
  //border: 1px solid blue;
}
.food-card {
  flex: 1;
  border: 1px solid gray;
  background-color: #fff;
  border-radius: 4px;

  .body {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    .name {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      color: rgba(25, 27, 31, 1);
      line-height: 24px;
    }
    .num {
      font-size: 16px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 24px;
    }
  }

  &.half-time {
    //background-color: #ffa90a;
    .body {
      .name,
      .num {
        color: #361c03;
      }
    }
    .remark {
      color: #361c03;
    }
  }
  &.full-time {
    color: #fff;
    //background-color: #ff2424;
    .body {
      .name,
      .num {
        color: #fff;
      }
    }
    .remark {
      color: #fff;
    }
  }

  .remark {
    font-size: 12px;
    font-weight: 400;
    color: rgba(112, 117, 125, 1);
    line-height: 16px;
    margin-top: 8px;
  }
}
.header {
  background-color: #3d4a6b;
  width: 100%;
  height: 34px;
  align-items: center;
  justify-items: center;
  display: flex;
  padding: 0 8px;
  .order {
    font-size: 20px;
    font-weight: normal;
    color: #fff;
    flex: 1;
  }
  .time {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
  }
}
</style>