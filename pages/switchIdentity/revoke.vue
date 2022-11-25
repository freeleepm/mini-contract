<!--
 * @Description:
 * @LastEditTime: 2022-09-16 14:17:43
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
        {{ phone }}
      </view>
      <view class="info">回填验证码确认撤销合同</view>
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
          v-model="verificationCode"
          class="input"
          :focus="focus"
          maxlength="6"
          type="number"
        />
      </view>
      <view v-show="!timeOutNum" class="textBtn" @click="againclick">{{ content }}</view>
      <view v-show="timeOutNum" class="textBtn disabled">{{ timeOutNum }}s后重新获取验证码</view>
    </view>
    <view class="refuse-input">
      <textarea
        class="textarea-cause text-26"
        v-model="changeValue1"
        @input="getlenth"
        maxlength="100"
        placeholder="请输入撤销原因"
      />
      <view class="text-count text-26">
        <text class="color-base">{{ length }}</text>
        /
        <label>100</label>
      </view>
    </view>
    <view class="flex-sb row-width">
      <navigator class="btn btn-vice" hover-class="none" open-type="navigateBack">取消</navigator>
      <view
        class="btn btn-primary"
        :class="{ disabled: verificationCode.length !== 6 }"
        @click="cancellationOfContract"
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
import userInfoApi from '@/api/api.js';
export default {
  data() {
    return {
      changeValue: '',
      changeValue1: '',
      ashow: false,
      timeOutNum: 0,
      content: '获取验证码',
      timer: '',
      length: 0,
      messageText: '发送成功',
      phone: '',
      phone1: '',
      id: '',
      verificationCode: '',
      type11: 'error',
    };
  },
  computed: {
    codeArry() {
      return this.verificationCode.split('');
    },
    codeArrLength() {
      return this.verificationCode.length;
    },
  },
  onLoad(options) {
    this.id = options.id;
    userInfoApi.personalInformation().then(data => {
      this.phone1 = data.phone;
      this.phone = data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    });
  },
  onUnload() {
    if (this.timer) clearTimeout(this.timer);
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
  methods: {
    againclick() {
      this.ashow = true;
      this.timeOutNum = 60;
      this.timer = setInterval(() => {
        this.timeOutNum--;
        if (this.timeOutNum == 0) {
          this.ashow = false;
          this.content = '重发验证码';
          clearInterval(this.timer);
        }
      }, 1000);

      userInfoApi
        .getCode({
          phone: this.phone1,
          type: 5,
        })
        .then(data => {
          this.type11 = 'message';
          this.messageText = '发送成功';
          this.$refs.message.open();
        });
    },
    cancellationOfContract() {
      if (this.verificationCode) {
        if (this.changeValue1) {
          userInfoApi
            .cancellationOfContract(
              {
                verificationCode: this.verificationCode,
                reason: this.changeValue1,
              },
              this.id
            )
            .then(data => {
              uni.showToast({
                title: '合同撕毁成功',
                duration: 2000,
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 800);
            });
        } else {
          this.type11 = 'warn';
          this.messageText = '请先输入撤销原因';
          this.$refs.message.open();
        }
      } else {
        this.type11 = 'warn';
        this.messageText = '请先输入验证码';
        this.$refs.message.open();
      }
    },
    navigateTo(url) {
      this.common.navigateTo(url);
    },
    getlenth(e) {
      this.length = e.detail.cursor;
    },
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
