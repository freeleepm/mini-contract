<template>
  <view class="card flex-fs">
    <image src="/static/auth-icon.png" class="icon"></image>
    <view class="text">
      您还未认证，实名认证后即可
      <text class="bold">获赠3份合同</text>
    </view>
    <navigator url="/pages/user/personal/Certification" hover-class="none" class="btn">
      去认证
    </navigator>
    <image src="/static/auth-icon.png" class="bg"></image>
  </view>
</template>

<script></script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 80rpx;
  border-radius: 12rpx;
  padding: 0 18rpx;
  background: linear-gradient(277deg, #3458eb 0%, #2a97dc 100%);
  position: relative;
  overflow: hidden;
  margin-top: 24rpx;
  margin-bottom: -32rpx;
  .icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 12rpx;
  }
  .text {
    color: white;
    font-size: 24rpx;
    flex: 1;
  }
  .btn {
    background: linear-gradient(116deg, #fff2d0 11%, #e9c896 72%);
    color: #7a4100;
    font-size: 26rpx;
    width: 120rpx;
    text-align: center;
    line-height: 48rpx;
    border-radius: 24rpx;
    position: relative;
    z-index: 1;
  }
  .bg {
    width: 132rpx;
    height: 132rpx;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 54rpx;
    opacity: 0.1;
  }
}
</style>
