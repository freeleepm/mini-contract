<template>
  <view class="home">
    <banner />

    <view class="flex-sb menu-list">
      <view class="menu-item flex-col" @click="switchTab(1)">
        <view class="num" :class="{ 'num-warn': balanceQuery.myHandle }">
          {{ balanceQuery.myHandle || 0 }}
        </view>
        <view class="text-26 color-base">待我处理</view>
      </view>
      <view class="line-vertical"></view>
      <view class="menu-item flex-col" @click="switchTab(2)">
        <view class="num">
          {{ balanceQuery.othersHandle || 0 }}
        </view>
        <view class="text-26 color-base">待他人处理</view>
      </view>
      <view class="line-vertical"></view>
      <view class="menu-item flex-col" @click="navigateTo('/pages/contract/sign/index', 1)">
        <view class="num flex-ct">
          <image class="icon-contract" src="@/static/IconContract.png"></image>
        </view>
        <view class="text-26 color-base">签署合同</view>
      </view>
    </view>
    <contractTemplateBox @onClick="navigateTo('/pages/home/contractTemplate/index', 1)" />
    <!-- 最近文件 -->
    <view class="file-list">
      <view class="file-list-title flex-sb">
        <view class="text-28 bold color-base">近期合同</view>
        <view class="flex-fs" @click="switchTab(0)">
          <text class="text-26 color-base-minor">更多</text>
          <uni-icons
            class="flex-ct icon-forward"
            type="forward"
            size="16"
            color="#B3B3B3"
          ></uni-icons>
        </view>
      </view>
      <view class="list" v-if="contract.length">
        <contractCard :item="item" v-for="(item, i) in contract" :key="item.id" />
      </view>
      <view class="nodata" v-if="!contract.length">
        <BaseEmpty massage="暂无数据~"></BaseEmpty>
      </view>
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import contractTemplateBox from './components/contractTemplateBox';
import contractCard from './components/contractCard';
import banner from './components/banner';
import { mapState, mapActions } from 'vuex';
export default {
  components: { contractTemplateBox, contractCard, banner },
  data() {
    return {
      contract: [], //合同数组
      balanceQuery: '', //余额 与 待处理
    };
  },
  onShow() {
    this.init();
  },
  computed: {
    ...mapState(['token']),
  },
  methods: {
    async init() {
      if (!this.token) {
        return;
      }
      await userInfoApi.balanceQuery().then(data => {
        this.balanceQuery = data;
      });
      await userInfoApi
        .contractList({
          pageNum: 1,
          pageSize: 10,
        })
        .then(data => {
          this.contract = data.rows;
        });
    },
    navigateTo(url, checkLogin) {
      if (checkLogin && !this.token) {
        this.common.toLogin();
        return;
      }
      this.common.navigateTo(url);
    },
    switchTab(type) {
      if (!this.token) {
        this.common.toLogin();
        return;
      }
      uni.setStorageSync('contractType', type);
      uni.switchTab({
        url: '/pages/contract/index',
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
  padding: 32rpx;

  .menu-list {
    position: relative;
    margin-top: 32rpx;
    height: 156rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .line-vertical {
      width: 1px;
      height: 40rpx;
      background: #e6e6e6;
    }

    .menu-item {
      flex: 1;
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
        line-height: 38rpx;
      }

      .icon-contract {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
  .file-list {
    margin-top: 32rpx;

    .nodata {
      margin-top: 30rpx;
    }
    .list {
      padding: 32rpx 0;
    }
  }
}
</style>
