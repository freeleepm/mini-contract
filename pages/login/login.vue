<!--
 * @Description:
 * @LastEditTime: 2022-09-09 19:39:27
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <view class="top-box">
      <image src="../../static/ImgLogo.png" mode="widthFix" class="logo"></image>
    </view>
    <view v-if="type === 1" class="btn-box">
      <button
        type="default"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        class="btn-primary"
      >
        <image class="icon-wechat" src="@/static/IconWeChat.png"></image>
        微信授权登录
      </button>
      <view class="btn-cancel" @click="type = 2">手机号码登录</view>
      <view class="text-28 flex-ct">
        登录即表示同意
        <navigator class="text-link" hover-class="none" url="/pages/user/Privacy">《一合通服务协议和隐私政策》</navigator>
      </view>
    </view>
    <view v-if="type === 2" class="form-box">
      <view class="form-item flex-fs">
        <image src="@/static/IconPhone.png" class="icon-phone"></image>
        <input
          type="number"
          v-model="form.phone"
          placeholder="11位手机号"
          placeholder-class="place"
          class="flex-1"
        />
      </view>

      <view class="flex-sb" style="margin: 12rpx 0 30rpx">
        <view class="form-item flex-fs flex-1" style="margin: 0">
          <image src="@/static/IconAuth.png" class="icon-auth"></image>
          <input
            type="text"
            v-model="form.verificationCode"
            placeholder="短信验证码"
            placeholder-class="place"
            class="flex-1"
          />
          <view :disabled="disabled" :class="{ disabled }" @click="getCode" class="btn-vice">
            {{ btnText }}
          </view>
        </view>
      </view>
      <view class="btn btn-primary flex-ct" :class="{ disabled: disabledNext }" @click="submit">
        下一步
      </view>
      <view class="text-28 flex-ct">
        登录即表示同意
        <navigator class="text-link" hover-class="none" url="/pages/user/Privacy">
          《一合通服务协议和隐私政策》
        </navigator>
      </view>
      <!-- #ifdef MP-WEIXIN -->
      <view class="other">
        <view class="flex-ct">
          <view class="line"></view>
          <text class="text-28">一键登录</text>
          <view class="line"></view>
        </view>
        <button
          class="flex-ct box-wechat"
          type="default"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >
          <image class="img-wechat" src="@/static/ButtonWeChat.png"></image>
          <!-- <button
            type="default"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          ></button> -->
        </button>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
var that,
  timer = null,
  fastClick = true;
