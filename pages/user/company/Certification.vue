<!--
 * @Description:
 * @LastEditTime: 2023-09-26 11:06:37
 * @LastEditors: wudi
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <template v-if="type == 1">
      <view class="title text-28 color-grey">企业信息</view>
      <view class="card">
        <view class="row flex-fs" style="border: none">
          <view class="text-26 color-base">请上传营业执照</view>
        </view>
        <view class="up-box flex-ct form-box" @click="pickImg">
          <image v-if="form.license" :src="form.license" mode="aspectFit"></image>
          <image v-else class="img-ocr" src="@/static/ImgOCR.png"></image>
        </view>
        <view class="row flex-sb">
          <view class="text-26 color-base">企业名称</view>
          <input
            class="text-26 color-base flex-1"
            v-model="form.name"
            placeholder="企业名称"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view>
        <view class="row flex-sb">
          <view class="text-26 color-base">统一信用代码</view>
          <input
            class="text-26 color-base flex-1"
            type="text"
            v-model="form.creditCode"
            placeholder="统一信用代码"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view>
      </view>
      <view class="title text-28 color-grey">管理者信息</view>
      <view class="card">
        <view class="row flex-sb">
          <view class="text-26 color-base">姓名</view>
          <input
            class="text-26 color-base flex-1"
            type="text"
            v-model="form.nickName"
            placeholder="姓名"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view>
        <view class="row flex-sb">
          <view class="text-26 color-base">身份证号</view>
          <input
            class="text-26 color-base flex-1"
            type="text"
            v-model="form.idNumber"
            placeholder="请输入身份证号"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view>
        <view class="row flex-sb">
          <view class="text-26 color-base">手机号</view>
          <input
            class="text-26 color-base flex-1"
            type="number"
            v-model="form.phone"
            placeholder="请输入手机号"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view>
        <!-- <view class="row flex-sb">
          <view class="text-26 color-base">邮箱</view>
          <input
            class="text-26 color-base flex-1"
            type="text"
            v-model="form.email"
            placeholder="请输入邮箱"
            placeholder-class="place"
            :adjust-position="true"
          />
        </view> -->
      </view>
      <view class="btn-primary" @click="submit">提交</view>
      <!-- <view class="btn" @click="type=2">下一步</view> -->
    </template>

    <template v-if="type == 2">
      <view class="title bold">法人授权确认</view>
      <view class="form-box">
        验证码将发送至{{ form.phone.slice(0, 3) }}****{{
          form.phone.slice(7, 11)
        }}，回填验证码确认授权。
      </view>
      <view class="form-box flex-sb">
        <input
          type="text"
          v-model="form.verificationCode"
          placeholder="请输入验证码"
          placeholder-class="place"
        />
        <button type="primary" :disabled="disabled" @click="getCode">{{ btnText }}</button>
      </view>
      <view class="btn" @click="type = 3">提交</view>
      <view class="btn2" @click="type = 1">取消</view>
    </template>

    <template v-if="type == 3">
      <view class="success-box flex-col">
        <image src="@/static/icon/icon-success.png"></image>
        <view class="text-32 bold">恭喜你已通过企业认证！</view>
        <view class="success-tip">企业认证成功，可以发起签署。</view>
        <navigator
          hover-class="none"
          open-type="switchTab"
          :url="jumpUrl"
          class="btn-primary"
        >
          {{ jumpSeconds }}S 发起签署
        </navigator>
        <!-- <view
          @click="success"
          class="btn-primary"
        >
          {{ jumpSeconds }}S 发起签署
      </view> -->
      </view>
    </template>
  </view>
</template>

<script>
var that,
  timer = null;
