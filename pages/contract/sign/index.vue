<template>
  <view class="page-base">
    <!-- <view class="readme" v-if="showReadeMe">
      <image src="../../static/readme.png" mode="widthFix"></image>
      <view class="flex-ct">
        <view class="btn-2 lg" @click="iknow">我知道了</view>
      </view>
    </view> -->

    <view class="container-card">
      <view class="title bold text-28 color-base">签署合同</view>
      <FileItem :file="file" v-if="file">
        <view
          class="flex-col"
          @click="navigateTo('/pages/user/file/fileManage?pick=1&id=' + file.id)"
        >
          <image class="icon-change" src="@/static/IconCheckout.png"></image>
          <view class="text-24 color-base-minor">更改</view>
        </view>
      </FileItem>

      <view
        v-else
        class="btn-pick btn-primary text-30"
        @click="navigateTo('/pages/user/file/fileManage?pick=1')"
      >
        +选择合同
      </view>
    </view>

    <view class="container-card">
      <view class="title bold text-28 color-base">合同名称</view>
      <view class="item">
        <input
          class="text-26"
          type="text"
          v-model="form.name"
          placeholder="请输入合同名称"
          :maxlength="100"
          placeholder-class="text-26"
        />
      </view>
      <view class="line-horizontal"></view>
      <view class="title bold text-28 color-base">截止日期</view>

      <picker mode="date" :value="form.endTime" :start="start" @change="change" v-if="!reloading">
        <view class="text-26 color-base flex-sb">
          <view>{{ form.endTime || '请选择截止时间' }}</view>
          <uni-icons type="forward" size="15" color="#B3B3B3" class="flex-ct"></uni-icons>
        </view>
      </picker>
    </view>

    <view class="container-card">
      <view class="title bold text-28 color-base">签署流程</view>
      <!-- 发起方 -->
      <initiator />
      <!-- 签署方 -->
      <Signatories @change="onChange"  :currentUserInfo="userInfo" :companyName="companyName" :name="name" :mobile="mobile" />
    </view>

    <view class="btn-next btn-primary" :class="{ disabled: isFormDisabled }" @click="submit">
      下一步
    </view>
  </view>
</template>

