<template>
  <view class="template-box flex-sb" @click="$emit('onClick')">
    <image src="/static/templateBg.png" mode="aspectFill"></image>
    <text class="bold text-30 color-base">合同模板</text>
    <view class="flex-fs">
      <text class="text-24 color-base-minor">各行业合同模板</text>
      <uni-icons type="right" color="#666" size="14"></uni-icons>
    </view>
  </view>
</template>

<script></script>

<style lang="scss" scoped>
.template-box {
  height: 160rpx;
  padding: 0 32rpx 0 170rpx;
  background-color: #d8e5ff;
  border-radius: 12rpx 12rpx 12rpx 12rpx;
  margin-top: 32rpx;
  box-sizing: border-box;
  position: relative;
  image {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  text,
  view {
    position: relative;
    z-index: 1;
  }
  .text-24 {
    margin-right: 10rpx;
  }
}
</style>