var timer2, fastClick;
import reg from '@/utils/reg.js';
import { upload } from '@/api/oss.js';
import { ocr, companyAuth, authRecord } from '@/api/company.js';
// import { setCache, getCache } from '@/utils/cache.js';
export default {
  data() {
    return {
      form: {
        name: '',
        creditCode: '',
        nickName: '',
        idNumber: '',
        phone: '',
        verificationCode: '',
        license: '',
        // email:''
      },
      disabled: false,
      btnText: '获取验证码',
      type: 0,
      jumpSeconds: 3,
      license: {
        license: '',
        id: '',
      },
      showPage: false,
      originType:null,
      id:'',
      authRecordObj:null
    };
  },
  onShow() {
    that = this;
    // if(getCache('eCerCompenytURL')){
    // 	uni.redirectTo({
    // 		url: '/pages/user/company/authorize?path='+ encodeURIComponent(getCache('eCerCompenytURL'))
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
    console.log('e :', e)
    that = this;
    fastClick = true;
    if (e.id) that.license.id = e.id;
    if (e.type) that.type = e.type;
    else that.type = 1;
    if(e.originType) that.originType = e.originType;
    if(e.id) {
      that.id = e.id;
    }
    if (that.type == 3) {
      that.success();
    }
  },
  onUnload() {
    if (timer2) clearInterval(timer2);
  },
  methods: {
    success() {
      that.type = 3;
      timer2 = setInterval(() => {
        if (that.jumpSeconds > 1) that.jumpSeconds--;
        else {
          clearInterval(timer2);
            if(that.originType && that.originType === 'mine') {
              uni.reLaunch({
              url: '/pages/user/index',
            });
           } else if(that.originType && that.originType === 'sign') {
            uni.redirectTo({
              url: '/pages/contract/detail/index?id=' + that.id,
            });
           } else {
            uni.reLaunch({
            url: '/pages/home/index',
          });
          }
        }
      }, 1000);
    },
    pickImg() {
      uni.chooseImage({
        count: 1,
        // mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          if (res.tempFiles) {
            uni.showLoading({
              title: '识别中，请稍等',
            });
            uni.getImageInfo({
              src: res.tempFilePaths[0],
              success: function (image) {
                if (image.type == 'png' || image.type == 'jpeg' || image.type == 'jpg') {
                  upload([res.tempFiles[0]])
                    .then(path => {
                      if (path) {
                        that.license.license = path[0].url;
                        ocr(that.license)
                          .then(ocrBack => {
                            if (ocrBack) {
                              // const form = JSON.parse(JSON.stringify(that.form))
                              // that.form = ocrBack;
                              that.form.name = ocrBack.name;
                              that.form.creditCode = ocrBack.creditCode;
                              that.form.nickName = ocrBack.nickname;
                              that.form.license = path[0].url;
                            }
                            uni.hideLoading();
                          })
                          .catch(() => {
                            uni.hideLoading();
                          });
                      }
                    })
                    .catch(() => {
                      uni.hideLoading();
                    });
                } else {
                  that.common.showToast('图片格式不支持');
                }
              },
              fail() {
                uni.hideLoading();
              },
            });
          }
        },
      });
    },
    getCode() {
      if (!that.form.nickName.trim()) {
        that.common.showToast('请输入真实姓名');
        return;
      }
      if (!that.form.idNumber.trim()) {
        that.common.showToast('请输入身份证号');
        return;
      }
      if (!reg.idCard.test(that.form.idNumber)) {
        that.common.showToast('身份证号有误');
        return;
      }
      if (!that.form.phone.trim()) {
        that.common.showToast('手机号获取失败');
        return;
      }
      auth(that.form).then(res => {
        let countdown = 60;
        that.disabled = true;
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
      });
    },
    submit() {
      // if (!that.form.license) {
      //   that.common.showToast('上传营业执照');
      //   return;
      // }
      if (!that.form.name || !that.form.creditCode || !that.form.nickName) {
        that.common.showToast('ocr识别失败');
        return;
      }
      if (!that.form.idNumber.trim()) {
        that.common.showToast('请输入法人身份证号');
        return;
      }
      if (!reg.idCard.test(that.form.idNumber)) {
        that.common.showToast('身份证号有误');
        return;
      }
      if (!that.form.phone.trim()) {
        that.common.showToast('手机号不能为空');
        return;
      }
      if (!reg.phone.test(that.form.phone)) {
        that.common.showToast('手机号格式有误');
        return;
      }
      // if (!that.form.email.trim()) {
      //   that.common.showToast('请输入邮箱');
      //   return;
      // }
      // if (!reg.email.test(that.form.email)) {
      //   that.common.showToast('邮箱格式有误');
      //   return;
      // }
      if (!fastClick) return;
      fastClick = false;
      if(that.originType && that.originType === 'mine') {
        //type = 6 我的
        that.form.type = 6;
      } else if(that.originType && that.originType === 'sign' && that.id) {
        //type = 7 合同详情
        that.form.type = 7;
        that.form.params = that.id;
      }

      companyAuth(that.form)
        .then(res => {
          if (res) {
            // setCache('eCerCompenytURL',res,1*60*60)
            uni.redirectTo({
              url: '/pages/user/company/authorize?path=' + encodeURIComponent(res),
            });
          } else {
            // 没有返回链接则是代表已认证成功
            setTimeout(() => {
              fastClick = true;
              that.success();
            }, 666);
          }
          // uni.setStorageSync('refresh', '1');
          // uni.showModal({
          // 	title: '认证提交成功',
          // 	content: '审核需要1-2个工作日，请您耐心等待！',
          // 	confirmText: '好的',
          // 	cancelText: '取消',
          // 	confirmColor: '#3277FF',
          // 	cancelColor: '#999999',
          // 	success: function (res) {
          // 		uni.navigateBack({
          // 			delta:1
          // 		})
          // 	}
          // })
        })
        .catch(() => {
          fastClick = true;
        });
    },
    getAuthRecord() {
      authRecord().then(res => {
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
          if(Number(obj.unAuthCount) > 1) {
           uni.navigator({
             url:  '/pages/user/company/myCompany?originType=' + this.originType
           })
          } else {
            if(obj.authUrl) {
                uni.showModal({
                  content: `您之前上传过${obj.companyName}的认证资料，若继续操作请点击继续认证按钮`,
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
.card {
  box-sizing: border-box;
  padding: 0 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;
}
.title {
  width: 686rpx;
  margin-top: 32rpx;
  margin-bottom: 20rpx;
}

.up-box {
  width: 622rpx;
  height: 360rpx;
  text-align: center;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.row {
  padding: 32rpx 0;
  border-bottom: 1px solid $uni-border-color;

  &:last-child {
    border: none;
  }

  .text-26 {
    text-align: right;
  }
}

.btn-primary {
  margin-top: 60rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}

.success-box {
  text-align: center;

  .success-tip {
    margin-top: 50rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }
}
</style>
