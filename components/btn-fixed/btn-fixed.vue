<template>
  <view
    class="btn-fixed-box"
    :style="{
      height: 'calc(60rpx + env(safe-area-inset-bottom) + ' + slotHeight + 'px)',
    }"
  >
    <view class="btn-fixed">
      <view id="solt-box">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'btn-fixed',
  props: ['txt'],
  data() {
    return {
      slotHeight: 1,
    };
  },
  created() {
    this.$nextTick(() => {
      const query = uni.createSelectorQuery().in(this);
      if (query) {
        query
          .select('#solt-box')
          .boundingClientRect(data => {
            this.slotHeight = data.height + 1;
          })
          .exec();
      }
    });
  }

};
</script>

<style lang="scss" scoped>
.btn-fixed-box {
  .btn-fixed {
    position: fixed;
    border-top: 1px solid #f2f2f2;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx;
    background-color: #ffffff;
    z-index: 3;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  }
}
</style>
