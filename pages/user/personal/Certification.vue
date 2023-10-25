<!--
 * @Description:
 * @LastEditTime: 2023-09-14 15:01:55
 * @LastEditors: wudi
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
          :adjust-position="true"
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
          :adjust-position="true"
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
          :adjust-position="true"
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
        <!-- <view
          @click="jumpPage"
          class="btn-primary"
        >
          {{ jumpSeconds }}S 发起签署
      </view> -->
        <navigator
          hover-class="none"
          open-type="switchTab"
          :url="jumpUrl"
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
import { auth, backfill, authUserRecord } from '@/api/company.js';
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
      originType:null,
      id:'',
      authRecordObj:null
    };
  },
  computed: { ...mapState(['userInfo']),
},

  onShow() {
    that = this;
    // if(getCache('eCerURL')){
    // 	uni.redirectTo({
    // 		url: '/pages/user/company/authorize?path='+ encodeURIComponent(getCache('eCerURL'))
    // 	})
    // }else{
    // 	that.showPage = true
    // }
    that.getAuthRecord()
  },
  onLoad(e) {
    that = this;
    that.form.phone = this.userInfo.phone;
    that.form.nickname = this.userInfo.nickname || '';
    console.log('e :', e)
    if (e.originType) that.originType = e.originType ;
    if (e.type) that.type = e.type;
    else that.type = 1;
    if(e.id) {
      that.id = e.id;
    }
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
          if(that.originType && that.originType === 'sign') {
            if(that.id) {
              uni.redirectTo({
                url: '/pages/contract/detail/index?id=' + that.id,
              });
            } else {
              uni.navigateBack({
                delta:1,
              })
            }

            } else if(that.originType && that.originType === 'mine') {
              uni.reLaunch({
              url: '/pages/user/index',
            });
            } else {
              uni.reLaunch({
              url: '/pages/user/index',
            });
          }
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
      console.log('that.originType :', that.originType)
      if(that.originType && that.originType === 'mine') {
        //type = 6 我的
        that.form.type = 6;
      } else if(that.originType && that.originType === 'sign' && that.id) {
        //type = 7 合同详情
        that.form.type = 7;
        that.form.params = that.id;
      }
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
    getAuthRecord() {
      authUserRecord().then(res => {
        this.authRecordObj = res;
      });
    }
  },
  watch: {
    originType (value) {
      console.log('value :', value)
      if(value && value === 'mine') {
            that.jumpUrl = '/pages/user/index';
         } else if(value && value === 'sign') {
            that.jumpUrl = '/pages/contract/detail/index?id=' + that.id;
         } else {
            that.jumpUrl = '/pages/home/index';
        }
        console.log('that.jumpUrl :', that.jumpUrl)
    },
    authRecordObj (obj) {
      if (!obj) return;
        if (obj.authState === 1) {
          if(obj.authUrl) {
            uni.showModal({
              content: '您之前上传过认证资料，若继续操作请点击继续认证按钮',
              confirmText: '继续认证',
              cancelText: '我要重新认证',
              confirmColor: '#dd524d',
              cancelColor: '#999999',
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(obj.authUrl),
                  });
                }
              },
            });
          } else {
            uni.showModal({
              content: '企业认证中，请等待',
              confirmText: '刷新认证状态',
              cancelText: '取消',
              confirmColor: '#dd524d',
              cancelColor: '#999999',
              success: function (res) {
                if (res.confirm) {
                  that.getAuthRecord()
                }
              },
            });
          }
        } else if (obj.authState === 2) {
          that.success();
        } else if(obj.authState === 3) {
          uni.showModal({
              content: obj.failReason,
              confirmText: '重新认证',
              cancelText: '取消',
              confirmColor: '#dd524d',
              cancelColor: '#999999',
              success: function (res) {
                if (res.confirm) {
                  console.log('重新认证')
                }
              },
            });
        }
    }
  }
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
