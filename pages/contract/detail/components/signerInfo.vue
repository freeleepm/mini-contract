<template>
  <view class="info-box flex flex-1">
    <image v-if="item.signType === 2" class="img-avatar" src="/static/ImgDefEnterprise.png"></image>
    <image v-else class="img-avatar" :src="item.avatarUrl || '/static/ImgDefAvatar.png'"></image>
    <view class="flex-1">
      <view class="flex-sb" style="margin-bottom: 10rpx">
        <view class="text-28 color-base bold">
          {{ item.userName || '--' }}
        </view>
        <contractState :state="item.state" />
      </view>

      <view class="text-28 color-base-minor">
        {{ item.phone || '--' }}
      </view>
      <view v-if="item.signType === 2" class="text-enterprise text-26 color-base">
        {{ item.companyName || '' }}
      </view>

      <view v-if="item.state === 1" class="text-enterprise text-26 color-base-minor">
        签署时间：{{ item.gmtSign || '' }}
      </view>
      <view v-if="item.state === 2" class="text-enterprise text-26 color-base-minor">
        拒签时间：{{ item.gmtSign || '' }}
      </view>
      <view v-if="item.state === 5" class="text-enterprise text-26 color-base-minor">
        截止时间：{{ data.endTime || '' }}
      </view>

      <view class="row-mark flex" v-if="!item.asInitiator && item.result && item.state === 2">
        <uni-icons
          class="icon-help-filled"
          type="help-filled"
          size="16"
          color="#FF731D"
        ></uni-icons>
        <view class="text-24">拒签原因: {{ item.result || '' }}</view>
      </view>

      <view class="row-mark flex" v-if="item.asInitiator && item.result && item.state === 3">
        <uni-icons
          class="icon-help-filled"
          type="help-filled"
          size="16"
          color="#FF731D"
        ></uni-icons>
        <view class="text-24">撤销原因: {{ item.result || '' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'signerInfo',
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  margin-top: 30rpx;
  .img-avatar {
    flex-shrink: 0;
    margin-right: 16rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 8rpx;
  }

  .text-enterprise {
    margin-top: 16rpx;
  }
  .row-mark {
    margin-top: 20rpx;
    padding: 16rpx;
    background: #f5f5f5;
    border-radius: 8rpx;

    .icon-help-filled {
      width: 24rpx;
      margin-right: 16rpx;
      position: relative;
      top: -2rpx;
    }

    .text-24 {
      color: #ff731d;
    }
  }
}
</style>
