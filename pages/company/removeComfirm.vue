<!--
 * @Description:
 * @LastEditTime: 2022-09-15 11:48:46
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="content safe flex-col">
    <view class="infoBox">
      <view class="info">请输入验证码</view>
      <view class="info">
        <text class="subText">验证码已发送至</text>
        {{ form.phone.slice(0, 3) + '****' + form.phone.slice(-4) }}
      </view>
      <view class="info">确认与该企业进行解绑，解绑后将不再与企业关联</view>
    </view>
    <view class="inputBox">
      <view class="borderBox flex-sb">
        <view
          v-for="(_item, index) in Array(6)"
          :key="index"
          class="broder"
          :class="{ checked: index <= codeArrLength }"
        >
          {{ codeArry[index] || '' }}
        </view>
        <input
          v-model="form.verificationCode"
          class="input"
          :focus="focus"
          maxlength="6"
          type="number"
        />
      </view>
      <view v-show="!countdown" class="textBtn" @click="getCode">{{ btnText }}</view>
      <view v-show="countdown" class="textBtn disabled">{{ countdown }}s后重新获取验证码</view>
    </view>
    <view class="flex-sb row-width">
      <navigator class="btn btn-vice" hover-class="none" open-type="navigateBack">取消</navigator>
      <view
        class="btn btn-primary"
        :class="{ disabled: form.verificationCode.length !== 6 }"
        @click="submit"
      >
        确定
      </view>
    </view>
    <uni-popup ref="message" type="message">
      <uni-popup-message :type="type11" :message="messageText" :duration="2000"></uni-popup-message>
    </uni-popup>
  </view>
</template>

<script>
import { company, remove } from '@/api/company.js';
import { getCode, info } from '@/api/login.js';
var that,
  timer = null,
  fastClick = true;
export default {
  data() {
    return {
      btnText: '获取验证码',
      disabled: false,
      form: {
        id: '',
        phone: '',
        verificationCode: '',
      },
      id: '',
      isMyCompany: false,
      countdown: 0,
    };
  },
  computed: {
    codeArry() {
      return this.form.verificationCode.split('');
    },
    codeArrLength() {
      return this.form.verificationCode.length;
    },
  },
  onLoad(e) {
    that = this;
    if (e.id) {
      that.form.id = e.id;
      info().then(data => {
        if (data) {
          this.form.phone = data.phone;
          this.isMyCompany = data.companyId == e.companyId;
        }
      });
    }
  },
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getCode() {
      if (!that.form.phone.trim()) {
        that.common.showToast('手机号获取失败');
        return;
      }
      that.disabled = true;
      getCode({
        phone: that.form.phone,
        type: 4,
      })
        .then(res => {
          this.countdown = 60;
          timer = setInterval(() => {
            if (this.countdown > 0) {
              this.countdown--;
            } else {
              clearInterval(timer);
              that.disabled = false;
              that.btnText = '重新获取';
            }
          }, 1000);
        })
        .catch(() => {
          that.disabled = false;
        });
    },
    submit() {
      if (!that.form.verificationCode.trim()) {
        that.common.showToast('请输入验证码');
        return;
      }
      remove(that.form).then(() => {
        uni.setStorageSync('refresh', '1');
        if (this.isMyCompany) {
          uni.reLaunch({
            url: '/pages/switchIdentity/index?canBack=1',
          });
        } else {
          uni.navigateBack({
            delta: 1,
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
.content {
  box-sizing: border-box;
  overflow: hidden;
  min-height: 100vh;
  background-color: $uni-bg-color-grey;

  .row-width {
    width: 686rpx;
  }

  .infoBox {
    margin-top: 80rpx;
    width: 686rpx;

    .info {
      margin-bottom: 48rpx;
      height: 56rpx;
      font-size: 40rpx;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 56rpx;

      &:nth-child(2) {
        margin-bottom: 24rpx;
        height: 50rpx;
        font-size: 36rpx;
        line-height: 50rpx;

        .subText {
          font-family: PingFang SC-Regular, PingFang SC;
          font-size: 28rpx;
          font-weight: 400;
          color: #666666;
        }
      }

      &:nth-child(3) {
        margin-bottom: 0;
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 40rpx;
      }
    }
  }

  .inputBox {
    width: 636rpx;
    margin-top: 80rpx;

    .borderBox {
      overflow: hidden;
      position: relative;
      margin-bottom: 32rpx;

      .input {
        position: absolute;
        top: 0;
        left: -50%;
        width: 200%;
        height: 100%;
        opacity: 0;
      }

      .checked {
        border: 2rpx solid $uni-color-primary;
      }
    }

    .broder {
      width: 86rpx;
      height: 86rpx;
      border-radius: 12rpx;
      opacity: 1;
      border: 2rpx solid #cccccc;
      font-size: 32rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-color-primary;
      line-height: 86rpx;
      text-align: center;
      transition: all 0.2s;
    }

    .textBtn {
      margin-left: 4rpx;
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: $uni-color-primary;
      line-height: 40rpx;
    }
  }

  .btn {
    margin-top: 70rpx;
    width: 324rpx;
    height: 88rpx;
    border-radius: 8rpx;
  }

  .refuse-input {
    position: relative;
  }

  .textarea-cause {
    box-sizing: border-box;
    margin-top: 70rpx;
    padding: 32rpx;
    width: 686rpx;
    height: 379rpx;
    border-radius: 12rpx;
    border: 1px solid #cccccc;
    color: #333333;
  }

  .text-count {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
    color: #cccccc;
  }
}
</style>
