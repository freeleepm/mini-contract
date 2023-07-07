<template>
  <view class="flex-1">
    <!-- 企业 -->
    <view v-if="info.companyId" class="flex flex-1">
      <image class="img-avatar" src="/static/ImgDefEnterprise.png"></image>
      <view class="flex-1">
        <view class="flex-fs">
          <view class="text-30 color-base bold">
            {{ info.nickname || '未认证用户' }}
          </view>
          <text class="sealCount">
            套餐
            <text class="color-primary">{{ info.companyMealCount || 0 }}</text>
            份
          </text>
        </view>
        <view class="flex-fs">
          <view v-if="info.authentication" class="tag-auth tag-auth__enterauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
            企业认证
          </view>
          <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
            未认证
          </view>
        </view>
        <view class="text-26 color-base" style="margin-top: 12rpx">
          {{ info.companyName || '' }}
        </view>
      </view>
    </view>
    <!-- 个人 -->
    <view v-else class="flex flex-1">
      <image class="img-avatar" :src="info.avatarUrl || '/static/ImgDefAvatar.png'"></image>
      <view class="flex-1">
        <view class="flex-fs">
          <text class="text-30 color-base bold">
            {{ info.nickname || '未认证用户' }}
          </text>
          <text class="sealCount">
            套餐
            <text class="color-primary">{{ info.individualMealCount || 0 }}</text>
            份
          </text>
        </view>
        <view class="flex-fs">
          <view v-if="info.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
            已实名
          </view>
          <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
            未实名
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'userInfo',
  props: {
    info: {
      type: Object,
      default: '',
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.img-avatar {
  flex-shrink: 0;
  margin-right: 16rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
}
.sealCount {
  font-size: 20rpx;
  font-weight: normal;
  margin-left: 12rpx;
}
.icon-change {
  margin-top: 8rpx;
  width: 32rpx;
  height: 32rpx;
}
.icon-auth {
  width: 24rpx;
  height: 24rpx;
  margin-right: 4rpx;
}
.tag-auth {
  box-sizing: border-box;
  margin-top: 8rpx;
  padding: 0 10rpx;
  height: 36rpx;
  border-radius: 18rpx;
  border: 1px solid currentColor;
}

.tag-auth__unauth {
  color: #999999;
}

.tag-auth__auth {
  color: #3277ff;
}

.tag-auth__enterauth {
  color: #ff731d;
}
</style>
