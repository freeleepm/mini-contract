<!--
 * @Description:
 * @LastEditTime: 2022-09-09 15:03:27
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="identity">
    <view class="flex-sb text-32">
      <view class="">取消</view>
      <view class="">切换身份</view>
      <view class="">确定</view>
    </view>
    <view class="head1">
      <view class="head1-div" @click="identitySwitching('', userInfo)">
        <view class="div-text">
          <view class="iconfont icon-wode text">
            <view
              class="iconfont icon-checked init"
              :class="{ col: userInfo.authentication }"
            ></view>
          </view>
        </view>
        <view class="div-text1">
          <view class="text1-name1">
            {{ userInfo.authentication == true ? userInfo.nickname || '' : '未认证用户' }}
          </view>
          <view class="text1-name2">
            <text class="name2-text">个人</text>
            <text class="name2-text">{{ userInfo.phone || '' }}</text>
          </view>
        </view>

        <view class="div-text2" v-if="!userInfo.companyId">
          <view class="text2-identity">当前身份</view>
        </view>
      </view>

      <view
        class="head1-div"
        v-for="(item, index) in contract"
        :key="index"
        @click="identitySwitching(item.companyId, item)"
      >
        <view class="div-text">
          <view class="iconfont icon-gongsi text">
            <view
              class="iconfont icon-checked init"
              :class="{ col: item.authentication == 1 }"
            ></view>
          </view>
        </view>
        <view class="div-text1">
          <view class="text1-name1">
            {{ item.alias || '' }}
          </view>
          <view class="text1-name2">
            <text class="name2-text">企业</text>
            <text class="name2-text">{{ userInfo.nickname || '' }}</text>
            <text class="name2-text">经办人</text>
            <text class="name2-text">{{ userInfo.phone || '' }}</text>
          </view>
        </view>

        <view class="div-text2" v-if="item.companyId && item.companyId === userInfo.companyId">
          <view class="text2-identity">当前身份</view>
        </view>
      </view>
    </view>
    <!-- 尾部 -->
    <view class="sign-out">
      <button v-if="canBack" class="signout1" @click="goMessage('/pages/tabbar/home')">取消</button>
      <!-- <view class="signout2">

			</view> -->
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';

export default {
  data() {
    return {
      realname: true, //身份判断
      userInfo: {},
      contract: [],
      type: 'center',
      msgType: 'success',
      messageText: '这是一条成功提示',
      canBack: true,
    };
  },
  onLoad(e) {
    if (e.canBack == 1) this.canBack = false;
    // #ifdef MP-WEIXIN
    wx.hideHomeButton();
    // #endif
  },
  onShow() {
    userInfoApi.personalInformation().then(data => {
      console.log(data);
      this.userInfo = data;
    });

    userInfoApi
      .enterpriseList({
        pageNum: 1,
        pageSize: 999,
      })
      .then(data => {
        console.log(data, 'data');
        this.contract = data.rows;
      });
  },
  methods: {
    identitySwitching(companyId, list) {
      var that = this;
      if (list.authentication == 1) {
        if (
          (list.id == this.userInfo.id && list.companyId) ||
          (this.userInfo.companyId != list.companyId && list.id != this.userInfo.id)
        ) {
          userInfoApi.IdentitySwitching(companyId).then(data => {
            console.log(data, 'data');
            this.userInfo = data;
            uni.showToast({
              title: '切换身份成功',
              duration: 2000,
            });
            setTimeout(() => {
              if (that.canBack) {
                uni.navigateBack({
                  delta: 1,
                });
              } else {
                uni.reLaunch({
                  url: '/pages/tabbar/home',
                });
              }
            }, 800);
          });
        }
      } else {
        this.messageToggle('warn', `个人或企业实名认证未完成，请先实名认证`);
      }
    },
    messageToggle(type, list) {
      this.msgType = type;
      this.messageText = list;
      this.$refs.message.open();
    },
    liasdasd() {
      if (this.userInfo.authentication) {
        this.navigateTo('/pages/company/create');
      } else {
        this.messageToggle('warn', `个人或企业实名认证未完成，请先实名认证`);
      }
    },
    navigateTo(url) {
      this.common.navigateTo(url);
    },
    goMessage(rul) {
      uni.navigateBack({
        delta: 1,
      });
    },
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
.identity {
  background-color: #f9f9f9;
  position: relative;
  .identity-head {
    width: 100%;
    position: absolute;
    bottom: 180rpx;
    .head {
      height: 100rpx;
      background-color: #fff;
      margin-bottom: 5rpx;
      .head-text1 {
        font-weight: bold;
        line-height: 100rpx;
        margin-left: 40rpx;
      }
      .head-text2 {
        color: $uni-color-primary;
        font-size: 24rpx;
        position: absolute;
        top: 20rpx;
        right: 20rpx;
      }
    }
    .head1 {
      max-height: 600rpx;
      background-color: #fff;
      overflow: hidden;
      overflow-y: scroll;
      .head1-div {
        height: 100rpx;
        background-color: #fff;
        margin-bottom: 10rpx;
        display: flex;
        .div-text1 {
          width: 480rpx;
          overflow: hidden;
          margin-left: 20rpx;
          .text1-name1 {
            margin-top: 20rpx;
            font-size: 28rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text1-name2 {
            font-size: 24rpx;
            color: $uni-text-color-grey;
            .name2-text {
              margin-right: 10rpx;
            }
          }
        }
        .div-text2 {
          width: 120rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .text2-identity {
            font-size: 20rpx;
            color: #fff;
            background-color: $uni-color-primary;
            border-radius: 20rpx;
            padding: 3rpx;
          }
        }
        .div-text {
          width: 100rpx;
          height: 100rpx;
          margin-left: 40rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .text {
            color: $uni-text-color-grey;
            font-size: 60rpx;
            position: relative;
            .col {
              color: $uni-color-success;
            }
            .init {
              width: 20rpx;
              height: 20rpx;
              position: absolute;
              bottom: 5rpx;
              right: -5rpx;
            }
          }
        }
      }
    }
  }
  .sign-out {
    position: absolute;
    width: 100%;
    height: 160rpx;
    bottom: 0;
    left: 0;

    .signout1 {
      width: 100%;
      height: 80rpx;
      background-color: #fff;
      color: $uni-text-color-grey;
      border-radius: 5px;
      margin-bottom: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .signout2 {
      width: 100%;
      height: 70rpx;
      background-color: #fff;
    }
  }
}
</style>
