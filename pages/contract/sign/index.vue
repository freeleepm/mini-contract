<template>
  <view>
    <LoginTip />
    <view class="page-base">
      <!-- <view class="readme" v-if="showReadeMe">
      <image src="../../static/readme.png" mode="widthFix"></image>
      <view class="flex-ct">
        <view class="btn-2 lg" @click="iknow">我知道了</view>
      </view>
    </view> -->

      <view class="container-card">
        <view class="title bold text-28 color-base sign-box">
          <view>合同文件</view>
          <uni-icons type="info" size="24" color="#3277FF" @click="showInfo"></uni-icons>
        </view>
        <FileItem :file="file" v-if="file" @click.native="openFile">
          <view
            class="flex-col"
            @click.stop="navigateTo('/pages/user/file/fileManage?pick=1&id=' + file.id)"
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
            placeholder-class="text-26 color-grey"
          />
        </view>
        <view class="line-horizontal"></view>
        <view class="title bold text-28 color-base">签署截止日期</view>
        <!-- <time-picker
          v-if="start"
          :begin-date="start"
          :begin-time="new Date().getMinutes() + ':' + new Date().getSeconds()"
          @btnConfirm="e => (form.endTime = e.key)"
          showType="yearToMinute"
        > -->
        <picker mode="date" :value="form.endTime" :start="start" @change="change" v-if="!reloading">
          <view class="text-26 color-base flex-sb">
            <view v-if="form.endTime">{{ form.endTime }}</view>
            <view v-else class="text-26 color-grey">过期则无法签署</view>
            <uni-icons type="forward" size="15" color="#B3B3B3" class="flex-ct"></uni-icons>
          </view>
        </picker>
        <!-- </time-picker> -->
      </view>

      <view class="container-card">
        <view class="title bold text-28 color-base">签署流程</view>
        <!-- 发起方 -->
        <!-- <initiator /> -->
        <!-- 签署方 -->
        <Signatories :currentSigner="form.signers" @change="onChange" :messageInfo="messageInfo" />
      </view>
      <btn-fixed>
        <view class="flex-fs">
          <view
            class="save-draft"
            @click="saveDraft"
            :class="{
              dis: !userInfo.authentication,
            }"
          >
            <image src="/static/icon-draft.png"></image>
            <view>保存草稿</view>
          </view>
          <view class="btn-next btn-primary" :class="{ disabled: isFormDisabled }" @click="submit">
            发起签署
          </view>
        </view>
      </btn-fixed>
    </view>
  </view>
</template>

