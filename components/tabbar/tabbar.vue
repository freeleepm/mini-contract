<template>
  <view class="tabbar-box">
    <view class="flex-fs tab-list">
      <view
        v-for="(item, i) in List"
        :key="i"
        class="tab-item"
        :class="{
          active: activeTab === item.pagePath,
        }"
        @click="switchTab(item, i)"
      >
        <view
          class="icon-box"
          :class="{
            'mid-button': item.notTabbar,
          }"
        >
          <image class="tab-icon active-icon" :src="item.selectedIconPath"></image>
          <image class="tab-icon icon" :src="item.iconPath"></image>
        </view>
        <view class="tab-text">{{ item.text }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      activeTab: '',
      List: [
        {
          text: '首页',
          pagePath: '/pages/home/index',
          iconPath: '/static/tabbar/IconTabbarHome.png',
          selectedIconPath: '/static/tabbar/IconTabbarHomeActive.png',
        },
        {
          text: '合同模板',
          pagePath: '/pages/home/contractTemplate/index',
          iconPath: '/static/tabbar/IconTemplate.png',
          selectedIconPath: '/static/tabbar/IconTemplateActive.png',
        },
        {
          text: '发起签署',
          notTabbar: true,
          pagePath: '/pages/contract/sign/index',
          iconPath: '/static/tabbar/IconMidButton.png',
          selectedIconPath: '/static/tabbar/IconMidButton.png',
        },
        {
          text: '合同管理',
          pagePath: '/pages/contract/index',
          iconPath: '/static/tabbar/IconTabbarContract.png',
          selectedIconPath: '/static/tabbar/IconTabbarContractActive.png',
        },
        {
          text: '我的',
          pagePath: '/pages/user/index',
          iconPath: '/static/tabbar/IconTabbarMine.png',
          selectedIconPath: '/static/tabbar/IconTabbarMineActive.png',
        },
      ],
    };
  },
  created() {
    uni.hideTabBar();
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    this.activeTab = '/' + route;
  },
  methods: {
    switchTab(item) {
      if (this.activeTab === item.pagePath) return;
      if (item.notTabbar) {
        uni.navigateTo({
          url: item.pagePath,
        });
      } else {
        uni.switchTab({
          url: item.pagePath,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabbar-box {
  height: 124rpx;
  position: relative;
  z-index: 98;
  .tab-list {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #ffffff;
    padding: 0 10rpx;

    .tab-item {
      flex: 1;
      text-align: center;
      padding: 14rpx;

      .icon-box {
        width: 48rpx;
        height: 48rpx;
        margin: 0 auto 10rpx;

        .tab-icon {
          width: 100%;
          height: 100%;
          display: block;
          margin: 0 auto;
          display: none;
        }
        .icon {
          display: block;
        }
        &.mid-button {
          position: relative;
          .tab-icon {
            width: 68rpx;
            height: 68rpx;
            position: absolute;
            bottom: 0;
            transform: translateX(-50%);
            left: 50%;
            border: 2rpx solid white;
            border-radius: 50%;
          }
        }
      }
      .tab-text {
        color: #666666;
        font-size: 28rpx;
        white-space: nowrap;
      }
      &.active {
        .tab-text {
          color: $uni-color-primary;
        }
        .icon-box {
          .tab-icon {
            display: block;
          }
          .icon {
            display: none;
          }
        }
      }
    }
  }
}

@supports (bottom: constant(safe-area-inset-bottom)) {
  .tabbar-box {
    height: calc(124rpx + constant(safe-area-inset-bottom));

    .tab-list {
      padding-bottom: calc(constant(safe-area-inset-bottom) - 20rpx);
    }
  }
}

@supports (bottom: env(safe-area-inset-bottom)) {
  .tabbar-box {
    height: calc(124rpx + env(safe-area-inset-bottom));

    .tab-list {
      padding-bottom: calc(env(safe-area-inset-bottom) - 20rpx);
    }
  }
}
</style>
