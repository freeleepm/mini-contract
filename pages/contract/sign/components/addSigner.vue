<template>
  <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
    <view class="add-signer padding-safe">
      <view class="title bold text-32">添加签署方</view>
      <view class="form-box" :style="{ 'padding-bottom': KeyboardHeight + 'px' }">
        <view class="form-item flex-sb">
          <text class="text-28 color-base text-required">签署方类型</text>
          <view class="flex-ct switch-box">
            <view class="switch" :class="{ active: signer.type === 0 }" @click="signer.type = 0">
              个人
            </view>
            <view class="switch" :class="{ active: signer.type === 1 }" @click="signer.type = 1">
              企业
            </view>
            <view class="bar" :style="{ left: signer.type === 1 ? '50%' : '0' }"></view>
          </view>
        </view>
        <template v-if="signer.type === 0">
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">姓名</text>
            <input
              :adjust-position="false"
              type="text"
              @blur="KeyboardHeight = 0"
              @input="onInput($event, 1)"
              v-model="signer.person.name"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">手机号</text>
            <input
              :adjust-position="false"
              type="number"
              :maxlength="11"
              @blur="KeyboardHeight = 0"
              v-model="signer.person.mobile"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
        </template>
        <template v-if="signer.type === 1">
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">经办人姓名</text>
            <input
              :adjust-position="false"
              type="text"
              @blur="KeyboardHeight = 0"
              @input="onInput($event, 2)"
              v-model="signer.company.agentName"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">经办人手机</text>
            <input
              :adjust-position="false"
              type="number"
              @blur="KeyboardHeight = 0"
              :maxlength="11"
              v-model="signer.company.agentMobile"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
          <view class="form-item flex-sb">
            <text class="text-28 color-base text-required">企业名称</text>
            <input
              :adjust-position="false"
              type="text"
              @blur="KeyboardHeight = 0"
              v-model="signer.company.name"
              :maxlength="50"
              placeholder-class="place"
              placeholder="请输入"
            />
          </view>
        </template>
        <view class="btn-primary" @click="onSubmit">确定</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import reg from '@/utils/reg.js';
export default {
  data() {
    return {
      signer: '',
      KeyboardHeight: 0,
    };
  },
  created() {
    uni.onKeyboardHeightChange(res => {
      this.KeyboardHeight = res.height;
    });
  },
  beforeDestroy() {
    uni.offKeyboardHeightChange();
  },
  methods: {
    open(type) {
      this.signer = {
        type: type || 0, // 类型(0:个人;1:公司;)
        person: {
          name: '', // 用户名
          mobile: '', // 手机号
        },
        company: {
          name: '', // 公司名
          agentName: '', // 经办人姓名
          agentMobile: '', // 经办人手机
        },
      };
      this.$refs.popupRef.open();
    },
    onInput(e, t) {
      setTimeout(() => {
        if (t === 1) {
          this.signer.person.name = this.signer.person.name.slice(0, 5);
        } else if (t === 2) {
          this.signer.company.agentName = this.signer.company.agentName.slice(0, 5);
        }
      }, 50);
    },
    onSubmit() {
      if (this.signer.type === 0) {
        if (!this.signer.person.name) {
          uni.showToast({
            title: '请输入签署方姓名',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.person.mobile) {
          uni.showToast({
            title: '请输入签署方手机号',
            icon: 'none',
          });
          return;
        }
        if (!reg.phone.test(this.signer.person.mobile)) {
          uni.showToast({
            title: '签署方手机号有误',
            icon: 'none',
          });
          return;
        }
      }
      if (this.signer.type === 1) {
        if (!this.signer.company.agentName) {
          uni.showToast({
            title: '请输入经办人姓名',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.company.agentMobile) {
          uni.showToast({
            title: '请输入经办人手机',
            icon: 'none',
          });
          return;
        }
        if (!reg.phone.test(this.signer.company.agentMobile)) {
          uni.showToast({
            title: '经办人手机号有误',
            icon: 'none',
          });
          return;
        }
        if (!this.signer.company.name) {
          uni.showToast({
            title: '请输入公司名',
            icon: 'none',
          });
          return;
        }
      }
      this.$emit('change', JSON.parse(JSON.stringify(this.signer)));
      this.$refs.popupRef.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.add-signer {
  background-color: #ffffff;
  .title {
    text-align: center;
    padding-top: 34rpx;
  }
  .form-box {
    padding-bottom: 32rpx;
    .form-item {
      padding: 32rpx;
      border-bottom: 1px solid $uni-border-color;
      input {
        flex: 1;
        text-align: right;
        font-size: 28rpx;
        padding-left: 30rpx;
      }
      .switch-box {
        height: 66rpx;
        border-radius: 34rpx;
        background: #f6f6f6;
        position: relative;
        .bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 50%;
          border-radius: 34rpx;
          background: $uni-color-primary;
          transition: all 0.15s;
        }
        .switch {
          font-size: 28rpx;
          width: 100rpx;
          text-align: center;
          position: relative;
          z-index: 1;
          &.active {
            color: white;
          }
        }
      }
    }
    .btn-primary {
      margin: 32rpx 32rpx 0;
      line-height: 88rpx;
    }
  }
}
</style>
