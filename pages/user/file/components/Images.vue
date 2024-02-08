<template>
  <uni-popup ref="popupRef" @maskClick="onClose" type="center" class="color-base" :safe-area="true">
    <view class="box">
      <view class="img-list">
        <shmily-drag-image @add="pickImg" keyName="path" v-model="ImageList"></shmily-drag-image>
      </view>
      <button type="primary" :disabled="ImageList.length < 1" @click="onSubmit">
        {{ loading ? '正在合成···' : '合成PDF' }}
      </button>
    </view>
  </uni-popup>
</template>

<script>
import { upload } from '@/api/oss.js';
import { imagesToPdf } from '@/api/file.js';
var that;
export default {
  data() {
    return {
      ImageList: [],
      loading: false,
    };
  },
  created() {
    that = this;
  },
  methods: {
    pickImg() {
      // #ifdef MP
      uni.chooseMedia({
        count: 20,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        success(res) {
          const tempFiles = res.tempFiles.map(i => {
            return {
              size: i.size,
              path: i.tempFilePath,
            };
          });
          that.ImageList = [...that.ImageList, ...tempFiles];
          that.$refs.popupRef.open();
        },
      });
      // #endif
      // #ifdef H5
      uni.showToast({
        title: '请在小程序端打开',
        icon: 'none',
      });
      // #endif
    },
    onClose() {
      console.log('----------');
      that.ImageList = [];
    },
    onSubmit() {
      this.loading = true;
      const i = this.ImageList[0].path.lastIndexOf('/');
      const j = this.ImageList[0].path.lastIndexOf('.');
      const name = this.ImageList[0].path.slice(i + 1, j);
      const size = this.ImageList.reduce((prev, cur) => {
        return prev + cur.size;
      }, 0);
      upload(this.ImageList)
        .then(urls => {
          if (urls) {
            imagesToPdf({
              imageUrls: urls.map(i => {
                return i.url;
              }),
            })
              .then(res => {
                this.$refs.popupRef.close();
                this.$emit('success', {
                  url: res,
                  size: size,
                  name: name.slice(0, 15) + '.pdf',
                });
                this.ImageList = [];
              })
              .finally(() => {
                this.loading = false;
              });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  background: white;
  border-radius: 12rpx;
  width: 650rpx;
  padding: 20rpx;
}
.img-list {
  height: 75vh;
  margin-left: -10rpx;
  margin-right: -10rpx;
  margin-bottom: 20rpx;
  overflow-y: auto;
}
</style>
