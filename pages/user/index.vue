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
            <!-- <view class="company-name" v-if="userInfo.companyName"> {{ userInfo.companyName }} </view> -->
            <tag-auth :userInfo="userInfo" />
          </view>
          <view v-if="userInfo.authentication" class="flex-fs" @click="$refs.checkUserRef.open()">
            <view class="text-24 color-primary">切换身份</view>
            <uni-icons type="forward" size="12" color="#B3B3B3"></uni-icons>
          </view>
          <checkUser ref="checkUserRef" :check="false" backType="mine" />
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
            j => j.hidden === false && (!j.mustAdmin || admin)
          )"
          :key="i"
          class="item flex-fs"
          @click="navigateTo(item.url, item.checkToken, item.mustCompany, item.mustCross)"
        >
          <image class="icon-item" :src="item.icon"></image>
          <view class="flex-1 text-28 color-base">{{ item.title }}</view>
          <uni-icons class="icon-forward" type="forward" size="16" color="#B3B3B3"></uni-icons>
        </view>
        <!-- <navigator

          hover-class="none"
          open-type="reLaunch"
          url="/pages/login/login"
          class="item flex-fs"
        >
          <image class="icon-item" src="/static/switch.png"></image>
          <view class="flex-1 text-28 color-base">切换用户</view>
          <uni-icons class="icon-forward" type="forward" size="16" color="#B3B3B3"></uni-icons>
        </navigator> -->
      </view>
      <view v-if="token" class="logout" @click="$refs.popupRef.open()">退出登录</view>
      <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
      <view class="popup">
        <view class="tips">退出后，将不能发起个人签署和企业签署</view>
        <view class="logout-txt row-popup text-28 flex-ct" @click="logout">确认退出</view>
        <view class="row-popup text-28 flex-ct" @click="$refs.popupRef.close()">取消</view>
      </view>
    </uni-popup>
    </view>
  </SwitchEnvironment>
</template>

<script>
import { upload } from '@/api/oss.js';
import userInfoApi from '@/api/api';
import { getCompanyState, isAdmin } from '@/api/company.js';
import { logout } from '@/api/login';
import { mapState, mapActions } from 'vuex';
export default {
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
          mustCross: true
        },
        {
          title: '企业成员',
          icon: '/static/iconMember.png',
          url: '/pages/user/companyMembers/index',
          hidden: false,
          checkToken: true,
          mustCompany: true,
          mustAdmin: true,
          mustCross: true
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
      authObj: {},
      authCompanyObj: {},
      admin:false
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
            if(obj?.authUrl) {
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
          if(obj?.authUrl) {
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
                    if(type === 'person') {
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

      let that = this
      if(mustCross) {
        let personFlag = true;
        let companyFlag = true;
        // 检查个人globalAuthState
        personFlag = that.checkGlobalAuthState(that?.authObj, 'person');
        if(!personFlag) {
          return;
        }
        // 检查公司globalAuthState
        companyFlag = that.checkGlobalAuthState(that?.authCompanyObj, 'company');
        if(!companyFlag) {
          return;
        }
      }

      this.common.navigateTo(url);
    },
    getCurrentState() {
      userInfoApi.getAuthState({type:6}).then(res=> {
        this.authObj = res;
      })
    },
    getCurrentCompanyState(){
      getCompanyState({type:6}).then(res=> {
        this.authCompanyObj = res;
        if(res.globalAuthState === 2) {
          this.getIsAdmin()
        } else {
          this.admin = false;
        }
      })
    },
    getIsAdmin() {
      isAdmin().then(res => {
        this.admin = res;
      })
    },
    logout() {
      logout().then(() => {
         uni.redirectTo({
             url: '/pages/login/login',
        });
      });
    }
  },
  watch:{
    userInfo (value) {
    this.getCurrentState();
    if(!value.companyAccountId) {
      this.admin = false;
    }
     if(value.companyAccountId && value.authentication) {
        this.getCurrentCompanyState();
      }
    }
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
      /* .company-name{
        font-size: 14rpx;
      } */
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
  .logout {
    width: 686rpx;
    height: 104rpx;
    border-radius: 12rpx;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32rpx;
    font-size: 28rpx;
    text-align: center;
    color: #FF0003;
  }
  .logout-txt {
      color: #FF0000;
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
</style>
