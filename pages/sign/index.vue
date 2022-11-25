<!--
 * @Description:
 * @LastEditTime: 2022-09-06 10:56:22
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <view class="title">绘制签名</view>
    <view class="tip">*请在以下区域签署您的姓名，避免错别字或过于潦草导致无法律效力。</view>
    <canvas
      class="mycanvas"
      canvas-id="mycanvas"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    ></canvas>
    <view class="footer">
      <view class="left" @click="finish">保存</view>
      <view class="right" @click="clear">清除</view>
    </view>
  </view>
</template>

<script>
var x = 20;
var y = 20;
export default {
  data() {
    return {
      ctx: '',
      points: [],
    };
  },
  onLoad() {
    this.ctx = uni.createCanvasContext('mycanvas', this);
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  },
  methods: {
    touchstart: function (e) {
      let startX = e.changedTouches[0].x;
      let startY = e.changedTouches[0].y;
      let startPoint = { X: startX, Y: startY };
      this.points.push(startPoint);
      this.ctx.beginPath();
    },

    touchmove: function (e) {
      let moveX = e.changedTouches[0].x;
      let moveY = e.changedTouches[0].y;
      let movePoint = { X: moveX, Y: moveY };
      this.points.push(movePoint); //存点
      let len = this.points.length;
      if (len >= 2) {
        this.draw();
      }
    },
    touchend: function () {
      this.points = [];
    },
    draw: function () {
      let point1 = this.points[0];
      let point2 = this.points[1];
      this.points.shift();
      this.ctx.moveTo(point1.X, point1.Y);
      this.ctx.lineTo(point2.X, point2.Y);
      this.ctx.stroke();
      this.ctx.draw(true);
    },

    //清空画布
    clear: function () {
      let that = this;
      uni.getSystemInfo({
        success: function (res) {
          let canvasw = res.windowWidth;
          let canvash = res.windowHeight;
          that.ctx.clearRect(0, 0, canvasw, canvash);
          that.ctx.draw(true);
        },
      });
    },

    //完成绘画并保存到本地
    finish: function () {
      uni.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          console.log(res);
          let path = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: path,
          });
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
    font-weight: bold;
  }
  .tip {
    font-size: 24rpx;
    margin-top: 10rpx;
    color: $uni-text-color-grey;
  }
}
.mycanvas {
  width: 100%;
  height: 800rpx;
  border: 1px dashed red;
  background-color: #ffffff;
  margin-top: 30rpx;
}
.footer {
  font-size: 16px;
  height: 150upx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.left,
.right {
  line-height: 100upx;
  height: 100upx;
  width: 250upx;
  text-align: center;
  font-weight: bold;
  color: white;
  border-radius: 5upx;
}
.left {
  background: #007aff;
}
.right {
  background: orange;
}
</style>
