<!--
 * @Description:
 * @LastEditTime: 2022-09-22 14:18:49
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page1 flex-col">
    <view class="content-box flex-col">
      <view
        class="info-box flex-fs"
        @click="userInfo ? void 0 : common.navigateTo('/pages/login/login')"
      >
        <button
          v-if="userInfo"
          class="img-avatar"
          type="defualt"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <image
            class="img-avatar"
            :src="userInfo.avatarUrl || '../../static/ImgDefAvatar.png'"
          ></image>
        </button>
        <image
          v-else
          class="img-avatar"
          :src="userInfo.avatarUrl || '../../static/ImgDefAvatar.png'"
        ></image>
        <view class="flex-wrap flex-1">
          <view class="text-30 bold width-full">
            {{ userInfo ? userInfo.nickname || userInfo.phone : '未登录用户' }}
          </view>
          <view v-if="userInfo.companyId" class="tag-auth tag-auth__enterauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
            企业认证
          </view>
          <view v-else-if="userInfo.companyName" class="tag-auth tag-auth__unauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
            未认证
          </view>
          <view v-else-if="userInfo.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
            已实名
          </view>
          <view
            v-else
            class="tag-auth tag-auth__unauth flex-ct text-20"
            @click="userInfo ? common.navigateTo('/pages/user/Certification') : void 0"
          >
            <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
            未实名
          </view>
        </view>
        <navigator
          v-if="userInfo.authentication"
          class="flex-fs"
          hover-class="none"
          url="/pages/user/changeIdentity"
        >
          <view class="text-24 color-primary">切换身份</view>
          <uni-icons
            class="flex-ct icon-forward"
            type="forward"
            size="12"
            color="#B3B3B3"
          ></uni-icons>
        </navigator>
      </view>

      <view class="menu-container flex-sb">
        <view class="menu-item flex-col" @click="navigateTo('/pages/user/comboDetails?type=0')">
          <view
            v-if="!userInfo.individualMealCount"
            class="tip flex-ct"
            @click.stop="navigateTo('/pages/combo/buy')"
          >
            去购买
          </view>
          <view class="num">
            {{ userInfo.individualMealCount || 0 }}
          </view>
          <view class="text-24">个人套餐</view>
        </view>
        <view class="line-vertical"></view>
        <view class="menu-item flex-col" @click="navigateTo('/pages/user/comboDetails?type=1')">
          <view class="num">
            {{ userInfo.companyMealCount || 0 }}
          </view>
          <view class="text-24">企业套餐</view>
        </view>
      </view>
    </view>

    <view class="list flex-col">
      <view class="item flex-fs" @click="navigateTo('/pages/user/myCompany')">
        <image class="icon-item" src="@/static/IconEnterprise.png"></image>
        <view class="flex-1 text-28">我的企业</view>
        <uni-icons
          class="flex-ct icon-forward"
          type="forward"
          size="16"
          color="#B3B3B3"
        ></uni-icons>
      </view>
      <!-- <view
        class="item flex-fs"
        @click="navigateTo('/pages/user/companySeal?companyId' + userInfo.companyId)"
      >
        <image class="icon-item" src="@/static/IconSeal.png"></image>
        <view class="flex-1 text-28">企业印章</view>
        <uni-icons
          class="flex-ct icon-forward"
          type="forward"
          size="16"
          color="#B3B3B3"
        ></uni-icons>
      </view> -->
      <view class="item flex-fs" @click="navigateTo('/pages/user/fileManage')">
        <image class="icon-item" src="@/static/IconFilder.png"></image>
        <view class="flex-1 text-28">文件管理</view>
        <uni-icons
          class="flex-ct icon-forward"
          type="forward"
          size="16"
          color="#B3B3B3"
        ></uni-icons>
      </view>
      <!-- <view class="item flex-fs" @click="navigateTo('/pages/user/comboDetails')">
        <view class="flex-1 text-28">套餐详情</view>
      </view> -->
      <view class="item flex-fs" @click="common.navigateTo('/pages/user/Privacy')">
        <image class="icon-item" src="@/static/IconPrivacy.png"></image>
        <view class="flex-1 text-28">隐私政策</view>
        <uni-icons
          class="flex-ct icon-forward"
          type="forward"
          size="16"
          color="#B3B3B3"
        ></uni-icons>
      </view>
      <!-- <view class="item flex-fs" @click="navigateTo('/pages/login/reset')">
        <image class="icon-item" src="@/static/IconPwd.png"></image>
        <view class="flex-1 text-28">修改密码</view>
        <uni-icons
          class="flex-ct icon-forward"
          type="forward"
          size="16"
          color="#B3B3B3"
        ></uni-icons>
      </view> -->
    </view>
  </view>
