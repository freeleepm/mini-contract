<template>
  <SwitchEnvironment>
    <view class="page1">
      <view class="content-box">
        <view
          class="info-box flex-fs"
          @click="userInfo ? void 0 : common.navigateTo('/pages/login/login', null, null)"
        >
          <button
            class="img-avatar"
            type="defualt"
            :open-type="userInfo ? 'chooseAvatar' : ''"
            @chooseavatar="onChooseAvatar"
          >
            <image class="img-avatar" :src="userInfo.avatarUrl"></image>
          </button>
          <view class="flex-wrap flex-1">
            <view class="text-30 bold width-full">
              {{ userInfo ? userInfo.nickname || userInfo.phone : '未登录用户' }}
            </view>
            <tag-auth :userInfo="userInfo" />
          </view>
          <view v-if="userInfo.authentication" class="flex-fs" @click="$refs.checkUserRef.open()">
            <view class="text-24 color-primary">切换身份</view>
            <uni-icons type="forward" size="12" color="#B3B3B3"></uni-icons>
          </view>
          <checkUser ref="checkUserRef" :check="false" />
        </view>

        <view class="menu-container flex-sb">
          <view
            class="menu-item flex-col"
            @click="navigateTo('/pages/user/package/comboDetails?type=0', 1, null)"
          >
            <view
              v-if="!userInfo.individualMealCount"
              class="tip flex-ct"
              @click.stop="navigateTo('/pages/user/package/buy', 1, null)"
            >
              去购买
            </view>
            <view class="num">
              {{ userInfo.individualMealCount || 0 }}
            </view>
            <view class="text-24">个人套餐</view>
          </view>
          <view class="line-vertical"></view>
          <view
            class="menu-item flex-col"
            @click="navigateTo('/pages/user/package/comboDetails?type=1', 1, null)"
          >
            <view class="num">
              {{ userInfo.companyMealCount || 0 }}
            </view>
            <view class="text-24">企业套餐</view>
          </view>
        </view>
      </view>

      <view class="list">
        <view
          v-for="(item, i) in list.filter(
            j => j.hidden === false && (!j.mustAdmin || userInfo.admin)
          )"
          :key="i"
          class="item flex-fs"
          @click="navigateTo(item.url, item.checkToken, item.mustCompany)"
        >
          <image class="icon-item" :src="item.icon"></image>
          <view class="flex-1 text-28 color-base">{{ item.title }}</view>
          <uni-icons class="icon-forward" type="forward" size="16" color="#B3B3B3"></uni-icons>
        </view>
      </view>
    </view>
  </SwitchEnvironment>
</template>

<script>
import { upload } from '@/api/oss.js';
import userInfoApi from '@/api/api';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    let self = this;
    return {
      list: [
        {
          title: '我的企业',
          icon: '/static/IconEnterprise.png',
          url: '/pages/user/company/myCompany',
          hidden: false,
          checkToken: true,
          mustCompany: true,
        },
        {
          title: '企业成员',
          icon: '/static/iconMember.png',
          url: '/pages/user/companyMembers/index',
          hidden: false,
          checkToken: true,
          mustCompany: true,
          mustAdmin: true,
        },
        {
          title: '企业印章',
          icon: '/static/IconSeal.png',
          url: '/pages/user/company/companySeal',
          hidden: true,
          checkToken: true,
          mustCompany: true,
        },
        {
          title: '文件管理',
          icon: '/static/IconFilder.png',
          url: '/pages/user/file/fileManage',
          hidden: false,
          checkToken: true,
          mustCompany: false,
        },
        {
          title: '隐私政策',
          icon: '/static/IconPrivacy.png',
          url: '/pages/user/setting/Privacy',
          hidden: false,
          checkToken: false,
          mustCompany: false,
        },
        {
          title: '修改密码',
          icon: '/static/IconPwd.png',
          url: '/pages/login/reset',
          hidden: true,
          checkToken: false,
          mustCompany: false,
        },
      ],
    };
  },
  onShow() {
    this.init();
  },
  computed: {
    ...mapState(['userInfo', 'token']),
  },
  methods: {
    ...mapActions(['uinfo']),
    init() {
      if (!this.token) return;
      this.uinfo();
    },
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
    navigateTo(url, checkToken, mustCompany) {
      if (checkToken && !this.token) {
        this.common.toLogin();
        return;
      }
      if (mustCompany && !this.userInfo.companyId) {
        uni.showModal({
          title: '温馨提示',
          content: '该操作需要企业认证，请切换企业身份或进行企业认证！',
          confirmText: '去认证',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/company/Certification',
              });
            }
          },
        });
        return;
      }
      this.common.navigateTo(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.page1 {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 32rpx;
  box-sizing: border-box;
  .content-box {
    box-sizing: border-box;
    padding: 32rpx;
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
      border-bottom: 1px solid #e6e6e6;
    }

    .text-30 {
      margin-bottom: 8rpx;
      line-height: 42rpx;
    }

    .menu-container {
      margin-top: 32rpx;
    }

    .menu-item {
      position: relative;
      flex: 1;
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
    background: #ffffff;
    border-radius: 12rpx;
    padding: 16rpx 0;
    .item {
      padding: 32rpx;
    }
    .icon-item {
      margin-right: 20rpx;
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>