<template>
  <view>
    <template v-if="userInfo.witnessComparison">
      <view class="page">
        <status-bar title="识别" :HideBg="true" :Embedded="true" color="#FFFFFF"></status-bar>
        <view class="box">
          <cover-image
            v-if="!showCamera"
            class="cover-image"
            src="https://static.secee.tech/static/mp-weixin/evaluate/camera-cover.png"
            style="position: relative; width: 100%; height: 750rpx; display: block"
          ></cover-image>
          <camera
            v-if="showCamera"
            device-position="front"
            flash="off"
            @error="error"
            @initdone="initdone"
            style="width: 100%; height: 750rpx"
          >
            <cover-image
              class="cover-image"
              src="https://static.secee.tech/static/mp-weixin/evaluate/camera-cover.png"
            ></cover-image>
          </camera>
          <view style="height: 120rpx">
            <template v-if="errMsg">
              <view class="tip error">{{ errMsg }}</view>
              <view class="btn-2 lg" @click="takePhoto">点击重试</view>
            </template>
            <template v-else>
              <view class="tip">请正对摄像头以保证面部采集准确</view>
              <view class="seconds">
                {{ seconds ? seconds + ' S' : '' }}
              </view>
            </template>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
var that;
import { upload } from '@/api/oss.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      errMsg: '',
      timer: null,
      seconds: '',
      showCamera: true,
      hasRefuseed: false,
      ctx: null,
      setTimeout: null,
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  onShow() {
    that = this;
    if (that.timer) clearInterval(that.timer);
    that.showCamera = true;
    that.getSetting();
  },
  onUnload() {
    if (that.timer) clearInterval(that.timer);
    if (that.setTimeout) clearTimeout(that.setTimeout);
    if (that.ctx) that.ctx.stopRecord();
  },
  methods: {
    error(e) {
      if (!that.hasRefuseed) {
        uni.navigateBack();
      }
    },
    initdone() {
      if (!that.hasRefuseed) {
        that.takePhoto();
      }
    },
    getSetting() {
      uni.getSetting({
        success(res) {
          if (res.authSetting['scope.camera'] === false) {
            // 已拒绝
            that.hasRefuseed = true;
            that.showCamera = false;
            that.toOpenSetting();
          }
          if (res.authSetting['scope.camera'] === true) {
            //已经授权
            that.takePhoto();
          }
        },
      });
    },
    toOpenSetting() {
      uni.showModal({
        title: '请确认授权，否则无法进认证',
        content: '请在“设置”中打开“摄像头”开关',
        confirmText: '去打开',
        cancelColor: '#999999',
        cancelText: '残忍拒绝',
        success: function (res) {
          if (res.confirm) {
            uni.openSetting();
          } else {
            uni.navigateBack();
          }
        },
      });
    },
    takePhoto() {
      that.errMsg = '';
      that.seconds = 5;
      if (that.timer) clearInterval(that.timer);
      that.timer = setInterval(() => {
        if (that.seconds > 0) {
          that.seconds--;
        } else {
          clearInterval(that.timer);
          that.seconds = '';
        }
      }, 1000);
      that.setTimeout = setTimeout(() => {
        that.ctx = uni.createCameraContext();
        that.ctx.takePhoto({
          quality: 'high',
          success: res => {
            console.log('res :', res);
            that.src = res.tempImagePath;
            upload([{ path: res.tempImagePath, size: 99999 }])
              .then(callback => {
                console.log('callback :', callback);
                if (callback.length) {
                  setTimeout(() => {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];
                    let obj = {
                      photoUrl: callback[0].url,
                    };
                    prevPage.onShow(obj);
                    uni.navigateBack();
                  }, 0);
                }
              })
              .catch(err => {
                that.errMsg = err;
                clearInterval(that.timer);
                that.seconds = '';
              });
          },
        });
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .box {
    width: 100%;
    position: relative;
    .cover-image {
      position: absolute;
      width: 100%;
      height: 750rpx;
    }
    .tip {
      text-align: center;
      color: white;
      font-size: 34rpx;
      margin-top: 20rpx;
      font-weight: bold;
      &.error {
        color: red;
      }
    }
    .btn-2 {
      margin: 30rpx auto;
    }
    .seconds {
      text-align: center;
      color: $uni-color-success;
      font-size: 34rpx;
      height: 34rpx;
      margin-top: 20rpx;
      font-weight: bold;
    }
  }
}
</style>
