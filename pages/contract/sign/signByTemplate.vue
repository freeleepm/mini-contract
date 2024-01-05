<template>
  <view>
    <view class="outer-box">
      <view class="flex-fs" @click="$refs.checkUserRef.open()">
        <view class="text-28 contract-title">
          <text class="name text-elps">
            {{
              Number(userInfo.identityType) === 1
                ? userInfo.companyName
                : userInfo.nickname || userInfo.phone
            }}
          </text>
          <text class="contract-pages">
            （剩余{{
              Number(userInfo.identityType) === 1
                ? userInfo.companyMealCount || 0
                : userInfo.individualMealCount || 0
            }}份）
          </text>
        </view>
        <image class="arrow-down" src="@/static/arrow-down.png"></image>
      </view>
      <checkUser ref="checkUserRef" :check="false" backType="mine" />
    </view>
    <view class="page-base">
      <view class="container-card">
        <view class="title bold text-28 color-base sign-box">
          <view>签署合同</view>
          <!-- <uni-icons type="info" size="24" color="#3277FF" @click="showInfo"></uni-icons> -->
        </view>
        <FileItem
          :file="{
            name: contractDetail.name,
          }"
        ></FileItem>
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
        <text class="text-26 color-grey-minor">签署方</text>
        <view class="signer-item" v-for="(item, index) in form.signers" :key="index">
          <!-- 个人 -->
          <view
            v-if="item.signerType === 1"
            class="flex flex-1"
            @click="
              handleIndex = index;
              $refs.addSignerRef.open(0, item.person.name ? item.person : '');
            "
          >
            <image class="img-avatar" src="/static/ImgDefAvatar.png"></image>
            <view class="flex-wrap" v-if="item.person.name">
              <view class="text-28 color-base bold width-full">
                {{ item.person.name }}
              </view>
              <view class="text-28 color-grey-minor" style="margin: 10rpx 0 0">
                {{ item.person.mobile }}
              </view>
            </view>
            <view class="add-text" v-else>+ 添加{{ item.signerFlag }}</view>
          </view>
          <!-- 企业 -->
          <view
            v-else-if="item.signerType === 2"
            class="flex flex-1"
            @click="
              handleIndex = index;
              $refs.addSignerRef.open(1, item.company.agentName ? item.company : '');
            "
          >
            <image class="img-avatar" src="/static/ImgDefEnterprise.png"></image>
            <view class="flex-1" v-if="item.company.agentName">
              <view class="text-28 color-base bold width-full">
                {{ item.company.agentName }}
              </view>
              <view class="text-28 color-grey-minor" style="margin: 10rpx 0">
                {{ item.company.agentMobile }}
              </view>
              <view class="text-28 color-base">
                {{ item.company.name }}
              </view>
            </view>
            <view class="add-text" v-else>+ 添加{{ item.signerFlag }}</view>
          </view>
        </view>
      </view>

      <view class="container-card" v-if="form.components.length">
        <view class="title bold text-28 color-base">合同信息</view>
        <view class="signers-item" v-for="(item, index) in form.signers" :key="index">
          <view
            class="signers-title text-28 color-base bold"
            v-if="form.components.find(k => k.ctSignerId === item.ctSignerId)"
          >
            {{ item.signerFlag }}
          </view>
          <view v-for="(component, i) in form.components" :key="i">
            <view class="component-item" v-if="component.ctSignerId === item.ctSignerId">
              <view class="text-28 color-base name" :class="{ required: component.required }">
                {{ component.name }}
              </view>
              <!-- 文本 -->
              <view v-if="component.componentType === 1" class="flex-sb">
                <input
                  type="text"
                  v-model="component.value"
                  :maxlength="20"
                  placeholder="请输入"
                  class="flex-1"
                />
                <view class="text-24 color-grey">{{ component.value.length }}/20</view>
              </view>
              <!-- 数字 -->
              <view v-else-if="component.componentType === 2" class="flex-sb">
                <input
                  type="number"
                  v-model="component.value"
                  :maxlength="20"
                  placeholder="请输入"
                  class="flex-1"
                />
                <view class="text-24 color-grey">{{ component.value.length }}/20</view>
              </view>
              <!-- 日期 -->
              <picker
                mode="date"
                @change="onChange1($event, component)"
                v-else-if="component.componentType === 3"
              >
                <view class="flex-sb">
                  <input
                    type="number"
                    v-model="component.value"
                    :maxlength="20"
                    placeholder="请选择"
                    disabled
                    class="flex-1"
                  />
                  <uni-icons type="right" size="16" color="#ccc"></uni-icons>
                </view>
              </picker>
            </view>
          </view>
        </view>
      </view>

      <view class="btn-next btn-primary" @click="submit">预览合同</view>
    </view>
    <addSigner :unSwitch="1" ref="addSignerRef" @change="onChange" :messageInfo="messageInfo" />
  </view>
</template>

