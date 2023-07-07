<template>
  <view
    class="flex-sb file-card"
    :style="{
      borderBottom: border ? '1px solid #F6F6F6' : 'none',
      background: bg,
    }"
  >
    <view class="flex-fs flex-1" v-if="file">
      <image
        v-if="file.name.indexOf('.doc') > -1"
        class="icon-doc"
        src="@/static/IconDoc.png"
      ></image>
      <image
        v-else-if="file.name.indexOf('.pdf') > -1"
        class="icon-doc"
        src="@/static/IconPdf.png"
      ></image>
      <image v-else class="icon-doc" src="@/static/IconPdf.png"></image>
      <view class="flex-1">
        <view class="text-name text-elps text-26 color-base">{{ file.name }}</view>
        <view class="text-24 color-grey-minor">{{ file.size | size }}</view>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'FileItem',
  props: {
    file: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    bg: {
      type: String,
      default: '#F6F6F6',
    },
    border: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.file-card {
  padding: 32rpx;
  border-radius: 8rpx;
  .icon-doc {
    margin-right: 16rpx;
    width: 74rpx;
    height: 74rpx;
  }
  .text-name {
    margin-bottom: 6rpx;
    word-break: break-word;
  }
}
</style>
