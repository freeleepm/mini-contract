<template>
  <view class="flex-sb">
    <view
      class="template-box flex-sb"
      @click="$emit('onClick', '/pages/home/contractTemplate/index')"
    >
      <image src="/static/home-icon1.png"></image>
      <view class="flex-1">
        <view class="bold text-30 color-base">合同模板</view>
        <view class="text-24 color-base-minor">各行业合同模板</view>
      </view>
    </view>
    <view class="template-box flex-sb" @click="$emit('onClick', '/pages/home/draft/index')">
      <image src="/static/home-icon2.png"></image>
      <view class="flex-1">
        <view class="bold text-30 color-base">草稿发起</view>
        <view class="text-24 color-base-minor">保存草稿发起签署</view>
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
.template-box {
  height: 160rpx;
  padding-left: 10rpx;
  background: linear-gradient(297deg, #e2e9ff 0%, #c8e4ff 97%);
  box-sizing: border-box;
  position: relative;
  border-radius: 12rpx;
  width: 332rpx;
  &:nth-child(2) {
    background: linear-gradient(240deg, #dbe9ff -42%, #c7ebff 100%);
  }
  image {
    display: block;
    width: 94rpx;
    height: 94rpx;
    margin-right: 12rpx;
  }
  view {
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }
}
</style>
