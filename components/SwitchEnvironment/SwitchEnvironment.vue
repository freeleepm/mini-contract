<template>
  <view @click="change"><slot></slot></view>
</template>

<script>
import config from '@/config/config.js';
import { mockUrl, devUrl, testUrl, prodUrl } from '@/config/net.config.js';

var that;
export default {
  name: 'SwitchEnvironment',
  data() {
    return {
      fastClickCount: 0, // 点击次数
      fastClickLastTime: 0, // 点击时间
    };
  },
  created() {
    that = this;
  },
  methods: {
    change() {
      if (this.fastClickCount < 10) {
        var currentTime = new Date().getTime();
        //记录两次相连的点击时间间隔，大于1秒，重新记录点击次数
        this.fastClickCount =
          currentTime - this.fastClickLastTime < 1000 ? this.fastClickCount + 1 : 1;
        this.fastClickLastTime = new Date().getTime();
        if (this.fastClickCount > 9) {
          // 点击10次后执行
          uni.showActionSheet({
            itemList: [
              'mock：' + mockUrl,
              'dev：' + devUrl,
              'test：' + testUrl,
              'prod：' + prodUrl,
            ],
            success: function (res) {
              if (res.tapIndex === 0) {
                config.baseUrl = mockUrl;
                uni.showToast({ title: '已切换为mock环境', icon: 'none' });
              } else if (res.tapIndex === 1) {
                config.baseUrl = devUrl;
                uni.showToast({ title: '已切换为开发环境', icon: 'none' });
              } else if (res.tapIndex === 2) {
                config.baseUrl = testUrl;
                uni.showToast({ title: '已切换为测试环境', icon: 'none' });
              } else if (res.tapIndex === 3) {
                config.baseUrl = prodUrl;
                uni.showToast({ title: '已切换为生产环境', icon: 'none' });
              }
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/index/index',
                });
              }, 666);
            },
            complete: function () {
              that.fastClickCount = 0;
              that.fastClickLastTime = 0;
            },
          });
        }
      }
    },
  },
};
</script>
