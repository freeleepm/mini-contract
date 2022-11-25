<!--
 * @Description:
 * @LastEditTime: 2022-09-06 10:56:28
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <view class="name bold">签署文件：{{ file.name }}</view>
    <view class="border"></view>
    <view class="file">
      <image :src="file.url | imgFilter" mode="widthFix"></image>
      <text
        class="date"
        @touchstart="touchstart"
        @touchmove.prevent="touchmove"
        :style="{
          top: top + 'px',
          left: left + 'px',
        }"
      >
        {{ date }}
      </text>
    </view>

    <view class="height"></view>
    <view class="flex-fs btn-fixed">
      <!-- 企业 -->
      <view v-if="userInfo.companyId">
        <text class="iconfont icon-bianji"></text>
        <view>企业签名</view>
      </view>
      <!-- 个人 -->
      <view @click="common.navigateTo('pickPersonSign')" v-else>
        <text class="iconfont icon-bianji"></text>
        <view>个人签名</view>
      </view>
      <picker mode="date" @change="change">
        <view>
          <text class="iconfont icon-riqi"></text>
          <view>签署日期</view>
        </view>
      </picker>
      <view class="flex-1"></view>
      <view class="btn-2">签署</view>
    </view>
  </view>
</template>

<script>
var that;
import { info } from '@/api/login.js';
export default {
  data() {
    return {
      file: '',
      userInfo: '',

      date: '',
      left: 10,
      top: 10,

      x: 0,
      y: 0,
      h: 0,
      w: 0,
    };
  },
  onShow() {
    that = this;
    uni.getStorage({
      key: 'file',
      success: function (res) {
        if (res.data) that.file = res.data;
      },
    });
    info().then(data => {
      that.userInfo = data;
    });
  },
  methods: {
    touchstart(e) {
      uni
        .createSelectorQuery()
        .in(this)
        .select('.file')
        .boundingClientRect(res => {
          that.h = res.height - 10;
          that.w = res.width - 10;
          uni
            .createSelectorQuery()
            .in(this)
            .select('.date')
            .boundingClientRect(res1 => {
              that.h -= res1.height;
              that.w -= res1.width;
            })
            .exec();
        })
        .exec();
      that.x = e.touches[0].clientX;
      that.y = e.touches[0].clientY;
    },
    touchmove(e) {
      that.left += e.touches[0].clientX - that.x;
      if (that.left < 10) that.left = 10;
      if (that.left > that.w) that.left = that.w;
      that.x = e.touches[0].clientX;

      that.top += e.touches[0].clientY - that.y;
      if (that.top < 10) that.top = 10;
      if (that.top > that.h) that.top = that.h;
      that.y = e.touches[0].clientY;
    },
    change(e) {
      that.date = e.detail.value;
      console.log(e.detail.value);
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
.name {
  padding: 20rpx;
}
.border {
  height: 10rpx;
  background-color: #f8f8f8;
}
.file {
  position: relative;
  image {
    width: 100%;
    display: block;
  }
  .date {
    position: absolute;
    z-index: 2;
  }
}
.btn-fixed {
  text-align: center;
  > view {
    &:nth-child(1) {
      margin-right: 30rpx;
    }
  }
  .iconfont {
    font-size: 36rpx;
  }
  .btn-2 {
    width: 250rpx;
  }
}
.height {
  height: calc(148rpx + env(safe-area-inset-bottom));
}
</style>
