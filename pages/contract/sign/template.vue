<!--
 * @Author: wudi
 * @Date: 2023-12-11 16:00:20
 * @LastEditors: wudi
 * @LastEditTime: 2023-12-15 15:41:03
 * @Description:
-->
<template>
  <view></view>
</template>

<script>
var that;
export default {
  data() {
    return {};
  },
  onShow() {
    if(uni.getStorageSync('signing')) {
      uni.removeStorageSync('signing');
      uni.reLaunch({
            url: '/pages/home/index'
      });
      return;
    }
    uni.navigateTo({
        url: '/pages/contract/sign/index',
     });
  },

};
</script>
<style lang="scss">

</style>
