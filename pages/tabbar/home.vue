<!--
 * @Description:
 * @LastEditTime: 2022-09-22 15:29:43
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="home flex-col">
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
    <view class="flex-sb menu-list">
      <view class="menu-item flex-col" @click="switchTab(1)">
        <view class="num" :class="{ 'num-warn': balanceQuery.myHandle }">
          {{ balanceQuery.myHandle || 0 }}
        </view>
        <view class="text-26">待我处理</view>
      </view>
      <view class="line-vertical"></view>
      <view class="menu-item flex-col" @click="switchTab(2)">
        <view class="num">
          {{ balanceQuery.othersHandle || 0 }}
        </view>
        <view class="text-26">待他人处理</view>
      </view>
      <view class="line-vertical"></view>
      <view class="menu-item flex-col" @click="toSign">
        <view class="num flex-ct">
          <image class="icon-contract" src="@/static/IconContract.png"></image>
        </view>
        <view class="text-26">签署合同</view>
      </view>
    </view>
    <!-- 最近文件 -->
    <view class="file-list">
      <view class="file-list-title flex-sb">
        <view class="text-28 bold">近期合同</view>
        <view class="text-26 flex-fs" @click="switchTab(0)">
          更多
          <uni-icons
            class="flex-ct icon-forward"
            type="forward"
            size="16"
            color="#B3B3B3"
          ></uni-icons>
        </view>
      </view>
      <view class="list" v-if="contract.length">
        <view
          class="item"
          v-for="(item, i) in contract"
          :key="i"
          @click="navigateTo('/pages/switchIdentity/contractDetails?id=' + item.id)"
        >
          <view class="title flex-sb">
            <view class="name flex-1 text-28 bold">
              {{ item.name || '' }}
            </view>
            <view
              class="tag-status text-26 flex-ct"
              style="color: #ee6a15; background: #ffefe6"
              v-if="item.state == 0"
            >
              待签署
            </view>
            <view
              class="tag-status text-26 flex-ct"
              style="color: #00cf15; background: #e6ffe8"
              v-if="item.state == 1"
            >
              已完成
            </view>
            <view
              class="tag-status text-26 flex-ct"
              style="color: #ff0000; background: #ffe8e8"
              v-if="item.state == 2"
            >
              已拒签
            </view>
            <view
              class="tag-status text-26 flex-ct"
              style="color: #ff0000; background: #ffe8e8"
              v-if="item.state == 3"
            >
              已撤销
            </view>
            <view
              class="tag-status text-26 flex-ct"
              style="color: #666666; background: #e6e6e6"
              v-if="item.state == 4"
            >
              已逾期
            </view>
          </view>
          <view class="date-box">
            <view class="text-26 flex text-elps">
              <view class="key">发起方</view>
              <view class="val">{{ item.initiatorName || '' }}</view>
            </view>
            <view class="text-26 flex text-elps">
              <view class="key">签署方</view>
              <view class="val">{{ item.signers }}</view>
            </view>
            <view class="text-26 flex">
              <view class="key">发起时间</view>
              <view class="val">{{ item.startTime || '' }}</view>
            </view>
            <view class="text-26 flex">
              <view class="key">截止时间</view>
              <view class="val">{{ item.endTime || '' }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="nodata" v-if="!contract.length">
        <BaseEmpty massage="暂无数据~"></BaseEmpty>
      </view>
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';

export default {
  data() {
    return {
      contract: [], //合同数组
      userInfo: '', //登录身份
      balanceQuery: '', //余额 与 待处理
      loading: true,
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
  onShow() {
    this.init();
  },
  methods: {
    toSign() {
      if (uni.getStorageSync('userInfo').token) {
        uni.navigateTo({
          url: '/pages/tabbar/sign',
        });
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '请先登录/注册，方可进行下一步操作',
          confirmText: '去登录',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: res => {
            if (res.confirm) {
              this.common.navigateTo('/pages/login/login?logout=1');
            }
          },
        });
      }
    },
    async init() {
      this.loading = true;
      if (!uni.getStorageSync('userInfo')) {
        this.loading = false;
        return;
      }
      await userInfoApi.personalInformation().then(data => {
        this.userInfo = data;
      });
      this.loading = false;
      await userInfoApi
        .contractList({
          pageNum: 1,
          pageSize: 10,
        })
        .then(data => {
          this.contract = data.rows;
        });
      await userInfoApi.balanceQuery().then(data => {
        this.balanceQuery = data;
      });
    },
    navigateTo(url) {
      this.common.navigateTo(url);
    },
    switchTab(type) {
      uni.setStorageSync('contractType', type);
      uni.switchTab({
        url: '/pages/tabbar/file',
      });
    },

    swiperChange({ detail }) {
      this.banners.forEach((item, index) => {
        item.active = index === detail.current;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  min-height: 100vh;
  background: #f5f5f5;

  .swiper-box {
    overflow: hidden;
    position: relative;
    margin-top: 32rpx;
    width: 686rpx;
    height: 200rpx;
    border-radius: 12rpx;

    .swiper {
      width: 100%;
      height: 100%;
    }

    .img-banner {
      width: 686rpx;
      height: 200rpx;
    }

    .swiper-dots {
      margin-right: -8rpx;
      position: absolute;
      bottom: 16rpx;
      left: 0;
      width: 100%;
    }

    .dot {
      margin-right: 8rpx;
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

  .menu-list {
    position: relative;
    margin-top: 32rpx;
    width: 686rpx;
    height: 156rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .line-vertical {
      width: 1px;
      height: 40rpx;
      background: #e6e6e6;
    }

    .menu-item {
      width: 227rpx;
      .num {
        position: relative;
        line-height: 51rpx;
        font-size: 40rpx;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #3277ff;
      }

      .num-warn {
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: -15rpx;
          width: 12rpx;
          height: 12rpx;
          background: #ff0000;
          border-radius: 50%;
        }
      }

      .text-26 {
        margin-top: 4rpx;
        line-height: 37rpx;
        color: #333333;
      }

      .icon-contract {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
  .file-list {
    margin-top: 32rpx;

    &-title {
      width: 686rpx;

      .text-26 {
        color: #666666;
      }

      .text-28 {
        color: #333333;
      }
    }
    .nodata {
      margin-top: 30rpx;
      width: 100%;
    }
    .list {
      margin-top: 20rpx;
      width: 686rpx;
      .item {
        overflow: hidden;
        background-color: #ffffff;
        position: relative;
        margin-bottom: 40rpx;
        border-radius: 12rpx;
        .title {
          padding: 28rpx;
          position: relative;
          background-color: #f7f9ff;
          border-bottom: 1px solid #e6e6e6;
          overflow: hidden;
          .name{
            white-space: break-spaces;
            word-break: break-all;
          }
        }

        .tag-status {
          padding: 0 20rpx;
          height: 40rpx;
          border-radius: 22rpx;
          align-self: flex-start;
          margin-left: 30rpx;
        }

        .date-box {
          padding: 0 28rpx;
          padding-bottom: 28rpx;
          background-color: white;
          border-radius: 0 0 30rpx 30rpx;

          .text-26 {
            margin-top: 29rpx;
            line-height: 37rpx;
          }

          .key {
            flex-shrink: 0;
            width: 152rpx;
            color: #999999;
          }

          .val {
            color: #333333;
          }
        }
      }
    }
  }
}
</style>
