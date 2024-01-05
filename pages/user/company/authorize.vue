<template>
  <view>
    <web-view :src="path"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      path: '',
    };
  },
  onLoad(e) {
    if (e.path) this.path = decodeURIComponent(e.path);
    if (e.title) {
      uni.setNavigationBarTitle({
        title: e.title,
      });
    }
  },
};
</script>

<style lang="scss"></style>
