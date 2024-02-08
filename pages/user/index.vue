<template>
  <view>
    <SwitchEnvironment>
      <view class="page1">
        <view class="content-box">
          <view
            class="flex-fs"
            @click="userInfo ? void 0 : common.navigateTo('/pages/login/login', null, null)"
          >
            <UserAvatar />
            <view class="flex-wrap flex-1">
              <view class="nickname bold width-full">
                {{ userInfo ? userInfo.nickname || userInfo.phone : '未登录用户' }}
              </view>
              <!-- <view class="company-name" v-if="userInfo.companyName"> {{ userInfo.companyName }} </view> -->
              <tag-auth :userInfo="userInfo" />
            </view>
          </view>
          <view v-if="userInfo.authentication" class="check-btn" @click="$refs.checkUserRef.open()">
            <text class="text-26">切换</text>
          </view>
        </view>
        <!-- 未认证卡片 -->
        <AuthCard v-if="userInfo && !userInfo.authentication" />

        <view class="list" style="padding: 0" v-if="userInfo && userInfo.authentication">
          <view
            class="item flex-fs"
            @click="
              navigateTo(
                `/pages/user/package/comboDetails?type=${userInfo.companyId ? 1 : 0}`,
                1,
                null
              )
            "
          >
            <image class="icon-item" src="/static/IconCon.png"></image>
            <view class="flex-1 text-28 color-base">
              剩余电子合同
              <text class="color-error" v-if="userInfo.companyId">
                {{ userInfo.companyMealCount || 0 }}
              </text>
              <text class="color-error" v-else>{{ userInfo.individualMealCount || 0 }}</text>
              份
            </view>
            <text class="color-primary text-28">查看详情</text>
            <uni-icons class="icon-forward" type="forward" size="16" color="#3277FF"></uni-icons>
          </view>
        </view>

        <view class="list">
          <view
            v-for="(item, i) in list.filter(j => j.hidden === false && (!j.mustAdmin || admin))"
            :key="i"
            class="item flex-fs"
            @click="navigateTo(item.url, item.checkToken, item.mustCompany, item.mustCross)"
          >
            <image class="icon-item" :src="item.icon"></image>
            <view class="flex-1 text-28 color-base">{{ item.title }}</view>
            <uni-icons class="icon-forward" type="forward" size="16" color="#B3B3B3"></uni-icons>
          </view>
        </view>

        <view v-if="token" class="logout" @click="$refs.popupRef.open()">退出登录</view>

        <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
          <view class="popup">
            <view class="tips">退出后，将不能发起个人签署和企业签署</view>
            <view class="logout-txt row-popup text-28 flex-ct" @click="logout">确认退出</view>
            <view class="row-popup text-28 flex-ct" @click="$refs.popupRef.close()">取消</view>
          </view>
        </uni-popup>

        <tabbar />
      </view>
    </SwitchEnvironment>
    <checkUser ref="checkUserRef" :check="false" backType="mine" />
  </view>
</template>

