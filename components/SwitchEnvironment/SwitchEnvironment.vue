<template>
  <view @click="change"><slot></slot></view>
</template>

<script>
import config from '@/static/config/index.js';
import netConfig from '@/static/config/net.config.js';
var that;
export default {
  name: 'SwitchEnvironment',
  data() {
    return {
      fastClickCount: 0,
      fastClickLastTime: 0,
      requestList: [],
    };
  },
  created() {
    that = this;
    for (let k in netConfig.requestUrl) {
      this.requestList.push({
        url: netConfig.requestUrl[k],
        name: k,
      });
    }
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
            itemList: that.requestList.map(k => {
              return k.name + ':' + k.url;
            }),
            success: function (res) {
              config.baseUrl = that.requestList[res.tapIndex].url;
              config.manageAdminUrl =
                netConfig.manageAdminUrls[that.requestList[res.tapIndex].name] ||
                netConfig.manageAdminUrls['dev'];
              uni.showToast({
                title: '已切换为' + that.requestList[res.tapIndex].name.replace('Url', '') + '环境',
                icon: 'none',
              });
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/index/index',
                });
              }, 800);
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
