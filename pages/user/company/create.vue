<!--
 * @Description:
 * @LastEditTime: 2022-09-13 11:12:50
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="row-card">
      <view class="text-28 bold">企业名称：</view>
      <input
        class="text-26"
        type="text"
        v-model.trim="name"
        :maxlength="50"
        placeholder="请输入营业执照上的企业名称"
        placeholder-style="color:#B9B9B9"
      />
    </view>
    <view class="required tip text-22 color-grey-minor">
      请填写正确的企业名称，否则将影响企业实名认证。
    </view>
    <view
      class="btn-primary text-32"
      :class="{
        disabled: !authentication || !name.trim(),
      }"
      @click="submit"
    >
      创建
    </view>
  </view>
</template>

<script>
var fastClick = true;
import { create } from '@/api/company.js';
import { info } from '@/api/login.js';
export default {
  data() {
    return {
      authentication: false,
      name: '',
    };
  },
  onLoad() {
    fastClick = true;
    info().then(data => {
      this.authentication = data.authentication;
    });
  },
  methods: {
    submit() {
      if (!this.authentication) {
        this.common.showToast('请先个人认证');
        return;
      }
      if (!this.name.trim()) {
        this.common.showToast('请输入企业名称');
        return;
      }
      if (!fastClick) return;
      fastClick = false;
      create({
        name: this.name,
      })
        .then(() => {
          uni.setStorageSync('refresh', '1');
          uni.navigateBack({
            delta: 1,
          });
        })
        .finally(err => {
          fastClick = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.row-card {
  margin-top: 32rpx;
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .text-28 {
    margin-bottom: 15rpx;
  }
}

.tip {
  margin-top: 24rpx;
  width: 686rpx;
  color: $uni-text-color-grey;

  &::before {
    content: '*';
    color: #ff0000;
  }
}

.btn-primary {
  margin-top: 70rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}
</style>
