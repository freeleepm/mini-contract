<template>
  <view>
    <template v-if="userInfo.witnessComparison">
      <view class="page" :class="step !== 1 ? 'h100' : ''">
        <status-bar
          :title="title"
          :HideBg="!tab_fixed"
          :Embedded="true"
          :color="tab_fixed ? '' : '#FFFFFF'"
        ></status-bar>
        <loading ref="loading"></loading>
        <view class="head-box">
          <view class="box">
            <view class="slider flex-sb">
              <view>
                <view v-if="step == 1" class="cricle-3 circle flex-ct">
                  <view class="cricle-2 circle flex-ct">
                    <view class="cricle-1 circle flex-ct"></view>
                  </view>
                </view>
                <view v-else class="unThere"></view>
                <text :class="step == 1 ? 'active' : ''">身份证采集</text>
              </view>
              <view>
                <view v-if="step == 2" class="cricle-3 circle flex-ct">
                  <view class="cricle-2 circle flex-ct">
                    <view class="cricle-1 circle flex-ct"></view>
                  </view>
                </view>
                <view v-else class="unThere"></view>
                <text :class="step == 2 ? 'active' : ''">人证比对</text>
              </view>
              <view>
                <view v-if="step == 3" class="cricle-3 circle flex-ct">
                  <view class="cricle-2 circle flex-ct">
                    <view class="cricle-1 circle flex-ct"></view>
                  </view>
                </view>
                <view v-else class="unThere"></view>
                <text :class="step == 3 ? 'active' : ''">提交认证</text>
              </view>
            </view>
          </view>
        </view>
        <view class="wrap-box">
          <view class="content">
            <view
              class="bg"
              v-if="step <= 3"
              :class="{
                fail: pageData && pageData.state == 1,
              }"
            >
              <view class="error flex-ct" v-if="pageData && pageData.state == 1">
                <!-- <image :src="'evaluate/icon-tip.png' | img76yun"></image> -->
                <text class="flex-1">{{ pageData.note }}</text>
              </view>
            </view>
            <template v-if="step == 1">
              <view class="idcard-front">
                <view class="title">上传身份证正面</view>
                <view class="upload-box" @click="chooseImage('front')">
                  <image
                    class="car"
                    v-if="tempPicPaths.front"
                    :src="tempPicPaths.front"
                    mode="aspectFit"
                  ></image>
                  <image
                    v-else
                    class="car"
                    src="@/static/idcard-front.png"
                    mode="aspectFit"
                  ></image>
                  <image src="@/static/idcard-border.png" mode="widthFix"></image>

                  <image src="@/static/add-icon.png" mode="widthFix" class="icon-tianjia"></image>
                </view>
              </view>
              <view class="idcard-back">
                <view class="title">上传身份证反面</view>
                <view class="upload-box" @click="chooseImage('back')">
                  <image
                    class="car"
                    v-if="tempPicPaths.back"
                    :src="tempPicPaths.back"
                    mode="aspectFit"
                  ></image>
                  <image v-else class="car" src="@/static/idcard-back.png" mode="aspectFit"></image>
                  <image src="@/static/idcard-border.png" mode="widthFix"></image>
                  <image src="@/static/add-icon.png" mode="widthFix" class="icon-tianjia"></image>
                </view>
              </view>
            </template>
            <view class="step-2" v-if="step == 2">
              <view>人脸识别</view>
              <view class="Compared-box flex-ct" @click="startSoterAuthentication">
                <image src="@/static/compared-box.png" mode="widthFix"></image>
                <view class="tips">点击进行识别</view>
              </view>
              <view>拍摄需知</view>
              <view class="tip">请您本人亲自完成，请将脸部置于提示框内，并按提示做动作。</view>
              <view class="mude flex-sb">
                <view class="model">
                  <image src="@/static/compared-1.png" mode="heightFix"></image>
                  <image class="right" src="@/static/right.png" mode="heightFix"></image>
                  <view>正对手机</view>
                </view>
                <view class="model">
                  <image src="@/static/compared-2.png" mode="heightFix"></image>
                  <image class="right" src="@/static/right.png" mode="heightFix"></image>
                  <view>光线充足</view>
                </view>
                <view class="model">
                  <image src="@/static/compared-3.png" mode="heightFix"></image>
                  <image class="right" src="@/static/right.png" mode="heightFix"></image>
                  <view>放慢动作</view>
                </view>
              </view>
            </view>
            <view class="step-3" v-if="step == 3">
              <image class="authenticating-img" src="@/static/authenticating.png"></image>
              <view class="authenticating-tips">
                <view>认证中</view>
                <text>已提交申请，等待后台处理</text>
                <navigator
                  hover-class="none"
                  open-type="switchTab"
                  url="/pages/home/index"
                  class="btn"
                >
                  返回首页
                </navigator>
              </view>
            </view>
          </view>
        </view>
        <view class="btn-2 lg" v-if="step == 1" @click="next" :class="{ disabled: disabled }">
          下一步
        </view>
      </view>
    </template>
  </view>
