<template>
  <view class="content">
    <!-- 欢迎页 -->
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(e) {
    console.log(e);
    this.$store
      .dispatch('login')
      .then(res => {
        if (e.id && e.uid && e.uid === res.id) {
          // 有合同 && 当前用户是签署方
          uni.redirectTo({
            url: '/pages/contract/detail/index?id=' + e.id,
          });
        } else {
          uni.reLaunch({
            url: '/pages/home/index',
          });
        }
      })
      .finally(() => {
        if (!e.id) {
          uni.reLaunch({
            url: '/pages/home/index',
          });
        }
      });
  },
};
</script>
