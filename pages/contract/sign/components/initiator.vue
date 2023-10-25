<!-- 发起方信息 -->
<template>
  <view class="group">
    <text class="text-26 color-grey-minor">发起方</text>
    <view class="row flex">
      <view class="flex-1">
        <userInfo :info="userInfo" />
      </view>
      <view class="flex-col" @click="$refs.checkUserRef.open()">
        <image class="icon-change" src="@/static/IconCheckout.png"></image>
        <view class="text-24 color-base-minor">更改</view>
      </view>
    </view>
    <checkUser ref="checkUserRef" backType="sign" />
  </view>
</template>

<script>
import { info } from '@/api/login.js';
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(['userInfo']),
  },
};
</script>
<style scoped>
.icon-change {
  margin-top: 8rpx;
  width: 32rpx;
  height: 32rpx;
}
</style>
