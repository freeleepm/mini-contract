<template>
  <view class="page" v-if="contractData">
    <image src="/static/IconPdf.png" class="icon"></image>
    <view class="name">{{ contractData.name }}.pdf</view>
    <!-- <view class="text-30">463.1K</view> -->
    <view class="box">
      <view class="bold text-32">下载方式</view>
      <view class="text-28 color-grey">将文件分享微信好友</view>
      <button class="text-28" type="primary" @click="share">分享文件</button>
    </view>
  </view>
</template>
<script>
import { templateDetail } from '@/api/file.js';
import userInfoApi from '@/api/api.js';
export default {
  data() {
    return {
      contractId: '',
      contractData: '',
    };
  },
  onLoad(e) {
    if (e.contractId) {
      this.contractId = e.contractId;
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      userInfoApi
        .contractDetails({
          contractId: this.contractId,
        })
        .then(res => {
          this.contractData = res;
        });
    },
    share() {
      const that = this;
      uni.downloadFile({
        url: this.contractData.url,
        filePath: `${wx.env.USER_DATA_PATH}/downFile.pdf`,
        success(res) {
          uni.shareFileMessage({
            filePath: res.filePath,
            fileName: that.contractData.name + '.pdf',
            fail: console.error,
          });
        },
        fail: console.error,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 164rpx 32rpx 64rpx;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    width: 74rpx;
    height: 74rpx;
  }
  .name {
    font-size: 32rpx;
    padding: 24rpx 64rpx;
    text-align: center;
    font-weight: bold;
  }
  .box {
    margin-top: 180rpx;
    text-align: center;
    padding: 80rpx 64rpx;
    border: 1px solid #f1f1f1;
    border-radius: 12rpx;
    button {
      width: 560rpx;
      height: 88rpx;
      line-height: 88rpx;
    }
    .color-grey {
      line-height: 72rpx;
    }
  }
}
</style>
