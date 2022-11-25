<!--
 * @Description:
 * @LastEditTime: 2022-09-06 10:57:18
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="seefile">
    <view class="seefile-head">
      <text style="margin-left: 20rpx">签署文件：</text>
      <text>冉旭传媒采购合同.docx</text>
    </view>
  </view>
</template>

<script>
import { imageUrl } from '@/filters/filters.js';
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
  onShow() {
    var ing = imageUrl('4/24051e90-6818-4f6c-908d-6063cafbcfc1.pdf');

    // #ifndef H5
    uni.showLoading({
      title: '请稍等',
    });
    uni.downloadFile({
      url: config.imgUrl + '4/24051e90-6818-4f6c-908d-6063cafbcfc1.pdf',
      success: function (res) {
        var filePath = res.tempFilePath;
        uni.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功');
          },
        });
      },
      complete: function (res) {
        uni.hideLoading();
      },
    });
    // #endif
    // #ifdef H5
    this.common.showToast('请在小程序端打开');
    // #endif
  },
};
</script>

<style lang="scss" scoped>
.seefile {
  width: 100%;
  .seefile-head {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    background-color: #fff;
  }
}
</style>
