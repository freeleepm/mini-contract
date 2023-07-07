<template>
  <navigator :url="'/pages/contract/detail/index?id=' + item.id" hover-class="none" class="item">
    <view class="title flex-sb">
      <view class="name flex-1 text-28 bold">
        {{ item.name || '' }}
      </view>
      <view class="tag-status text-26 flex-ct" :class="'status-color-' + item.state">
        {{ item.state | stateHandle }}
      </view>
      <!-- <contractState :state="item.state" type="primary" /> -->
    </view>
    <view class="date-box">
      <view class="text-26 flex">
        <view class="key">发起方</view>
        <view class="val">{{ item.initiatorName || '' }}</view>
      </view>
      <view class="text-26 flex">
        <view class="key">签署方</view>
        <view class="val">{{ item.signers }}</view>
      </view>
      <view class="text-26 flex">
        <view class="key">发起时间</view>
        <view class="val">{{ item.startTime || '' }}</view>
      </view>
      <view class="text-26 flex">
        <view class="key">截止时间</view>
        <view class="val">{{ item.endTime || '' }}</view>
      </view>
    </view>
  </navigator>
</template>

<script>
export default {
  props: {
    item: {
      default: {},
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  overflow: hidden;
  background-color: #ffffff;
  position: relative;
  margin-bottom: 40rpx;
  border-radius: 12rpx;
  .title {
    padding: 28rpx;
    position: relative;
    background-color: #f7f9ff;
    border-bottom: 1px solid rgba(230, 230, 230, 0.5);
    overflow: hidden;
    .name {
      white-space: break-spaces;
      word-break: break-all;
    }
  }

  .date-box {
    padding: 0 28rpx;
    padding-bottom: 28rpx;
    background-color: white;
    border-radius: 0 0 30rpx 30rpx;

    .text-26 {
      margin-top: 29rpx;
      line-height: 37rpx;
    }

    .key {
      flex-shrink: 0;
      width: 146rpx;
      color: #999999;
    }

    .val {
      color: #333333;
      flex: 1;
      word-wrap: break-all;
      text-align: justify;
    }
  }
}
</style>
