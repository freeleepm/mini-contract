<template>
  <view class="tag-status">
    <template v-if="currentState">
      <text :style="{ color: currentState.color }">{{ currentState.label }}</text>
    </template>
    <text v-else style="color: #ee6a15">未知状态</text>
  </view>
</template>

<script>
export default {
  name: 'contractState',
  props: {
    state: {
      type: Number || String,
      default: -1,
    },
    type: {
      type: String,
      default: '',
    },
  },
  computed: {
    currentState() {
      return this.list.find(k => k.value == this.state);
    },
  },
  data() {
    return {
      list: [
        { label: '待签署', value: 0, color: '#ee6a15' },
        { label: '已签署', value: 1, color: '#00cf15' },
        { label: '已拒签', value: 2, color: '#ff0000' },
        { label: '已撤销', value: 3, color: '#ff0000' },
        { label: '已逾期', value: 4, color: '#999999' },
        { label: '签署失败', value: 5, color: '#ff0000' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.tag-status {
  padding: 0 20rpx;
  border-radius: 22rpx;
  align-self: flex-start;
  margin-left: 30rpx;
  text {
    font-size: 26rpx;
  }
}
</style>