<script>
var that;
import { recent, getCompanyState } from '@/api/company.js';
import { addTempStorage, templateDetail } from '@/api/file.js';
import initiator from './components/initiator';
import config from '@/static/config/index.js';
import { mapState, mapActions } from 'vuex';
import userInfoApi from '@/api/api.js';
import { addSigner } from './components/addSigner.vue';
// const FileSystemManager = wx.getFileSystemManager()
export default {
  components: { initiator, addSigner },
  data() {
    return {
      start: '',
      form: {
        ctId: '', // 合同模板id
        endTime: '',
        signers: [],
        components: [],
        name: '',
        fileSize: 0,
      },
      contractDetail: '',
      reloading: true,
      fastClick: true,
      authObj: {},
      authCompanyObj: {},
      messageInfo: '', // 短信链接跳转信息
      handleIndex: -1,
    };
  },
  computed: {
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
    this.form.endTime = this.GetDateStr(1);
    this.getCurrentState();
    if (that.userInfo.authentication && that.userInfo.companyAccountId) {
      that.getCurrentCompanyState();
    }
    setTimeout(() => {
      this.start = this.form.endTime.replace(' 23:59:59', '');
      this.reloading = false;
      this.$forceUpdate();
    }, 100);
    if (e.tid) {
      this.form.ctId = e.tid;
      this.getTemplateDetail();
    }
  },
  methods: {
    getTemplateDetail() {
      templateDetail(this.form.ctId).then(res => {
        res.signers = res.signers.map(i => {
          if (i.signerType === 1) {
            i.person = {
              name: '',
              mobile: '',
            };
          } else {
            i.company = {
              name: '',
              agentName: '',
              agentMobile: '',
            };
          }
          return i;
        });
        this.form.signers = res.signers;
        res.components = res.components.map(i => {
          i.signerBoxColor = res.signers.find(j => j.ctSignerId === i.ctSignerId).signerBoxColor;
          i.value = '';
          return i;
        });
        this.form.components = res.components;
        this.form.name = res.name;
        this.form.pdfUrl = res.pdfUrl; // 用于预览
        this.form.fileUrl = res.fileUrl; // 备用，暂时没用到
        this.contractDetail = res;
        // FileSystemManager.getFileInfo(filePath).then(res=>{

        // })
      });
    },
    ...mapActions(['uinfo']),
    onChange(e) {
      if (this.form.signers[this.handleIndex].signerType === 1)
        this.form.signers[this.handleIndex].person = e.person;
      else this.form.signers[this.handleIndex].company = e.company;
    },
    onChange1(e, item) {
      this.form.components.forEach(item1 => {
        if (item1.id === item.id) item1.value = e.detail.value;
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
    },
    navigateTo(url) {
      // 未登录
      if (!this.userInfo || !this.userInfo.id) {
        this.common.toLogin();
        return;
      }
      // 未认证
      if (!this.userInfo.authentication) {
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
      let personFlag = true;
      let companyFlag = true;
      // 未认证  TO DO 确认一下企业身份是否可同样通过authentication判断
      if (!this.userInfo.authentication) {
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
      if (
        that.form.signers.find(
          i => (i.signerType === 1 && !i.person.name) || (i.signerType === 2 && !i.company.name)
        )
      ) {
        uni.showToast({ title: '请添加签署方信息', icon: 'none' });
        return;
      }
      if (that.form.components.find(i => i.required && !i.value)) {
        uni.showToast({ title: '请补充合同信息', icon: 'none' });
        return;
      }

      that.fastClick = false;
      uni.showLoading({
        title: '发起中...',
      });
      let form = JSON.parse(JSON.stringify(this.form));
      addTempStorage(form)
        .then(res => {
          const path = encodeURIComponent(
            config.manageAdminUrl + 'contract?token=' + uni.getStorageSync('token')
          );
          uni.navigateTo({
            url: `/pages/user/company/authorize?path=${path}&title=合同预览`,
          });
        })
        .finally(() => {
          that.fastClick = true;
          uni.hideLoading();
        });
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
        content: '签署文件最大5M，支持格式为pdf、doc、docx',
        title: '提示',
      });
    },
  },
  watch: {
    userInfo(value) {
      this.getCurrentState();
      if (value.authentication && value.companyAccountId) {
        that.getCurrentCompanyState();
      }
    },
  },
  onTabItemTap() {
    let that = this;
    if (that.userInfo) {
      that.form.initiateType = 0;
      that.form.name = '';
      that.form.signers = [];
      that.form.url = '';
    }
  },
};
</script>
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
    padding-bottom: 20rpx;
  }
  .signer-item {
    margin-top: 16rpx;
    box-sizing: border-box;
    padding: 24rpx;
    min-height: 128rpx;
    background: #fafafa;
    border-radius: 8rpx;
    .add-text {
      flex: 1;
      line-height: 80rpx;
      text-align: center;
      color: $uni-color-primary;
    }
    .img-avatar {
      flex-shrink: 0;
      margin-right: 16rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 8rpx;
    }
  }

  .signers-item {
    margin-bottom: 30rpx;
    .signers-title {
      border-left: 4rpx solid $uni-color-primary;
      padding-left: 12rpx;
      line-height: 28rpx;
    }
    .component-item {
      border-bottom: 1px solid #eee;
      padding: 20rpx 0;
      input {
        font-size: 26rpx;
        width: 100%;
      }
      .name {
        margin-bottom: 12rpx;
        position: relative;
        &.required::before {
          content: '*';
          color: $uni-color-error;
          font-weight: bold;
          padding-right: 4rpx;
        }
      }
    }
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
    .name {
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
</style>