</template>

<script>
var that;
import { upload } from '@/api/oss.js';
import { idcardOcr, individualFace3Factors } from '@/api/company.js';
import { myRequest } from '@/api/api.js';
import { compressImage } from '@/utils/compress.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tab_fixed: true,
      navHeight: getApp().globalData.navHeight,
      iStatusBarHeight: getApp().globalData.iStatusBarHeight,
      title: '证件识别',
      step: 1,
      tempPicPaths: {
        front: '',
        back: '',
      },
      form: {
        nickname: '',
        idNumber: '',
        faceUrl: '',
      },
      fastClick: true,
      pageData: '',
      fastClick1: true,
      license: {
        license: '',
        id: '',
      },
    };
  },
  unmounted() {
    uni.hideLoading();
  },
  computed: {
    ...mapState(['userInfo']),
    disabled() {
      return !this.tempPicPaths.back || !this.tempPicPaths.front;
    },
  },
  onShow(e) {
    that = this;
    if (e && e?.photoUrl) {
      that.form.faceUrl = e.photoUrl;
      that.submit(that.form);
    }
    // that.getDetail();
    // that.step = 2
    if (that.userInfo.witnessComparison) {
      that.$refs.loading.hide();
    }
    // that.tab_fixed = false
  },
  methods: {
    getDetail() {
      myRequest('account', 'getVerifyResult').then(res => {
        if (res.data) {
          if (res.data.state == 0) {
            // 认证中
            that.step = 3;
            that.title = '认证中';
          }
          if (res.data.state == 2) {
            // 成功
            uni.redirectTo({
              url: './success',
            });
          }
          that.pageData = res.data;
        }
        setTimeout(() => {
          that.tab_fixed = false;
          that.$refs.loading.hide();
        }, 500);
      });
    },
    next() {
      if (!that.disabled) {
        // if (!that.fastClick) return;
        that.fastClick = false;
        uni.showLoading({
          title: '请稍等',
        });
        uni.getImageInfo({
          src: that.tempPicPaths.front,
          success: function (image) {
            uni.getImageInfo({
              src: that.tempPicPaths.back,
              success: function (imageBack) {
                upload([image, imageBack])
                  .then(path => {
                    if (path) {
                      const idCardFrontUrl = path[0].url;
                      const idCardBackUrl = path[1].url;
                      idcardOcr({ idCardFrontUrl, idCardBackUrl })
                        .then(ocrBack => {
                          if (ocrBack) {
                            that.form.nickname = ocrBack.name;
                            that.form.idNumber = ocrBack.idNo;
                            that.step = 2;
                          }
                          uni.hideLoading();
                        })
                        .catch(() => {});
                    }
                  })
                  .catch(() => {
                    uni.hideLoading();
                  });
              },
            });
          },
        });
      }
    },
    chooseImage(type) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (res) {
          compressImage(res.tempFiles[0]).then(filePath => {
            console.log('filePath :', filePath);
            that.tempPicPaths[type] = filePath;
          });
        },
      });
    },
    startSoterAuthentication() {
      if (that.fastClick1) {
        that.fastClick1 = false;
        console.log('111 :', 111);
        uni.navigateTo({
          url: './camera',
        });
      }
      setTimeout(() => {
        that.fastClick1 = true;
      }, 1000);
    },
    submit(data) {
      individualFace3Factors(data).then(res => {
        console.log('res :', res);
        that.step = 3;
      });
    },
  },
  onPageScroll(e) {
    if (e.scrollTop > 20) that.tab_fixed = true;
    else that.tab_fixed = false;
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 30rpx;
  background: #f4f4f4;
  .head-box {
    height: 156rpx;
    background-color: #fff;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* background: linear-gradient(45deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25)); */
    }
    .box {
      padding: 32rpx 102rpx;
      .slider {
        border-bottom: 1px dashed #999;
        > view {
          position: relative;
          .unThere {
            width: 12rpx;
            height: 12rpx;
            border-radius: 6rpx;
            background-color: #999;
            position: absolute;
            top: -4rpx;
          }
          .circle {
            border-radius: 50%;
          }
          .cricle-3 {
            position: absolute;
            width: 48rpx;
            height: 48rpx;
            top: -24rpx;
            left: -24rpx;
            background: #ccddff;
            .cricle-2 {
              width: 28rpx;
              height: 28rpx;
              background: #99bbff;
              .cricle-1 {
                width: 12rpx;
                height: 12rpx;
                background: #3277ff;
              }
            }
          }

          image {
            width: 48rpx;
            height: 48rpx;
            position: absolute;
            left: -18rpx;
            top: -24rpx;
          }
          text {
            position: absolute;
            white-space: nowrap;
            font-size: 26rpx;
            font-weight: 400;
            color: #676b8d;
            left: 50%;
            top: 44rpx;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
  .wrap-box {
    margin: 32rpx;
    background: #fff;
    .content {
      border-radius: 10rpx;
      position: relative;
      z-index: 1;

      display: flex;
      flex-direction: column;
      align-items: center;

      .bg {
        min-height: 132rpx;
        width: 100%;
        padding: 32rpx 0 0 0;
        border-radius: 12rpx;
        background: linear-gradient(180deg, #dbe2ff 0%, #ffffff 100%);
      }
      .idcard-front {
        margin-top: -108rpx;
        .title {
          margin-bottom: 32rpx;
        }
      }
      .idcard-back {
        padding-bottom: 32rpx;
        .title {
          margin: 40rpx 0 20rpx 0;
        }
      }
      image {
        width: 30rpx;
        height: 30rpx;
      }
      text {
        color: #e6541d;
        font-size: $uni-font-size-sm;
        word-break: break-all;
        text-align: justify;
      }
      &.fail {
        background: linear-gradient(180deg, #fcdede, rgba(255, 255, 255, 0));
      }

      .title {
        text-align: center;
        font-size: 28rpx;
      }
      .upload-box {
        width: 638rpx;
        height: 436rpx;
        position: relative;

        image {
          width: 100%;
          height: 100%;
        }
        .car {
          width: 566rpx;
          height: 364rpx;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #f2f2f2;
          border-radius: 20rpx;
          z-index: 1;
        }
        .icon-tianjia {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 164rpx;
          height: 164rpx;
          z-index: 1;
        }
      }

      .step-2 {
        padding: 0 36rpx 50rpx;
        margin-top: -108rpx;
        .tip {
          color: #c5c5c5;
          line-height: 46rpx;
          margin-top: 10rpx;
          font-size: 26rpx;
        }
        .mude {
          image {
            width: 152rpx;
            height: 152rpx;
          }
          .model {
            text-align: center;
            color: #c5c5c5;
            margin-top: 20rpx;
            font-size: $uni-font-size-sm;
            position: relative;
            .right {
              width: 30rpx;
              height: 30rpx;
              position: absolute;
              bottom: 42rpx;
              right: 0;
            }
          }
        }
        .Compared-box {
          margin-top: 20rpx;
          border: 1px dashed #c5c5c5;
          border-radius: 16rpx;
          height: 472rpx;
          margin-bottom: 40rpx;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 32rpx 68rpx;
          image {
            width: 100%;
            height: 100%;
          }
          .tips {
            width: 100%;
            text-align: center;
            font-size: 24rpx;
            font-weight: 400;
            color: #666666;
            margin: 32rpx 0 0 0;
          }
        }
      }
      .step-3 {
        margin-top: -36rpx;
        width: 100%;
        height: 992rpx;
        border-radius: 12rpx;
        position: relative;
        .authenticating-img {
          width: 490rpx;
          height: 414rpx;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
      text-align: center;
      .authenticating-tips {
        top: 30%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, 0);
        font-size: 26rpx;
        margin-bottom: 20rpx;
      }
      view {
        margin-bottom: 20rpx;
      }
      text {
        font-size: 24rpx;
        font-weight: 400;
        color: #bfbfbf;
      }
    }
  }

  .btn-2 {
    margin: 30rpx auto;
    width: 598rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    background: #3277ff;
    color: #fff !important;
    &.disabled {
      background: #ccddff;
      border: none;
    }
  }
}
.active {
  color: #3277ff !important;
}
.h100 {
  height: 100vh;
}

.btn {
  margin-top: 54rpx;
  width: 360rpx;
  height: 82rpx;
  border-radius: 8rpx;
  background: #3277ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #ffffff;
}
</style>