<script>
var that;
import { sign, recent, getCompanyState } from '@/api/company.js';
import initiator from './components/initiator';
import Signatories from './components/Signatories';
import { mapState, mapActions } from 'vuex';
import userInfoApi from '@/api/api.js';
import { save, edit, detail, del } from '@/api/draft.js';
export default {
  components: { initiator, Signatories },
  data() {
    return {
      start: '',
      file: '',
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
      authObj: {},
      authCompanyObj: {},
      messageInfo: '', // 短信链接跳转信息
      DraftId: '',
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
    if (e && e.companyName) {
      this.messageInfo = e;
    }
    if (e && e.name) {
      this.messageInfo = e;
    }
  },
  onLoad(e) {
    that = this;
    uni.setStorageSync('signing', true);
    const endTime = this.GetDateStr(1);
    // this.form.endTime = endTime;
    this.getCurrentState();
    if (that.userInfo.authentication && that.userInfo.companyAccountId) {
      that.getCurrentCompanyState();
    }
    setTimeout(() => {
      this.start = endTime.replace(' 23:59:59', '');
      this.reloading = false;
      this.$forceUpdate();
    }, 100);
    if (e.draftId) {
      this.DraftId = e.draftId;
      this.getDraftDetail();
    }
  },
  methods: {
    dateChange(e) {
      console.log(e);
    },
    ...mapActions(['uinfo']),
    onChange(e) {
      this.form.signers = JSON.parse(JSON.stringify(e));
    },
    getDraftDetail() {
      detail(this.DraftId).then(res => {
        const content = JSON.parse(res.content);
        this.file = content.file;
        this.form = content.form;
      });
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
      // 未登录
      if (!this.userInfo || !this.userInfo.id) {
        this.common.toLogin();
        return;
      }
      this.common.navigateTo(url);
    },
    change(e) {
      this.form.endTime = e.detail.value + ' 23:59:59';
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
    submit() {
      // 未认证
      if (!this.userInfo.authentication) {
        this.common.showAuthModal('?originType=sign');
        return;
      }
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

      if (!that.fastClick) return;
      // 合同数不足
      if (
        (this.userInfo.companyId && this.userInfo.companyMealCount < 1) ||
        (!this.userInfo.companyId && this.userInfo.individualMealCount < 1)
      ) {
        const type = this.userInfo.companyId ? 1 : 0;
        uni.showModal({
          title: '',
          content: '剩余合同份数为0，请先购买套餐',
          confirmText: '购买',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.common.navigateTo(`/pages/user/package/buy?type=${type}`);
            }
          },
        });
        return;
      }
      if (!that.file) {
        uni.showToast({ title: '请选择签署文件', icon: 'none' });
        return;
      }
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
      uni.showModal({
        title: '发起后，将扣减账户1份合同',
        content: '',
        confirmText: '确认发起',
        cancelText: '取消',
        confirmColor: '#3277FF',
        cancelColor: '#999999',
        success: function (r) {
          if (r.confirm) {
            that.fastClick = false;
            uni.showLoading({
              title: '发起中...',
            });
            let form = JSON.parse(JSON.stringify(that.form));
            form.fileSize = that.file.size;
            form.initiateType = that.userInfo.companyId ? 1 : 0;
            sign(form)
              .then(res => {
                uni.hideLoading();
                if (that.DraftId) del(that.DraftId);
                uni.showModal({
                  title: '签署发起成功',
                  content: '请提醒签署方注意留意手机短信，进行签署操作',
                  confirmText: '好的',
                  showCancel: false,
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
                      // 本人是否签署方
                      if (res.isSigner) {
                        uni.redirectTo({
                          url:
                            '/pages/user/company/authorize?path=' + encodeURIComponent(res.signUrl),
                        });
                      } else {
                        uni.redirectTo({
                          url: `/pages/contract/detail/index?id=${res.id}`,
                        });
                      }
                    }
                  },
                  complete() {
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
          }
        },
      });
    },
    saveDraft() {
      // 未认证
      if (!this.userInfo.authentication) {
        // this.common.showAuthModal(
        //   '?originType=sign',
        //   '保存草稿需先完成个人认证，方可进行下一步操作'
        // );
        return;
      }
      if (!that.file) {
        uni.showToast({ title: '请选择签署文件', icon: 'none' });
        return;
      }
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

      const formData = {
        id: this.DraftId,
        type: 2,
        content: JSON.stringify({
          form: this.form,
          file: this.file,
        }),
        initiatorName: this.userInfo.nickname,
        signatoryName: this.getNames(),
      };
      if (this.DraftId) {
        edit(formData).then(res => {
          uni.showToast({
            title: '保存成功',
            icon: 'success',
          });
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/index',
            });
          }, 888);
        });
      } else {
        save(formData).then(res => {
          this.DraftId = res;
          uni.showToast({
            title: '保存成功',
            icon: 'success',
          });
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/home/index',
            });
          }, 888);
        });
      }
    },
    getNames() {
      let names = [];
      for (let i = 0; i < this.form.signers.length; i++) {
        if (this.form.signers[i].type === 0) {
          names.push(this.form.signers[i].person.name);
        } else {
          names.push(this.form.signers[i].company.agentName);
        }
      }
      return names.join(',');
    },
    getCurrentState() {
      userInfoApi.getAuthState({ type: 7 }).then(res => {
        this.authObj = res;
      });
    },
    getCurrentCompanyState() {
      getCompanyState({ type: 7 }).then(res => {
        this.authCompanyObj = res;
      });
    },
    showInfo() {
      uni.showModal({
        showCancel: false,
        content: '签署文件最大5M，支持格式为pdf、doc、docx、png、jpg、jpeg',
        title: '提示',
      });
    },
    openFile() {
      if (this.file.url) {
        // #ifndef H5
        uni.showLoading({
          title: '请稍等',
        });
        uni.downloadFile({
          url: this.file.url,
          success: function (res) {
            var filePath = res.tempFilePath;
            uni.openDocument({
              filePath: filePath,
              showMenu: true,
              success: function (res) {
                console.log('打开文档成功');
              },
            });
          },
          complete: function (res) {
            uni.hideLoading();
          },
        });
        // #endif
        // #ifdef H5
        this.common.showToast('请在小程序端打开');
        // #endif
      }
    },
  },
  watch: {
    userInfo(value) {
      if (value.companyId) {
        this.form.initiateType = 1;
      } else {
        this.form.initiateType = 0;
      }
      this.getCurrentState();
      if (value.authentication && value.companyAccountId) {
        that.getCurrentCompanyState();
      }
    },
  },
  onTabItemTap() {
    let that = this;
    if (that.userInfo) {
      that.file = '';
      that.form.initiateType = 0;
      that.form.name = '';
      that.form.signers = [];
      that.form.url = '';
    }
  },
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
  .sign-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0;
  }
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
.save-draft {
  image {
    width: 40rpx;
    height: 40rpx;
  }
  padding-right: 40rpx;
  text-align: center;
  view {
    color: #333;
    font-size: 24rpx;
  }
  &.dis {
    opacity: 0.4;
  }
}
.btn-next {
  width: 598rpx;
  flex: 1;
  height: 88rpx;
  border-radius: 8rpx;
}
</style>
