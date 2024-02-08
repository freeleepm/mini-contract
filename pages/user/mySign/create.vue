<template>
  <view class="page">
    <view class="box">
      <view class="item flex-sb">
        <view class="text-required bold">签名方式</view>
        <pickWay :model="FormData.type" @change="e => (FormData.type = e)" />
      </view>
      <view class="item flex-sb">
        <view class="text-required bold">签名备注</view>
        <text>{{ userInfo.nickname }}</text>
      </view>
    </view>
    <!-- 模板签名 -->
    <template v-if="FormData.type === 1">
      <view class="box">
        <view class="item flex-sb">
          <view class="bold">预览签名</view>
        </view>
        <view class="item">
          <image class="template-sign" src="https://dummyimage.com/1000x1000?text=张三"></image>
        </view>
      </view>
      <view class="box">
        <color-picker
          ref="color_"
          :color="FormData.color"
          @pickerColor="pickerColor"
        ></color-picker>
        <view class="item flex-sb" @click="$refs.color_.show()">
          <view class="text-required bold">印章颜色</view>
          <view class="flex-fs">
            <view
              class="color"
              :style="{
                backgroundColor: FormData.color,
              }"
            ></view>
            <uni-icons type="right" color="#B3B3B3" size="15"></uni-icons>
          </view>
        </view>
      </view>
    </template>
    <view class="box" v-else-if="FormData.type === 2">
      <view class="item flex-sb">
        <view class="bold">预览签名</view>
      </view>
      <view class="item">
        <view class="manual-sign flex-ct">
          <view class="manual-box">
            <navigator
              url="/pages/contract/sign/drawSign"
              open-type="navigate"
              hover-class="navigator-hover"
              class="manual-btn"
            >
              + 手写签名
            </navigator>
            <view class="manual-tip">在手机屏幕上绘制本人真是的个人签名</view>
          </view>
        </view>
      </view>
    </view>

    <btn-fixed>
      <view class="btn-primary">确认提交</view>
    </btn-fixed>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import pickWay from './components/pickWay';
export default {
  components: { pickWay },
  computed: {
    ...mapState(['userInfo']),
  },
  data() {
    return {
      FormData: {
        type: 1,
        color: '#000000',
      },
    };
  },
  methods: {
    pickerColor(color) {
      console.log(color);
      this.FormData.color = color.hex;
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 32rpx;
  .box {
    background: white;
    border-radius: 12rpx;
    margin-bottom: 24rpx;
    padding: 0 32rpx;
    .item {
      min-height: 104rpx;
      padding: 30rpx 0;
      border-bottom: 1px solid rgba(230, 230, 230, 0.8);
      &:nth-last-child(1) {
        border-bottom: none;
      }

      .template-sign {
        display: block;
        width: 100%;
        height: 350rpx;
      }
      .manual-sign {
        height: 350rpx;
        .manual-box {
          .manual-btn {
            width: 324rpx;
            margin: 0 auto 28rpx;
            line-height: 88rpx;
            border-radius: 8rpx;
            text-align: center;
            color: $uni-color-primary;
            background: #ffffff;
            border: 1px solid rgba(204, 204, 204, 0.8);
          }
          .manual-tip {
            color: #cccccc;
            font-size: 28rpx;
          }
        }
      }

      .color {
        width: 88rpx;
        height: 52rpx;
        margin-right: 20rpx;
      }
    }
  }

  .btn-primary {
    line-height: 88rpx;
  }
}
</style>
