<template>
  <view class="swiper-box">
    <swiper class="swiper" circular @change="swiperChange" autoplay interval="5000">
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image class="img-banner" :src="item.img"></image>
      </swiper-item>
    </swiper>
    <view class="swiper-dots flex-ct">
      <view
        v-for="(item, index) in banners"
        :key="index"
        class="dot"
        :class="{ 'dot-active': item.active }"
      ></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      banners: [
        {
          img: require('@/static/ImgBanner2.png'),
          active: false,
        },
        {
          img: require('@/static/ImgBanner1.png'),
          active: true,
        },
      ],
    };
  },
  methods: {
    swiperChange({ detail }) {
      this.banners.forEach((item, index) => {
        item.active = index === detail.current;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper-box {
  overflow: hidden;
  position: relative;
  height: 200rpx;
  border-radius: 12rpx;

  .swiper,
  .img-banner {
    width: 100%;
    height: 100%;
  }
  .swiper-dots {
    position: absolute;
    bottom: 16rpx;
    left: 0;
    width: 100%;
  }

  .dot {
    margin: 0 4rpx;
    width: 20rpx;
    height: 2rpx;
    background: #ffffff;
    border-radius: 1px;
    opacity: 0.5;
  }

  .dot-active {
    opacity: 1;
  }
}
</style>
