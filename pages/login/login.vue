<!--
 * @Description:
 * @LastEditTime: 2023-09-04 10:26:32
 * @LastEditors: wudi
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
        :open-type="checked ? 'getPhoneNumber' : ''"
        @getphonenumber="getPhoneNumber"
        @click="showTost"
        class="btn-primary"
      >
        授权登录
      </button>
      <view class="btn-cancel" @click="type = 2">手机号码登录</view>
      <checkBox @change="e => (checked = e)" :check="checked" />
    </view>
    <view v-if="type === 2">
      <view class="form-box">
        <view class="form-item flex-fs">
          <image src="@/static/IconPhone.png" class="icon-phone"></image>
          <input
            type="number"
            v-model="form.phone"
            placeholder="11位手机号"
            placeholder-class="place"
            :maxlength="11"
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
      </view>
      <checkBox @change="e => (checked = e)" :check="checked" />
      <!-- #ifdef MP-WEIXIN -->
      <view class="flex-ct fast-login-text" @click="type = 1">
        <uni-icons type="left" size="20" color="#999999"></uni-icons>
        <view class="txt">授权登录</view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
var that,
  timer = null,
  fastClick = true;
import reg from '@/utils/reg.js';
import { mapState, mapActions } from 'vuex';
import { login, getCode, loginBySms, appletsLogin, bind } from '@/api/login.js';
import checkBox from './checkBox.vue';
export default {
  components: { checkBox },
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
      isCertification: false,
      checked: false,
      loginType:null,
      id:''
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
    console.log(e);
    if(e.id)  {
      that.id = e.id
    }
    if(e.loginType) {
      that.loginType = e.loginType;
      return;
    }

    // if (e.logout != 1) {
    //   uni.login({
    //     provider: 'weixin',
    //     success: function (loginRes) {
    //       appletsLogin({
    //         code: loginRes.code,
    //       }).then(res => {
    //         if (res.token) {
    //           that.$store.commit('setToken', res.token);
    //           that.$store.commit('setUserInfo', res);
    //           if (e && e.isCertification && !res.authentication) {
    //             uni.navigateTo({
    //               url: '/pages/user/personal/Certification',
    //             });
    //           } else {
    //             uni.reLaunch({
    //               url: '/pages/home/index',
    //             });
    //           }
    //         }
    //       });
    //     },
    //   });
    // }
    // 邀请注册进来的
    if (e && e.isCertification) {
      this.isCertification = true;
    }
  },
  methods: {
    showTost() {
      if (this.checked) return;
      uni.showToast({
        title: '请先阅读用户隐私协议',
        icon: 'none',
      });
    },
    getPhoneNumber(e) {
      // 获取手机号
      console.log('that.id :', that.id)
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        console.log('e :', e)
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
                  that.$store.commit('setToken', res.token);
                  that.$store.commit('setUserInfo', res);
                  if(that.loginType && that.loginType === 'first') {
                    uni.redirectTo({
                      url: '/pages/contract/detail/index?id=' + that.id,
                    });
                  } else {
                if (that.isCertification && !res.authentication) {
                      uni.navigateTo({
                       url: '/pages/user/personal/Certification',
                      });
                    } else {
                    uni.reLaunch({
                      url: '/pages/home/index',
                     });
                   }
                  }
                } else {
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
                        that.$store.commit('setToken', data.token);
                        that.$store.commit('setUserInfo', data);

                        if(that.loginType && that.loginType === 'first') {
                          uni.redirectTo({
                            url: '/pages/contract/detail/index?id=' + that.id,
                          });
                        } else {
                          if (this.isCertification && !data.authentication) {
                            uni.navigateTo({
                              url: '/pages/user/personal/Certification',
                            });
                          } else {
                            uni.reLaunch({
                              url: '/pages/home/index',
                            });
                          }
                        }
                      }
                    })
                    .finally(() => {
                      fastClick = true;
                      uni.hideLoading();
                    });
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
      if (!this.checked) {
        this.showTost();
        return;
      }
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
          that.$store.commit('setToken', data.token);
          that.$store.commit('setUserInfo', data);
          if(that.loginType && that.loginType === 'first') {
            uni.redirectTo({
              url: '/pages/contract/detail/index?id=' + that.id,
            });
          } else {
            uni.reLaunch({
            url: '/pages/home/index',
          });
         }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .btn-box {
    margin-top: 150rpx;
    .btn-cancel,
    .btn-primary {
      margin: 32rpx auto;
      box-sizing: border-box;
      width: 598rpx;
      height: 88rpx;
      border-radius: 8rpx;
      font-size: 32rpx;
    }
    .btn-cancel {
      border-color: #ccc;
    }
  }

  .top-box {
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
    padding: 0 76rpx;
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

    .text-28 {
      color: #333333;
      line-height: 56rpx;
      font-weight: 500;
    }
  }
}

.fast-login-text {
  margin-top: 70rpx;
  .txt {
    color: #999999;
    line-height: 20px;
  }
}
</style>
