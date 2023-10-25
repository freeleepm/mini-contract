<!--
 * @Description:
 * @LastEditTime: 2023-09-20 10:30:14
 * @LastEditors: wudi
 * @Author: 刘仁秀
 * @Date: 2022-09-05 16:57:04
-->
<template>
  <view class="container" :style="style">
    <image class="img-empty" src="@/static/ImgEmpty.png"></image>
    <view class="massage" v-html="massage"></view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    massage: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      default: '',
    }
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .img-empty {
    width: 300rpx;
    height: 300rpx;
  }

  .massage {
    margin-top: 10rpx;
    font-size: 26rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    color: #999999;
    line-height: 46rpx;
    text-align: center;
  }
}
</style>
