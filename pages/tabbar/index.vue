<!--
 * @Description:
 * @LastEditTime: 2022-09-05 14:52:40
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page">
    <backTop ref="top"></backTop>
    <home ref="home" v-if="tab == 0" @tab="toFile"></home>
    <file ref="file" v-if="tab == 1" @tab="change"></file>
    <sign ref="sign" v-if="tab == 2" @tab="change"></sign>
    <user ref="user" v-if="tab == 3"></user>
    <view class="my-tabbar">
      <view class="list flex-sb">
        <view
          class="item flex-ct"
          v-for="(item, i) in tabs"
          :key="i"
          :class="{
            active: i == tab,
          }"
          @click="change(i)"
        >
          <text class="iconfont" :class="item.icon"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import home from './home';
import file from './file';
import sign from './sign';
import user from './user';
var that;
export default {
  components: {
    home,
    file,
    sign,
    user,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        { icon: 'icon-home' },
        { icon: 'icon-hetong' },
        { icon: 'icon-qianshu' },
        { icon: 'icon-user' },
      ],
    };
  },
  onShow() {
    this.init();
    that = this;
    // #ifdef MP-WEIXIN
    wx.hideHomeButton();
    // #endif
  },
  onLoad(e) {
    if (e.tab) {
      this.tab = e.tab;
    }
  },
  onUnload() {},
  methods: {
    change(i) {
      this.tab = i;
      this.init();
    },
    toFile(i, k) {
      this.tab = i;
      this.init(k);
    },
    init(k) {
      this.$nextTick(function () {
        if (that.tab == 0) {
          that.$refs.home.init();
        }
        if (that.tab == 1) {
          that.$refs.file.current = k || 0;
          that.$refs.file.init();
        }
        if (that.tab == 2) {
          that.$refs.sign.init();
        }
        if (that.tab == 3) {
          that.$refs.user.init();
        }
      });
    },
  },
  onReachBottom() {
    if (that.tab == 1) {
      that.$refs.file.loadMore();
    }
  },
  onPullDownRefresh() {
    this.init();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1500);
  },
  onPageScroll(e) {
    if (e.scrollTop > 666) that.$refs.top.show();
    else that.$refs.top.hide();
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
  background-color: #fafeff;
  padding-bottom: calc(168rpx + env(safe-area-inset-bottom));
}
.my-tabbar {
  height: calc(168rpx + env(safe-area-inset-bottom));
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 20rpx;
  z-index: 3;
  background-color: #ffffff;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  .list {
    height: 100%;
    background-color: #e7f3ff;
    width: 100%;
    border-radius: 40rpx;
    padding: 0 30rpx;
    .item {
      width: 128rpx;
      height: 106rpx;
      border-radius: 27px;
      text {
        font-size: 50rpx;
        color: #a0aec0;
        &.icon-qianshu {
          font-size: 58rpx;
        }
      }
      &.active {
        background: $uni-color-primary;
        box-shadow: 0px 4rpx 10rpx 0px rgba(0, 59, 64, 0.18);
        text {
          color: white;
        }
      }
    }
  }
}
</style>