import reg from '@/common/reg.js';
import { login, getCode, loginBySms, appletsLogin, bind } from '@/api/login.js';
export default {
  data() {
    return {
      passwordVisible: false,
      form: {
        password: '',
        phone: '',
        verificationCode: '',
      },
      disabled: false,
      btnText: '获取验证码',
      type: 1,
      jumpSeconds: 5,
    };
  },
  computed: {
    disabledNext() {
      return !this.form.phone || this.form.verificationCode.length !== 6;
    },
  },
  onShow() {
    this.form.phone = uni.getStorageSync('phone');
  },
  onLoad(e) {
    that = this;
    fastClick = true;
    if (e.logout != 1) {
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          appletsLogin({
            code: loginRes.code,
          }).then(res => {
            if (res.token) {
              uni.setStorageSync('userInfo', res);
              uni.reLaunch({
                url: '/pages/tabbar/home',
              });
            }
          });
        },
      });
    }
  },
  methods: {
    getPhoneNumber(e) {
      // 获取手机号
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        if (!fastClick) return;
        fastClick = false;

        uni.showLoading();

        uni.login({
          provider: 'weixin',
          fail() {
            fastClick = true;
          },
          success: function (loginRes) {
            appletsLogin({
              code: loginRes.code,
            })
              .then(res => {
                fastClick = true;
                if (res.token) {
                  uni.setStorageSync('userInfo', res);
                  uni.reLaunch({
                    url: '/pages/tabbar/home',
                  });
                } else {
                  // uni.login({
                  //   provider: 'weixin',
                  //   fail() {
                  //     fastClick = true;
                  //   },
                  //   success() {
                  bind(
                    Object.assign(
                      {
                        openId: res.openId,
                      },
                      e.detail
                    )
                  )
                    .then(data => {
                      if (data.token) {
                        uni.setStorageSync('userInfo', data);
                        uni.reLaunch({
                          url: '/pages/tabbar/home',
                        });
                      }
                    })
                    .finally(() => {
                      fastClick = true;
                      uni.hideLoading();
                    });
                  //   },
                  // });
                }
              })
              .finally(() => {
                fastClick = true;
                uni.hideLoading();
              });
          },
        });
      }
    },
    getCode() {
      if (this.disabled) return;

      if (!that.form.phone.trim()) {
        that.common.showToast('手机号获取失败');
        return;
      }
      that.disabled = true;
      getCode({
        phone: that.form.phone,
        type: 1,
      })
        .then(res => {
          let countdown = 60;
          that.btnText = '重新获取(' + countdown + 's)';
          timer = setInterval(() => {
            if (countdown > 0) {
              countdown--;
              countdown = countdown < 10 ? '0' + countdown : countdown;
              that.btnText = '重新获取(' + countdown + 's)';
            } else {
              clearInterval(timer);
              that.disabled = false;
              that.btnText = '获取验证码';
            }
          }, 1000);
        })
        .catch(() => {
          that.disabled = false;
        });
    },
    submit() {
      if (this.disabledNext) return;

      if (!that.form.phone.trim()) {
        that.common.showToast('手机号不能为空');
        return;
      }
      if (!reg.phone.test(that.form.phone)) {
        that.common.showToast('手机号格式有误');
        return;
      }

      // 2验证码登录
      if (!that.form.verificationCode.trim()) {
        that.common.showToast('请输入验证码');
        return;
      }

      uni.showLoading();

      loginBySms(that.form).then(data => {
        if (data.token) {
          uni.setStorageSync('phone', that.form.phone);
          uni.setStorageSync('userInfo', data);
          uni.setStorageSync('eToken', '');
          uni.reLaunch({
            url: '/pages/tabbar/home',
          });
        }
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
.page {
  padding: 0 76rpx;

  .text-link {
    color: #3277ff;
  }

  .btn-box {
    margin-top: 150rpx;

    .btn-cancel,
    .btn-primary {
      box-sizing: border-box;
      width: 598rpx;
      height: 88rpx;
      border-radius: 8rpx;
      font-size: 32rpx;
    }

    .icon-wechat {
      margin-right: 20rpx;
      width: 40rpx;
      height: 40rpx;
    }

    .btn-cancel {
      border-color: #ccc;
      margin: 32rpx 0;
    }
  }
  .top-box {
    padding: 0 24rpx;
    position: relative;
    .logo {
      margin: 50rpx auto 0;
      width: 150rpx;
      height: 150rpx;
      display: block;
      position: relative;
      z-index: 1;
    }
    .title {
      font-size: 48rpx;
      position: relative;
      z-index: 1;
      text {
        font-size: inherit;
        color: $uni-color-primary;
        padding-left: 20rpx;
      }
    }
    .info {
      font-size: 30rpx;
      margin-top: 30rpx;
      position: relative;
      z-index: 1;
      display: inline-block;
      border-bottom: 2rpx solid $uni-color-primary;
    }
    .login-img {
      width: 500rpx;
      height: 268rpx;
      position: absolute;
      top: -20rpx;
      right: -80rpx;
    }
  }

  .form-box {
    margin-top: 120rpx;
    .place {
      font-size: $uni-font-size-base;
    }
    .form-item {
      height: 100rpx;
      padding: 0 30rpx;
      border-bottom: 1px solid #e6e6e6;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      .icon-auth,
      .icon-phone {
        width: 40rpx;
        height: 40rpx;
      }

      input {
        padding: 0 24rpx;
      }

      .btn-vice {
        padding: 0 29rpx;
        height: 56rpx;
        font-size: 28rpx;
        border-radius: 8rpx;
      }

      .disabled {
        color: #ccc;
      }
    }

    .btn {
      width: 598rpx;
      height: 88rpx;
      margin: 60rpx 0 32rpx;
      background-color: $uni-color-primary;
      border-radius: $uni-border-radius-base;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
    }

    .tip {
      .text {
        margin: 20rpx;
        color: #727272;
      }
    }

    .other {
      margin-top: 60rpx;
      text-align: center;

      .text-28 {
        margin: 0 32rpx;
        color: #666666;
        line-height: 56rpx;
      }

      .line {
        width: 100rpx;
        height: 1px;
        background: #e6e6e6;
      }

      .img-wechat {
        width: 80rpx;
        height: 80rpx;
      }
    }

    .text-28 {
      color: #333333;
      line-height: 56rpx;
      font-weight: 500;
    }
  }
}

.box-wechat {
  margin: 0 auto;
  margin-top: 32rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
</style>
