<template>
  <button
    class="img-avatar"
    type="defualt"
    :open-type="userInfo ? 'chooseAvatar' : ''"
    @chooseavatar="onChooseAvatar"
  >
    <view
      v-if="userInfo.authentication"
      class="auth-box flex-ct"
      :class="{
        company: userInfo.companyId,
      }"
    >
      <image src="/static/auth-icon-white.png"></image>
    </view>
    <image class="img-avatar" :src="userInfo.avatarUrl"></image>
  </button>
</template>

<script>
import { upload } from '@/api/oss.js';
import userInfoApi from '@/api/api';
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapActions(['uinfo']),
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      upload([
        {
          path: avatarUrl,
          size: 500,
        },
      ]).then(path => {
        if (path) {
          userInfoApi.changeAvatar(path[0].url).then(() => {
            this.uinfo();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.img-avatar {
  margin-right: 16rpx;
  width: 100rpx;
  height: 100rpx;
  background: #ffffff;
  border-radius: 8rpx;
  .auth-box {
    width: 38rpx;
    height: 38rpx;
    border-radius: 8rpx;
    background: linear-gradient(180deg, #8ba7ff 0%, #4673ff 100%);
    position: absolute;
    bottom: 0;
    right: 0;
    image {
      width: 28rpx;
      height: 28rpx;
    }
    &.company {
      background: linear-gradient(139deg, #e0ceab 8%, #e2b36d 100%);
    }
  }
}
</style>
