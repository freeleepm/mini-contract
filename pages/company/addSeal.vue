<!--
 * @Description:
 * @LastEditTime: 2022-09-07 17:39:29
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <view class="flex-box name">
      <text class="iconfont icon-gongsi"></text>
      <view>
        {{ currentCompany.name || '' }}
      </view>
    </view>
    <view class="up-box flex-ct" @click="pickImg">
      <image v-if="tempFilePath" :src="tempFilePath.path" mode="aspectFit"></image>
      <view v-else>
        <text class="iconfont icon-guanbi"></text>
        <view>上传企业印章需清晰可见</view>
      </view>
    </view>
    <view class="tip required">支持jpg、jpeg、png格式且小于10M的文件。</view>

    <view class="btn-fixed-box">
      <view class="btn-fixed flex-ct">
        <view
          class="btn-1"
          @click="clear"
          :class="{
            disabled: !tempFilePath,
          }"
        >
          清除
        </view>
        <view
          class="btn-2"
          @click="submit"
          :class="{
            disabled: !currentCompany || !tempFilePath,
          }"
        >
          完成
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { upload } from '@/api/upload.js';
import { getCode, createImage, getToken } from '@/api/seal.js';
import { setCache, getCache } from '@/common/cache.js';
import { detail } from '@/api/company.js';
var that;
export default {
  data() {
    return {
      tempFilePath: '',
      currentCompany: '',
      accessToken: '',
    };
  },
  onLoad(e) {
    that = this;
    if (e.id) {
      detail({
        id: e.id,
      }).then(res => {
        that.currentCompany = res;
        let eToken = getCache('eToken');
        if (eToken) {
          that.accessToken = eToken;
        } else {
          if (e.auth == 1) {
            // e签宝返回的页面
            that.getEToken(e.code);
          } else {
            that.getECode();
          }
        }
      });
    }
  },
  methods: {
    clear() {
      that.tempFilePath = '';
    },
    getEToken(code) {
      getToken({
        redirectUrl: '/pages/company/addSeal?id=' + that.currentCompany.id + '&auth=1', // 认证完成后跳转页面
        // redirectUrl: encodeURIComponent('https://esign.yi-types.com/seal.html?type=2&id='+that.currentCompany.id), // 认证完成后跳转页面
        code: code,
        refreshToken: '',
      }).then(res => {
        setCache('eToken', res.token, 1.9 * 60 * 60);
        that.accessToken = res.token;
      });
    },
    getECode() {
      getCode({
        redirectUrl: '/pages/company/addSeal?id=' + that.currentCompany.id + '&auth=1', // 认证完成后跳转页面
        account: uni.getStorageSync('userInfo').phone, // 账号标识（手机号或者邮箱）
        receiveUrlMobileNo: uni.getStorageSync('userInfo').phone, // 接收认证链接短信通知的手机号
        receiveUrlEmail: 'bestjhh@163.com', // 接收认证链接通知的邮件地址
        subjectName: that.currentCompany.name, // 组织名称
        subjectCertNo: that.currentCompany.creditCode, //统一信用代码
        organizationType: 1, // 组织机构类型 1 - 企业类,2 - 个体工商户,99 - 其他组织
        legalRepName: that.currentCompany.nickname, // 法定代表人姓名
        legalRepCertNo: that.currentCompany.idNumber, //法定代表人证件号
        individualName: '', // 个人姓名
        individualCertNo: '', // 个人证件号
      }).then(url => {
        if (url) {
          if (url.indexOf('code=') > -1) {
            let index = url.indexOf('code=');
            let index2 = url.indexOf('&oid=');
            that.getEToken(url.slice(index + 5, index2));
          } else {
            uni.navigateTo({
              url: '/pages/company/authorize?path=' + encodeURIComponent(url),
            });
          }
        }
      });
    },
    submit() {
      if (that.accessToken) {
        if (that.tempFilePath) {
          uni.showLoading({
            title: '请稍等',
          });
          upload(that.tempFilePath).then(path => {
            if (path) {
              createImage({
                alias: '印章' + new Date().getTime(),
                imageSize: that.tempFilePath.size,
                height: 159, // that.tempFilePath.height
                width: 159, // that.tempFilePath.width
                sealBizType: 'PUBLIC', // 印章业务类型 PUBLIC - 公章 CONTRACT - 合同专用章 FINANCE - 财务专用章 LEGAL_PERSON - 法定代表人章 COMMON - 其他
                filePath: path,
                creditCode: that.currentCompany.creditCode,
                token: that.accessToken,
                companyId: that.currentCompany.id,
              })
                .then(image => {
                  uni.hideLoading();
                  uni.showModal({
                    title: '印章上传成功',
                    content: '审核通过后即可使用，请您耐心等待！',
                    confirmText: '好的',
                    cancelText: '取消',
                    confirmColor: '#3277FF',
                    cancelColor: '#999999',
                    success: function (res) {
                      uni.redirectTo({
                        url: '/pages/user/companySeal?companyId=' + that.currentCompany.id,
                      });
                    },
                  });
                })
                .catch(() => {
                  uni.hideLoading();
                });
            } else {
              uni.hideLoading();
            }
          });
        } else {
          uni.showToast({
            title: '请上传印章',
            icon: 'none',
          });
        }
      } else {
        that.getECode();
      }
    },
    pickImg() {
      uni.chooseImage({
        count: 1,
        success: function (res) {
          if (res.tempFiles) {
            uni.getImageInfo({
              src: res.tempFilePaths[0],
              success: function (image) {
                if (image.type == 'png' || image.type == 'jpeg' || image.type == 'jpg') {
                  image.size = parseInt(res.tempFiles[0].size / 1024);
                  that.tempFilePath = image;
                  console.log(that.tempFilePath);
                } else {
                  that.common.showToast('图片格式不支持');
                }
              },
            });
          }
        },
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
  padding: 30rpx;
  .title {
    font-size: $uni-font-size-lg;
    position: relative;
  }
  .title::before {
    width: 8rpx;
    position: absolute;
    border-radius: 0 4rpx 4rpx 0;
    content: '';
    height: 32rpx;
    top: calc(50% - 16rpx);
    left: -30rpx;
    background-color: $uni-color-minor;
  }
  .up-box {
    border-radius: $uni-border-radius-base;
    border: 2rpx dashed #cdcdcd;
    height: 600rpx;
    margin: 40rpx auto 20rpx;
    text-align: center;
    image {
      width: 100%;
      height: 508rpx;
      display: block;
    }
    .icon-guanbi {
      font-size: 70rpx;
      display: inline-block;
      color: $uni-text-color-grey;
      transform: rotate(45deg);
      margin-bottom: 30rpx;
    }
    view {
      width: 100%;
      color: $uni-text-color-grey;
    }
  }
  .name {
    margin-top: 30rpx;
    .icon-gongsi {
      font-size: 32rpx;
      color: $uni-color-primary;
      position: relative;
      top: 4rpx;
      margin-right: 10rpx;
    }
    view {
      font-size: 30rpx;
    }
  }
  .tip {
    color: $uni-text-color-grey;
    margin-top: 20rpx;
    font-size: $uni-font-size-sm;
  }
  .btn-fixed-box {
    height: calc(138rpx + env(safe-area-inset-bottom));
    .btn-fixed {
      view {
        width: 240rpx;
        margin: 0 40rpx;
      }
    }
    .disabled {
      opacity: 0.5;
    }
  }
}
</style>