</template>

<script>
import { info } from '@/api/login.js';
import { upload } from '@/api/upload.js';
import config from '@/common/config.js';
import userInfoApi from '@/api/api';

export default {
  data() {
    return {
      userInfo: '',
      loading: true,
      config,
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      if (!uni.getStorageSync('userInfo')) {
        this.loading = false;
        return;
      }
      await info()
        .then(data => {
          this.userInfo = data;
          uni.setStorageSync('userInfo', {
            ...this.userInfo,
            token: uni.getStorageSync('userInfo').token,
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // logout() {
    //   uni.removeStorageSync('userInfo');
    //   uni.reLaunch({
    //     url: '../login/login?logout=1',
    //   });
    // },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;

      upload({ path: avatarUrl }).then(path => {
        if (path) {
          userInfoApi.changeAvatar(config.imgUrl + path).then(() => {
            this.userInfo.avatarUrl = config.imgUrl + path;
          });
        }
      });
    },
    navigateTo(url) {
      var that = this;
      if (uni.getStorageSync('userInfo').token) {
        this.common.navigateTo(url);
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '请先登录/注册，方可进行下一步操作',
          confirmText: '去登录',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.common.navigateTo('/pages/login/login?logout=1');
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page1 {
  min-height: 100vh;
  background-color: #f5f5f5;

  .content-box {
    box-sizing: border-box;
    margin-top: 32rpx;
    padding: 32rpx;
    width: 686rpx;
    height: 320rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .img-avatar {
      margin-right: 16rpx;
      width: 100rpx;
      height: 100rpx;
      background: #ffffff;
      border-radius: 8rpx;
    }

    .info-box {
      padding-bottom: 32rpx;
      width: 100%;
      border-bottom: 1px solid #e6e6e6;
    }

    .tag-auth {
      box-sizing: border-box;
      padding: 0 10rpx;
      height: 36rpx;
      border-radius: 18rpx;
      border: 1px solid currentColor;
    }

    .text-30 {
      margin-bottom: 8rpx;
      line-height: 42rpx;
    }

    .icon-auth {
      margin-right: 4rpx;
      width: 24rpx;
      height: 24rpx;
    }

    .tag-auth__unauth {
      color: #999999;
    }

    .tag-auth__auth {
      color: #3277ff;
    }

    .tag-auth__enterauth {
      color: #ff731d;
    }

    .menu-container {
      margin-top: 31rpx;
      width: 686rpx;
    }

    .menu-item {
      position: relative;
      width: 343rpx;
    }

    .tip {
      position: absolute;
      right: 50rpx;
      top: -7rpx;
      width: 90rpx;
      height: 36rpx;
      background: #ff731d;
      border-radius: 26rpx 26rpx 26rpx 0;
      font-size: 22rpx;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }

    .num {
      margin-bottom: 8rpx;
      font-size: 40rpx;
      font-family: DINPro-Bold, DINPro;
      font-weight: bold;
      color: #3277ff;
      line-height: 51rpx;
    }

    .text-24 {
      color: #333333;
    }

    .line-vertical {
      width: 1px;
      height: 40rpx;
      background: #e6e6e6;
    }
  }

  .list {
    box-sizing: border-box;
    margin-top: 32rpx;
    padding: 15rpx 32rpx;
    width: 686rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .item {
      padding: 35rpx 0;
      width: 100%;
    }

    .icon-item {
      margin-right: 20rpx;
      width: 40rpx;
      height: 40rpx;
    }

    .icon-forward {
      width: 14rpx;
    }

    .text-28 {
      color: #333333;
    }
  }
}
</style>
