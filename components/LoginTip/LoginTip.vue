<template>
  <view v-if="show">
    <view class="outer-box" v-if="userInfo">
      <view class="unAuth flex-sb flex-1" v-if="!userInfo.authentication">
        <text class="text-28 color-base">
          您还未认证，实名认证后即可
          <text class="bold color-primary">获赠3份合同</text>
        </text>
        <navigator url="/pages/user/personal/Certification" hover-class="none" class="login-btn">
          去认证
        </navigator>
      </view>
      <view class="flex-fs" v-else @click="$refs.checkUserRef.open()">
        <view class="text-28 contract-title">
          <text class="name text-elps">
            {{
              Number(userInfo.identityType) === 1
                ? userInfo.companyName
                : userInfo.nickname || userInfo.phone
            }}
          </text>
          <text class="contract-pages">
            （剩余{{
              Number(userInfo.identityType) === 1
                ? userInfo.companyMealCount || 0
                : userInfo.individualMealCount || 0
            }}份）
          </text>
        </view>
        <image class="arrow-down" src="@/static/arrow-down.png"></image>
      </view>
      <checkUser ref="checkUserRef" :check="false" backType="mine" />
    </view>
    <view class="outer-box" v-else>
      <view>您还未登录，登录后即可使用完整功能。</view>
      <navigator url="/pages/login/login" hover-class="none" class="login-btn">立即登录</navigator>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'LoginTip',
  computed: {
    ...mapState(['userInfo']),
  },
  data() {
    return {
      show: false,
    };
  },
  created() {
    setTimeout(() => {
      this.show = true;
    }, 88);
  },
};
</script>

<style lang="scss" scoped>
.outer-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  background: #f6f9ff;
  color: #343434;
  width: 100%;
  padding: 24rpx 32rpx;
  z-index: 1;
  .unAuth {
  }
  .login-btn {
    border-radius: 26rpx;
    padding: 12rpx 16rpx;
    min-width: 100rpx;
    font-size: 24rpx;
    text-align: center;
    color: #ffffff;
    background: linear-gradient(292deg, #2868df 0%, #649aff 100%, rgba(52, 120, 247, 0) 100%);
    box-shadow: 0px 4rpx 12rpx 0px rgba(52, 120, 247, 0.24);
  }
  .contract-title {
    font-size: 28rpx;
    font-weight: 600;
    display: flex;
    .name {
      display: block;
      max-width: 450rpx;
    }
    .contract-pages {
      display: block;
      font-weight: 200;
    }
  }

  .arrow-down {
    width: 16rpx;
    height: 12rpx;
  }
}
</style>