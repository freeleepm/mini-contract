<!--
 * @Author: wudi
 * @Date: 2023-12-08 13:58:11
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-08 14:17:24
 * @Description:
-->
<template>
  <view class="page-base">
    <view class="info-box flex-col">
      <image class="icon" src="@/static/no-access.png"></image>
      <view class="title">您不能查看该文件</view>
      <view class="tips">请与发起人确认手机号是否一致</view>
      <navigator hover-class="none" open-type="switchTab" url="/pages/home/index" class="btn">
        返回首页
      </navigator>
    </view>
  </view>
</template>

<script>
import setting from '@/static/config/setting.js';
export default {
  data() {
    return {};
  },
  onShow() {
    uni.setNavigationBarTitle({
      title: setting.appName,
    });
  },
};
</script>

<style lang="scss" scoped>
.page-base {
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
  background: #fff;
  .info-box {
    text-align: center;
    font-size: 24rpx;
    margin-top: 164rpx;
    .icon {
      width: 340rpx;
      height: 232rpx;
    }
    .title {
      margin-top: 72rpx;
      color: #333333;
    }
    .tips {
      margin-top: 26rpx;
      color: #3277ff;
    }
  }
  .btn {
    margin-top: 116rpx;
    width: 360rpx;
    height: 82rpx;
    border-radius: 8rpx;
    background: #3277ff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #ffffff;
  }
}
</style>
