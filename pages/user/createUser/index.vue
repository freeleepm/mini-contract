<template>
  <view class="page">
    <view class="title bold">最近签署人</view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="flex-fs item" @click="pick(item)">
        <text class="iconfont icon-person"></text>
        <view class="flex-1">
          <view class="name bold">{{ item.name }}</view>
          <view>
            <text>个人</text>
            <text>{{ item.phone }}</text>
          </view>
        </view>
        <text class="iconfont icon-checked text-primary" v-if="id == item.id"></text>
        <text class="iconfont icon-unCheck" v-else></text>
      </view>
    </view>
    <view class="btn-fixed-box">
      <view class="btn-fixed flex-ct">
        <navigator url="addPerson" hover-class="none" class="btn">自定义创建</navigator>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: '1510178337119035394', name: '杨旭升', phone: '15683857821' },
        { id: '1510178337119035395', name: '张三', phone: '15683857821' },
        { id: '1510178337119035396', name: '蒋不会', phone: '17843508197' },
      ],
      id: '',
    };
  },
  onLoad(e) {
    if (e.id) this.id = e.id

  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.page {
  padding: $page-spacing-base;
  .btn {
    line-height: 84rpx;
    text-align: center;
    color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
  }
  .title {
    font-size: $uni-font-size-lg;
    position: relative;
  }
  .title::before {
    width: 8rpx;
    position: absolute;
    border-radius: 0 4rpx 4rpx 0;
    content: '';
    height: 32rpx;
    top: calc(50% - 16rpx);
    left: -$page-spacing-base;
    background-color: $uni-color-primary;
  }
  .list {
    .item {
      border-bottom: 1px solid $uni-border-color;
      padding: 20rpx 0;
      text {
        color: $uni-text-color-grey;
        margin-right: 20rpx;
      }
      .icon-person {
        font-size: 60rpx;
        color: $uni-text-color-grey;
        margin-right: 10rpx;
      }
      .icon-unCheck,
      .icon-checked {
        font-size: 36rpx;
      }
    }
  }
  .btn-fixed-box {
    height: calc(138rpx + env(safe-area-inset-bottom));
    .btn-fixed {
      .btn {
        width: 90%;
      }
    }
  }
}
</style>
