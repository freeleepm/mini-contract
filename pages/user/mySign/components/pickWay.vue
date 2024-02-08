<template>
  <view class="flex-fs list">
    <view class="item" :class="{active: current === item.value}" v-for="(item,i) in list" :key="i" @click="onChange(item)">
      {{ item.name }}
      <view class="icon" v-if="current === item.value">
        <uni-icons type="checkmarkempty" color="#ffffff" size="10"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'list',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      current: this.value,
      list: [
        {
          name: '模板签名',
          value: 1
        },
         {
          name: '手写签名',
          value: 2
        }
      ]
    }
  },
  methods: {
    onChange(e) {
      this.current = e.value
      this.$emit('change', e.value)
    }
  }
};
</script>

<style lang="scss" scoped>
.item{
  line-height: 60rpx;
  border-radius: 6rpx;
  padding: 0 20rpx;
  margin: 0 8rpx;
  font-size: 28rpx;
  background: #F5F5F5;
  position: relative;
  overflow: hidden;
  &.active{
    background: #EBF1FF;
    color: $uni-color-primary;
  }
  .icon{
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28rpx;
    width: 36rpx;
    overflow: hidden;
    uni-icons{
      position: absolute;
      z-index: 1;
      line-height: 0;
      bottom: 10rpx;
      right: 0;
    }
    /deep/ {
        .uni-icons {
          font-size: 18rpx !important;
        }
      }
    &::before{
      position: absolute;
      content: '';
      width: 120%;
      height: 100%;
      background: $uni-color-primary;
      transform: rotate(-45deg) translateY(40%);
    }
  }
}
</style>
