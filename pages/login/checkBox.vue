<template>
  <view class="text-28 flex-ct" @click="onChange">
    <view class="check-box flex-ct" :class="{ active: checked }">
      <image src="@/static/check.png" class="icon" mode="widthFix"></image>
    </view>
    <view>请阅读并同意</view>
    <navigator @click.stop class="text-link" hover-class="none" url="/pages/user/setting/Privacy">
      《一合通服务协议和隐私政策》
    </navigator>
  </view>
</template>

<script>
export default {
  props: {
    check: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  created() {
    this.checked = this.check;
  },
  methods: {
    onChange() {
      this.checked = !this.checked;
      this.$emit('change', this.checked);
    },
  },
};
</script>

<style lang="scss" scoped>
.text-link {
  color: $uni-color-primary;
}
.check-box {
  width: 30rpx;
  height: 30rpx;
  border: 1px solid #999999;
  border-radius: 4rpx;
  margin-right: 8rpx;
  box-sizing: border-box;
  .icon {
    width: 100%;
  }
  &.active {
    border: 1px solid $uni-color-primary;
    background-color: $uni-color-primary;
  }
}
</style>