<script>
var that;
import { sign, recent, getCompanyState } from '@/api/company.js';
import { info } from '@/api/login.js';
import initiator from './components/initiator';
import Signatories from './components/Signatories';
import { mapState, mapActions } from 'vuex';
import userInfoApi from '@/api/api.js';
export default {
  components: { initiator, Signatories },
  data() {
    return {
      start: '',
      file: '',
      name:'',
      mobile:'',
      form: {
        initiateType: 0, // 发起类型(0:个人;1:公司;)
        name: '',
        signers: [],
        endTime: '',
        url: '',
      },
      showReadeMe: false,
      reloading: true,
      fastClick: true,
      authObj:{},
      authCompanyObj:{},
      companyName:''
    };
  },
  computed: {
    isFormDisabled() {
      return !this.form.url || !this.form.signers.length;
    },
    ...mapState(['userInfo']),
  },
  onShow(e) {
    this.init();
    if(e && e.companyName) {
      that.companyName = e.companyName;
    }
    if(e && e.name) {
      that.name = e.name;
    }
    if(e && e.mobile) {
      that.mobile = e.mobile;
    }
  },
  onLoad(e) {
    that = this;
    this.form.endTime = this.GetDateStr(1);
      this.getCurrentState()
      if(that.userInfo.authentication && that.userInfo.companyAccountId) {
        that.getCurrentCompanyState();
      }
    setTimeout(() => {
      this.start = this.form.endTime.replace(' 23:59:59', '');
      this.reloading = false;
      this.$forceUpdate();
    }, 100);
  },
  methods: {
    ...mapActions(['uinfo']),
    onChange(e) {
      this.form.signers = JSON.parse(JSON.stringify(e));
    },
    GetDateStr(AddDayCount) {
      //获取AddDayCount天后的日期
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = dd.getDate();
      d = d < 10 ? '0' + d : d;
      return y + '-' + m + '-' + d + ' 23:59:59';
    },
    init() {
      that = this;
      that.uinfo();
      uni.getStorage({
        key: 'readeMe',
        success: function (state) {
          that.showReadeMe = !state.data;
        },
        fail(err) {
          that.showReadeMe = true;
        },
      });
      uni.$once('file', file => {
        that.file = file;
        that.form.url = file.url;
        let index = file.name.lastIndexOf('.');
        index = index > 20 ? 20 : index;
        that.form.name = file.name.slice(0, index);
      });
    },
    iknow() {
      uni.setStorageSync('readeMe', true);
      this.showReadeMe = false;
    },
    navigateTo(url) {
      if (!that.userInfo.authentication) {
        // 未认证
        uni.showModal({
          title: '认证提醒',
          content: '签署前需要完成个人认证，方可进行下一步操作',
          confirmText: '去认证',
          cancelText: '算了',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.common.navigateTo('/pages/user/personal/Certification?originType=sign');
            }
          },
        });
        return;
      }
      that.common.navigateTo(url);
    },
    change(e) {
      that.form.endTime = e.detail.value + ' 23:59:59';
    },
    submit() {
      if(Number(that?.authObj?.globalAuthState) === 1 && that?.authObj?.authUrl) {
      uni.showModal({
          content: '由于签署渠道变更，需要重新个人认证',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.redirectTo({
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authObj?.authUrl),
              });
            }
          },
        });
          return;
      }

      if(Number(that?.authObj?.globalAuthState) === 3) {
        if(that?.authObj?.authUrl) {
          uni.showModal({
              content: '用户认证中，请稍后再试',
              confirmText: '继续认证',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authObj?.authUrl),
                  });
                }
              },
            });
              return;

        } else {
          uni.showModal({
              content: '用户认证中，请稍后再试',
              confirmText: '刷新认证状态',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  that.getCurrentState();
                }
              },
            });
              return;

        }
      }

      if(Number(that?.authCompanyObj?.globalAuthState) === 1 && that?.authCompanyObj?.authUrl) {
      uni.showModal({
          content: '由于签署渠道变更，需要重新企业认证',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.redirectTo({
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authCompanyObj?.authUrl),
              });
            }
          },
        });
          return;
      }

      if(Number(that?.authCompanyObj?.globalAuthState) === 3) {
        if(that?.authCompanyObj?.authUrl) {
          uni.showModal({
              content: '企业认证中，请稍后再试',
              confirmText: '继续认证',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authCompanyObj?.authUrl),
                  });
                }
              },
            });
              return;

        } else {
          uni.showModal({
              content: '企业认证中，请稍后再试',
              confirmText: '刷新认证状态',
              confirmColor: '#3277FF',
              success: function (res) {
                if (res.confirm) {
                  that.getCurrentCompanyState();
                }
              },
            });
              return;

        }
       }

      if (!that.fastClick) return;
      // 合同数不足
      if (
        (this.userInfo.companyId && this.userInfo.companyMealCount < 1) ||
        (!this.userInfo.companyId && this.userInfo.individualMealCount < 1)
      ) {
        uni.showModal({
          title: '',
          content: '剩余合同份数为0，请先购买套餐',
          confirmText: '购买',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.common.navigateTo('/pages/user/package/buy');
            }
          },
        });
        return;
      }
      if (!that.file) {
        uni.showToast({ title: '请选择签署文件', icon: 'none' });
        return;
      }
      console.log('that.file :', that.file)
      if (!that.form.name.trim()) {
        uni.showToast({ title: '请输入合同名称', icon: 'none' });
        return;
      }
      if (!that.form.endTime) {
        uni.showToast({ title: '请选择截止时间', icon: 'none' });
        return;
      }
      let pickDate = Date.parse(that.form.endTime.replace(/-/g, '/'));
      if (new Date().getTime() >= pickDate) {
        uni.showToast({ title: '截止时间不得小于当前时间', icon: 'none' });
        return;
      }
      if (!that.form.signers.length) {
        uni.showToast({ title: '请添加签署方', icon: 'none' });
        return;
      }
      that.fastClick = false;
      uni.showLoading({
        title: '发起中...',
      });
      let form = JSON.parse(JSON.stringify(this.form));
      form.fileSize = this.file.size;
      form.initiateType = this.userInfo.companyId ? 1 : 0;
      console.log(form);
      sign(form)
        .then(res => {
          uni.hideLoading();
          uni.showModal({
            title: '签署发起成功',
            content: '请提醒签署方注意留意手机短信，进行签署操作',
            confirmText: '好的',
            cancelText: '取消',
            confirmColor: '#3277FF',
            cancelColor: '#999999',
            success: function (res1) {
              uni.hideLoading();
              if (res1.confirm) {
                that.file = '';
                that.form.name = '';
                that.form.url = '';
                that.form.signers = [];
                if (res) {
                  uni.redirectTo({
                    url: '/pages/user/company/authorize?path=' + encodeURIComponent(res),
                  });
                  return;
                }
              }
              that.fastClick = true;
              uni.switchTab({
                url: '/pages/home/index',
              });
            },
            fail() {
              uni.hideLoading();
              that.fastClick = true;
            },
          });
        })
        .catch(() => {
          that.fastClick = true;
          setTimeout(() => {
            uni.hideLoading();
          }, 1000);
        });
    },
    getCurrentState() {
      userInfoApi.getAuthState({type:7}).then(res=> {
        this.authObj = res;
      })
    },
    getCurrentCompanyState(){
      getCompanyState({type:7}).then(res=> {
        this.authCompanyObj = res;
      })
    }
  },
  watch:{
    userInfo(value){
      console.log('value :', value)
      this.getCurrentState()
      if(value.authentication && value.companyAccountId) {
        that.getCurrentCompanyState();
      }
    }
  }
};
</script>
<style lang="scss">
.group {
  margin-bottom: 20rpx;
  .row {
    margin-top: 16rpx;
    box-sizing: border-box;
    padding: 24rpx;
    min-height: 128rpx;
    background: #fafafa;
    border-radius: 8rpx;
  }
}
</style>
<style lang="scss" scoped>
.page-base {
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
}
.icon-change {
  margin-top: 8rpx;
  width: 32rpx;
  height: 32rpx;
}
.container-card {
  margin-top: 32rpx;
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.readme {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 33;
  background-color: #ffffff;
  padding-bottom: 40rpx;
  image {
    width: 100%;
    height: 1852rpx;
    display: block;
    margin: 0 auto;
  }
}

.title {
  padding-bottom: 20rpx;
}

.line-horizontal {
  width: 100%;
  height: 1px;
  margin: 32rpx 0;
  background: #e6e6e6;
}

.text-26 {
  line-height: 38rpx;
}

.btn-pick {
  margin: 40rpx auto 8rpx;
  width: 360rpx;
  height: 82rpx;
  border-radius: 8rpx;
}
.btn-next {
  margin-top: 50rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}
</style>
