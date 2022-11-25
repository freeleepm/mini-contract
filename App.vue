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
</style>
