<template>
  <div
    :class="['food-card',foodColor] "
    :style="{'width':width+'px',height:height+'px', 'background-color': bgcolor}"
  >
    <div class="row">
      <div :class="['name',line]">
        {{ food.foodName }}
        <span v-if="food.type">-{{food.type}}</span>
      </div>
      <div class="num">x1</div>
    </div>
    <div class="footer">
      <span :class="['remark',line]">备注：{{ food.unit }}</span>
      <span v-if="food.isDone" class="desc">已划菜</span>
      <span v-else-if="food.isCancel=== true" class="desc">已撤销</span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapGetters } from 'vuex';

export default {
  props: {
    food: { type: Object, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },

  data() {

    return {};
  },
  created() {},
  computed: {
    ...mapGetters(['currentTime', 'overTime']),
    diffTime() {
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
      if (!this.overTime) {
        return ' ';
      }
      if (
        this.diffTime >= this.overTime.halfTime &&
        this.diffTime <= this.overTime.allTime
      ) {
        return `half-time`;
      } else if (this.diffTime > this.overTime.allTime) {
        return `full-time`;
      }
    },

    bgcolor() {
      if (!this.overTime) {
        return '#FFF';
      }
      if (
        this.diffTime >= this.overTime.halfTime &&
        this.diffTime < this.overTime.allTime
      ) {
        return this.overTime.halfColor;
      } else if (this.diffTime >= this.overTime.allTime) {
        return this.overTime.allColor;
      } else {
        return '#FFF';
      }
    },

    line() {
      if (this.food.isDone) {
        return 'line';
      } else {
        if (this.food.isCancel) {
          return 'line';
        } else {
          return 'normal';
        }
      }
    }
  },

  methods: {}

};
</script>

<style lang="scss" scoped>
.line {
  text-decoration: line-through;
  text-decoration-style: double;
  text-decoration-color: black;
}
.normal {
}

.food-card {
  border: 1px solid gray;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 10px 15px;
  margin-top: 12px;
  & + .food-card {
    margin-top: 12px;
  }
  &.half-time {
    background-color: #ffa90a;
    .row {
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
    background-color: #ff2424;
    .row {
      .name,
      .num {
        color: #fff;
      }
    }
    .remark {
      color: #fff;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    .name {
      flex: 1;
      font-size: 18px;
      font-weight: 600;
      color: rgba(25, 27, 31, 1);
      line-height: 24px;
    }
    .num {
      font-size: 18px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 24px;
    }
  }
  .footer {
    font-size: 12px;
    font-weight: 400;
    color: rgba(112, 117, 125, 1);
    line-height: 16px;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
  }
  .remark {
    display: flex;
    flex: 1;
  }
  .desc {
    display: flex;
    font-size: 15px;
    font-weight: 600;
    color: rgba(25, 27, 31, 1);
  }
}
</style>