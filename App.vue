<!--
 * @Description:
 * @LastEditTime: 2022-09-08 11:23:42
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<script>
export default {
  onLaunch: function () {
    // #ifndef H5
    let menuButtonObject = uni.getMenuButtonBoundingClientRect();
    this.globalData.menuButtonObject = menuButtonObject;
    uni.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navHeight;
        this.globalData.iStatusBarHeight = statusBarHeight;
        navHeight = menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
      },
    });
    // #endif
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  globalData: {
    navHeight: 44, //导航栏的高度
    menuButtonObject: 0, //胶囊参数
    iStatusBarHeight: 0,
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
// @import '//at.alicdn.com/t/font_3296495_i5mdkgf1e4.css';
@import '@/common/common.scss';
.tag-status {
          padding: 0 20rpx;
          height: 40rpx;
          border-radius: 22rpx;
          align-self: flex-start;
          margin-left: 30rpx;
        }
    .status-color-0, .status-color--2{ color: #ee6a15; background: #ffefe6;}
    // 已完成
    .status-color-1{ color: #00cf15; background: #e6ffe8;}
    .status-color-2{ color: #ff0000; background: #fdebeb;}
    .status-color-3{ color: #ff0000; background: #fdebeb;}
    .status-color-4{ color: #666666; background: #E6E6E6;}
    .status-color-5{ color: #666666; background: #E6E6E6;}
</style>
