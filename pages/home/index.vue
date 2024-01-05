<template>
  <view>
    <view class="outer-box" v-if="userInfo">
      <view class="flex-fs" @click="$refs.checkUserRef.open()">
        <view class="text-28 contract-title">
          <text class="name text-elps">
            {{  Number(userInfo.identityType) === 1 ? userInfo.companyName : userInfo.nickname || userInfo.phone }}
          </text>
          <text class="contract-pages">（剩余{{  Number(userInfo.identityType) === 1 ? userInfo.companyMealCount || 0 :  userInfo.individualMealCount || 0}}份）</text>
        </view>
        <image class="arrow-down" src="@/static/arrow-down.png"></image>
      </view>
      <checkUser ref="checkUserRef" :check="false" backType="mine" />
    </view>
    <view class="outer-box" v-else>
      <view>您还未登录，登录后即可使用完整功能。</view>
      <view class="login-btn" @click="jumpLogin">立即登录</view>
    </view>

    <view class="home">
      <banner />

      <view class="flex-sb menu-list">
        <view class="menu-item flex-col" @click="switchTab(2)">
          <view class="num" :class="{ 'num-warn': balanceQuery.myHandle }">
            {{ balanceQuery.myHandle || 0 }}
          </view>
          <view class="text-26 color-base">待我处理</view>
        </view>
        <view class="line-vertical"></view>
        <view class="menu-item flex-col" @click="switchTab(3)">
          <view class="num">
            {{ balanceQuery.othersHandle || 0 }}
          </view>
          <view class="text-26 color-base">待他人处理</view>
        </view>
        <!-- <view class="line-vertical"></view>
      <view class="menu-item flex-col" @click="navigateTo('/pages/contract/sign/index', 1)">
        <view class="num flex-ct">
          <image class="icon-contract" src="@/static/IconContract.png"></image>
        </view>
        <view class="text-26 color-base">签署合同</view>
      </view> -->
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
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import contractTemplateBox from './components/contractTemplateBox';
import contractCard from './components/contractCard';
import banner from './components/banner';
import { mapState,mapActions } from 'vuex';
import setting from '@/static/config/setting.js';
export default {
  components: { contractTemplateBox, contractCard, banner },
  data() {
    return {
      contract: [], //合同数组
      balanceQuery: '', //余额 与 待处理
      list: [],
    };
  },
  onShow() {
    this.init();
    uni.setNavigationBarTitle({
      title: setting.appName,
    });
    this.uinfo();
    uni.removeStorageSync('signing');
    // this.getCurrentState();
  },
  computed: {
    ...mapState(['token']),
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapActions(['uinfo']),
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
    // 检查globalAuthState
    checkGlobalAuthState(obj, type) {
      // obj - 认证对象
      // type - person用户 company公司
      // globalAuthState 全局认证状态
      // 1:需重新认证 (有authUrl直接跳转)
      // 3:认证中 (判断是否有authUrl，如果有就是认证到一半的用户，直接跳转authUrl继续认证即可，如果没有就是回调还没有回来，刷新认证状态即可)
      let flag = true;
      switch (obj?.globalAuthState) {
        case 1:
          if (obj?.authUrl) {
            uni.showModal({
              content: `由于签署渠道变更，需要重新认证${type === 'person' ? '用户' : '企业'}`,
              confirmText: '去认证',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(obj?.authUrl),
                  });
                }
              },
            });
            flag = false;
          }
          break;
        case 3:
          if (obj?.authUrl) {
            uni.showModal({
              content: `${type === 'person' ? '用户' : '企业'}认证中，请稍后再试`,
              confirmText: '继续认证',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(obj?.authUrl),
                  });
                }
              },
            });
            flag = false;
          } else {
            uni.showModal({
              content: `${type === 'person' ? '用户' : '企业'}认证中，请稍后再试`,
              confirmText: '刷新状态',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  // if(type === 'person') {
                  that.getCurrentState();
                  // } else {
                  //   that.getCurrentCompanyState();
                  // }
                }
              },
            });
            flag = false;
          }
          break;
        default:
          break;
      }

      return flag;
    },
    getCurrentState() {
      let that = this;
      userInfoApi.getAuthState({ type: 3 }).then(data => {
        let personFlag = true;
        // 检查个人globalAuthState
        personFlag = that.checkGlobalAuthState(data, 'person');
        if (!personFlag) {
          return;
        }
      });
    },
    jumpLogin(){
      uni.redirectTo({
		      url: '/pages/login/login',
		   });
    }
  },
  onHide(){
    if(!this.userInfo) {
      console.log('this.userInfo :', this.userInfo)
      console.log('this.token :', this.token)
      uni.redirectTo({
        url: '/pages/login/login',
      });
    }
  },
  watch:{
    userInfo(value) {
      console.log('value :', value)
      this.init();
    }
  },
};
</script>

<style lang="scss" scoped>
.outer-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  background: #f6f9ff;
  color: #343434;
  width: 100%;
  padding: 24rpx 32rpx;
  z-index: 1;
  .login-btn {
    border-radius: 26rpx;
    background: #3478f7;
    padding: 12rpx 16rpx;
    font-size: 24rpx;
    text-align: center;
    color: #ffffff;
  }
  .contract-title {
    font-size: 28rpx;
    font-weight: 600;
    display: flex;
    .name{
      display: block;
      max-width: 450rpx;
    }
    .contract-pages {
      display: block;
      font-weight: 200;
    }
  }

  .arrow-down {
    width: 16rpx;
    height: 12rpx;
  }
}
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
