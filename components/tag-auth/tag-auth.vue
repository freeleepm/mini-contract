<!--
 * @Author: wudi
 * @Date: 2023-08-29 09:44:38
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-12 16:42:50
 * @Description:
-->
<template>
  <view v-if="userInfo">
    <!-- 企业身份 -->
    <template v-if="userInfo.companyId">
      <view v-if="userInfo.companyName" class="tag-auth tag-auth__enterauth flex-ct text-20">
        <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
        企业认证
      </view>
      <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
        <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
        未认证
      </view>
    </template>
    <!-- 个人身份 -->
    <template v-else>
      <view v-if="userInfo.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
        <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
        已实名
      </view>
      <view
        v-else
        class="tag-auth tag-auth__unauth flex-ct text-20"
        @click="userInfo.witnessComparison ? common.navigateTo('/pages/user/personal/CertificationThree?originType=mine') : common.navigateTo('/pages/user/personal/Certification?originType=mine')"

      >
        <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
        未实名
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'tag-auth',
  props: {
    userInfo: {
      default: '',
      type: Object,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.tag-auth {
  box-sizing: border-box;
  padding: 0 10rpx;
  height: 36rpx;
  border-radius: 18rpx;
  border: 1px solid currentColor;
}
.icon-auth {
  margin-right: 4rpx;
  width: 24rpx;
  height: 24rpx;
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
