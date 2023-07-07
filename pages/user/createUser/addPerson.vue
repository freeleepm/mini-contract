<template>
  <view class="page">
    <view class="title bold">个人签约方信息</view>
    <view class="form-box">
      <view class="name required">姓 名：</view>
      <input
        type="text"
        v-model.trim="form.name"
        :maxlength="50"
        class="flex-1"
        placeholder="请输入姓名"
        placeholder-style="color:#B9B9B9"
      />

      <view class="name required">手机号：</view>
      <input
        type="number"
        v-model.trim="form.phone"
        :maxlength="50"
        class="flex-1"
        placeholder="请输入手机号"
        placeholder-style="color:#B9B9B9"
      />

      <view class="required tip">请正确填写签署人的姓名和手机号，否则对方将不能收到签署信息。</view>
      <button class="btn" type="primary" @click="submit">创建</button>
    </view>
  </view>
</template>

<script>
var that;
var fastClick = true;
export default {
  data() {
    return {
      form: {
        name: '',
        phone: '',
      }

    };
  },
  methods: {
    submit() {
      that = this;
      if (!this.form.name.trim()) {
        that.common.showToast('请输入姓名')

        return;
      }
      if (!this.form.phone.trim()) {
        that.common.showToast('请输入手机号');
        return;
      }

      if (this.name.length > 50) {
        that.common.showToast('字数限制：50')

        return

      }
      if (!fastClick) return

      fastClick = false;
      create({
        name: this.name,
      })
        .then(() => {
          uni.navigateBack({
            delta: 1,
          })

        })
        .catch(err => {
          fastClick = true;
        })

    }

  }

}

</script>

<style lang="scss" scoped>
.page {
  padding: $page-spacing-base;
  .btn {
    line-height: 84rpx;
    text-align: center;
    color: $uni-color-primary;
    border: 1px solid $uni-color-primary;
  }
  .title {
    font-size: $uni-font-size-lg;
    position: relative;
    margin-top: 30rpx;
  }
  .title::before {
    width: 8rpx;
    position: absolute;
    border-radius: 0 4rpx 4rpx 0;
    content: '';
    height: 32rpx;
    top: calc(50% - 16rpx);
    left: -$page-spacing-base;
    background-color: $uni-color-primary;
  }
  .form-box {
    padding: 0 10rpx;
  }
  .list {
    .item {
      border-bottom: 1px solid $uni-border-color;
      padding: 20rpx 0;
      text {
        color: $uni-text-color-grey;
        margin-right: 20rpx;
      }
      .icon-person {
        font-size: 60rpx;
        color: $uni-text-color-grey;
        margin-right: 10rpx;
      }
      .icon-unCheck,
      .icon-checked {
        font-size: 36rpx;
      }
    }
  }
  .btn-fixed-box {
    height: calc(138rpx + env(safe-area-inset-bottom));
    .btn-fixed {
      .btn {
        width: 90%;
      }
    }
  }

  input {
    width: 100%;
    height: 84rpx;
    background-color: #f8f8f8;
    border-radius: $uni-border-radius-base;
    padding: 0 20rpx;
    margin: 20rpx 0;
  }
  .tip {
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }
  .btn {
    line-height: 84rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: $uni-color-primary;
    color: white;
    margin: 100rpx 40rpx;
    font-size: $uni-font-size-lg;
    letter-spacing: 4rpx;
  }
  /deep/ {
    uni-button[disabled][type='primary'] {
      opacity: 0.77;
    }
  }
  .name {
    margin-top: 30rpx;
  }
}
</style>
