<!--
 * @Description:
 * @LastEditTime: 2022-09-16 16:22:16
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="content">
    <!-- <image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view> -->
  </view>
</template>

<script>
import { appletsLogin } from '@/api/login.js';

export default {
  data() {
    return {
      title: 'Hello',
    };
  },
  onLoad(e) {
    console.log(e)
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('eToken')
    uni.login({
      provider: 'weixin',
      success: function (loginRes) {
        appletsLogin({
          code: loginRes.code,
        })
          .then(res => {
            if (res.token) {
              uni.setStorageSync('userInfo', res);
            }
            if(e.id && e.uid && e.uid === res.id){ // 有合同 && 当前用户是签署方
              uni.navigateTo({
                url: '/pages/switchIdentity/contractDetails?id='+e.id,
              });
            }else{
              uni.reLaunch({
                url: '/pages/tabbar/home',
              })
            }
          })
          .catch(() => {
            uni.reLaunch({
              url: '/pages/tabbar/home',
            });
          })
      },
      fail() {
        uni.reLaunch({
          url: '/pages/tabbar/home',
        });
      },
    });
  },
  methods: {},
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
