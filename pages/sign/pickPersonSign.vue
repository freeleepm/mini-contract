<!--
 * @Description:
 * @LastEditTime: 2022-09-06 10:56:24
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <view class="tip">以下签名仅供签署人签署文件使用</view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: $page-spacing-base;
  .tip {
    color: $uni-text-color-grey;
  }
}
</style>