<script>
import { upload } from '@/api/oss.js';
import userInfoApi from '@/api/api';
import { getCompanyState, isAdmin } from '@/api/company.js';
import { logout } from '@/api/login';
import { mapState, mapActions } from 'vuex';
import AuthCard from './components/AuthCard';
import UserAvatar from './components/UserAvatar';
export default {
  components: {
    AuthCard,
    UserAvatar,
  },
  data() {
    let self = this;
    return {
      list: [
        {
          title: '我的企业',
          icon: '/static/IconEnterprise.png',
          url: '/pages/user/company/myCompany?originType=mine',
          hidden: false,
          checkToken: true,
          mustCompany: false,
          mustCross: true,
        },
        {
          title: '企业成员',
          icon: '/static/iconMember.png',
          url: '/pages/user/companyMembers/index',
          hidden: false,
          checkToken: true,
          mustCompany: true,
          mustAdmin: true,
          mustCross: true,
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
          title: '个人签名',
          icon: '/static/IconSign.png',
          url: '/pages/user/mySign/index',
          hidden: true,
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
      authObj: {},
      authCompanyObj: {},
      admin: false,
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
                  if (type === 'person') {
                    that.getCurrentState();
                  } else {
                    that.getCurrentCompanyState();
                  }
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
    navigateTo(url, checkToken, mustCompany, mustCross) {
      if (checkToken && !this.token) {
        this.common.toLogin();
        return;
      }
      if (mustCompany && !this.userInfo.companyId) {
        if (!this.userInfo.authentication) {
          uni.showModal({
            content: '需要完成个人认证，方可进行下一步操作',
            confirmText: '去认证',
            confirmColor: '#3277FF',
            success: function (res) {
              if (res.confirm) {
                uni.navigateTo({
                  url: '/pages/user/personal/Certification?originType=mine',
                });
              }
            },
          });
          return;
        }
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
                url: '/pages/user/company/Certification?originType=mine',
              });
            }
          },
        });
        return;
      }

      let that = this;
      if (mustCross) {
        let personFlag = true;
        let companyFlag = true;
        // 检查个人globalAuthState
        personFlag = that.checkGlobalAuthState(that?.authObj, 'person');
        if (!personFlag) {
          return;
        }
        // 检查公司globalAuthState
        companyFlag = that.checkGlobalAuthState(that?.authCompanyObj, 'company');
        if (!companyFlag) {
          return;
        }
      }

      this.common.navigateTo(url);
    },
    getCurrentState() {
      userInfoApi.getAuthState({ type: 6 }).then(res => {
        this.authObj = res;
      });
    },
    getCurrentCompanyState() {
      getCompanyState({ type: 6 }).then(res => {
        this.authCompanyObj = res;
        if (res.globalAuthState === 2) {
          this.getIsAdmin();
        } else {
          this.admin = false;
        }
      });
    },
    getIsAdmin() {
      isAdmin().then(res => {
        this.admin = res;
      });
    },
    logout() {
      logout().then(() => {
        uni.redirectTo({
          url: '/pages/login/login',
        });
      });
    },
  },
  watch: {
    userInfo(value) {
      this.getCurrentState();
      if (!value.companyAccountId) {
        this.admin = false;
      }
      if (value.companyAccountId && value.authentication) {
        this.getCurrentCompanyState();
      }
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
    background: #ffffff;
    border-radius: 12rpx;
    position: relative;
    .check-btn {
      position: absolute;
      padding: 0 0 60rpx 60rpx;
      top: 0;
      right: 0;
      text {
        border-radius: 8rpx 12rpx 8rpx 8rpx;
        line-height: 40rpx;
        padding: 0 10rpx;
        background: linear-gradient(120deg, #ebc68c -1%, #bb9456 99%);
        color: white;
      }
    }
    .nickname {
      margin-bottom: 20rpx;
      line-height: 42rpx;
    }
  }

  .list {
    box-sizing: border-box;
    margin-top: 32rpx;
    background: #ffffff;
    border-radius: 12rpx;
    padding: 16rpx 0;
    .item {
      padding: 32rpx 24rpx 32rpx 32rpx;
      .icon-item {
        margin-right: 20rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
  .logout {
    width: 686rpx;
    height: 104rpx;
    border-radius: 12rpx;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32rpx;
    font-size: 28rpx;
    text-align: center;
    color: #ff0003;
  }
  .logout-txt {
    color: #ff0000;
  }
}
.popup {
  overflow: hidden;
  border-radius: 12rpx 12rpx 0 0;
  background-color: #fff;
  .tips {
    width: 100%;
    height: 104rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b5b5b5;
    font-size: 26rpx;
  }
  .row-popup {
    width: 100%;
    height: 104rpx;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border: none;
    }
  }
}

// @supports (bottom: constant(safe-area-inset-bottom)) {
//   .popup,
//   /deep/ .identity {
//     padding-bottom: calc(constant(safe-area-inset-bottom) + 124rpx) !important;
//   }
// }

// @supports (bottom: env(safe-area-inset-bottom)) {
//   .popup,
//   /deep/ .identity {
//     padding-bottom: calc(env(safe-area-inset-bottom) + 124rpx) !important;
//   }
// }
</style>