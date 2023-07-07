<!--
 * @Description:
 * @LastEditTime: 2022-09-09 18:20:56
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <template v-if="type == 1">
      <view class="flex-fs title">
        <view class="text-30 color-base bold">手机号认证</view>
        <view class="tip text-26 color-grey-minor">* 需要验证由本人开户的手机号</view>
      </view>
      <view class="form-box">
        <view class="form-name bold text-28 color-base required">真实姓名</view>
        <input
          class="text-28 color-base"
          type="text"
          v-model.trim="form.nickname"
          placeholder="请输入您的真实姓名"
          placeholder-class="place"
        />
      </view>
      <view class="form-box">
        <view class="form-name bold text-28 color-base required">身份证</view>
        <input
          class="text-28 color-base"
          type="text"
          v-model="form.idNumber"
          placeholder="请输入您的身份证号"
          placeholder-class="place"
        />
      </view>
      <view class="form-box">
        <view class="form-name bold text-28 color-base required">手机号</view>
        <input
          class="text-28 color-base"
          type="text"
          :maxlength="18"
          v-model="form.phone"
          disabled
          placeholder="手机号"
          placeholder-class="place"
        />
      </view>
      <!-- <view class="form-box">
				<view class="form-name required">验证码</view>
				<view class="flex-sb">
					<input type="text" v-model='form.verificationCode' placeholder="请输入验证码" placeholder-class="place"/>
					<button type="primary" :disabled='disabled' @click="getCode">{{ btnText }}</button>
				</view>
			</view> -->
      <view class="btn btn-primary text-28" @click="getCode">立即认证</view>
    </template>
    <template v-if="type == 2">
      <view class="success-box flex-col">
        <image class="img-back" src="@/static/ImgBackSuccess.png"></image>
        <view class="text-26 color-base">恭喜你已通过个人实名认证！</view>
        <navigator
          hover-class="none"
          open-type="switchTab"
          url="/pages/home/index"
          class="btn-primary"
        >
          {{ jumpSeconds }}S 发起签署
        </navigator>
      </view>
    </template>
  </view>
</template>

<script>
var that,
  timer = null;
var timer2;
import reg from '@/utils/reg.js';
import { auth, backfill, authRecord } from '@/api/company.js';
import { setCache, getCache } from '@/utils/cache.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      form: {
        nickname: '',
        idNumber: '',
        phone: '',
        verificationCode: '',
      },
      disabled: false,
      btnText: '获取验证码',
      type: 0,
      jumpSeconds: 3,
      showPage: false,
    };
  },
  computed: { ...mapState(['userInfo']) },

  onShow() {
    that = this;
    // if(getCache('eCerURL')){
    // 	uni.redirectTo({
    // 		url: '/pages/user/company/authorize?path='+ encodeURIComponent(getCache('eCerURL'))
    // 	})
    // }else{
    // 	that.showPage = true
    // }
    authRecord().then(res => {
      if (!res) return;
      if (res.authUrl && res.authState === 1) {
        uni.redirectTo({
          url: '/pages/user/company/authorize?path=' + encodeURIComponent(res.authUrl),
        });
      } else if (res.authState === 2) {
        that.success();
      }
    });
  },
  onLoad(e) {
    that = this;
    that.form.phone = this.userInfo.phone;
    that.form.nickname = this.userInfo.nickname || '';
    if (e.type) that.type = e.type;
    else that.type = 1;
    that.disabled = false;
    if (that.type == 2) {
      that.success();
    }
  },
  onUnload() {
    if (timer2) clearInterval(timer2);
  },
  methods: {
    success() {
      that.type = 2;
      timer2 = setInterval(() => {
        if (that.jumpSeconds > 1) that.jumpSeconds--;
        else {
          clearInterval(timer2);
          uni.reLaunch({
            url: '/pages/user/index',
          });
        }
      }, 1000);
    },
    getCode() {
      that.form.nickname = that.form.nickname;
      if (!that.form.nickname) {
        that.common.showToast('请输入真实姓名');
        return;
      }
      if (that.form.nickname.length < 2) {
        that.common.showToast('真实姓名至少两个字');
        return;
      }
      if (!that.form.idNumber) {
        that.common.showToast('请输入身份证号');
        return;
      }
      if (!reg.idCard.test(that.form.idNumber)) {
        that.common.showToast('身份证号有误');
        return;
      }
      if (!that.form.phone) {
        that.common.showToast('手机号获取失败');
        return;
      }
      if (that.disabled) return;
      that.disabled = true;
      auth(that.form)
        .then(res => {
          if (res) {
            that.disabled = false;
            // setCache('eCerURL',res,1*60*60)
            uni.redirectTo({
              url: '/pages/user/company/authorize?path=' + encodeURIComponent(res),
            });
          } else {
            // 没有返回链接则是代表已认证成功
            that.success();
          }
          // let countdown = 60
          // that.btnText = '重新获取('+countdown+'s)'
          // timer = setInterval(()=>{
          // 	if(countdown > 0){
          // 		countdown --
          // 		countdown = countdown < 10?'0'+countdown:countdown
          // 		that.btnText = '重新获取('+countdown+'s)'
          // 	}else{
          // 		clearInterval(timer)
          // 		that.disabled = false
          // 		that.btnText = '获取验证码'
          // 	}
          // },1000)
        })
        .catch(() => {
          console.log('0000000000000000');
          that.disabled = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-base {
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
}
.title {
  margin-top: 32rpx;
  width: 686rpx;
}
.tip {
  font-size: $uni-font-size-sm;
  margin-left: 20rpx;
  color: $uni-text-color-grey;
}
.form-box {
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  margin-top: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  .form-name {
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1px solid $uni-border-color;
  }
}
.btn {
  width: 598rpx;
  height: 88rpx;
  border-radius: $uni-border-radius-base;
  margin: 80rpx 40rpx 20rpx;
}

/deep/ {
  uni-button[type='primary'],
  uni-button[disabled][type='primary'] {
    background-color: $uni-color-primary;
  }
}
.success-box {
  position: relative;
  margin-top: 32rpx;
  width: 686rpx;
  height: 992rpx;
  background: linear-gradient(180deg, #dbe2ff 0%, #ffffff 15%);
  border-radius: 12rpx;

  .text-26 {
    position: absolute;
    top: 382rpx;
  }

  .btn-primary {
    margin-top: 80rpx;
    width: 598rpx;
    height: 88rpx;
    border-radius: 8rpx;
  }

  .img-back {
    margin-top: 80rpx;
    width: 490rpx;
    height: 414rpx;
  }
}
</style>
