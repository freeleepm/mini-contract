<!--
 * @Description:
 * @LastEditTime: 2022-09-16 13:56:46
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
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
      <view
        v-if="file"
        class="row block-card flex"
        @click="navigateTo('/pages/user/fileManage?pick=1&id=' + file.id)"
      >
        <image
          v-if="file.name.indexOf('.doc') > -1"
          class="icon-doc"
          src="@/static/IconDoc.png"
        ></image>
        <image
          v-if="file.name.indexOf('.pdf') > -1"
          class="icon-doc"
          src="@/static/IconPdf.png"
        ></image>
        <view class="flex-1">
          <view class="text-name text-26 color-base">{{ file.name }}</view>
          <view class="text-24 color-grey-minor">{{ file.size | size }}</view>
        </view>
        <view class="flex-col">
          <image class="icon-change" src="@/static/IconCheckout.png"></image>
          <view class="text-24 color-base-minor">更改</view>
        </view>
      </view>
      <view
        v-else
        class="btn-pick btn-primary text-30"
        @click="navigateTo('/pages/user/fileManage?pick=1')"
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
      
     <!-- <uni-datetime-picker type="datetime" :value="form.endTime" :start="start" @change="change">
        <view class="text-26 color-base flex-sb">
          <view>{{ form.endTime || '请选择截止时间' }}</view>
          <uni-icons type="forward" size="15" color="#B3B3B3" class="flex-ct"></uni-icons>
        </view>
      </uni-datetime-picker> -->
      <picker mode="date" :value="form.endTime" :start="start" @change="change" v-if="!reloading">
        <view class="text-26 color-base flex-sb">
          <view>{{ form.endTime || '请选择截止时间' }}</view>
          <uni-icons type="forward" size="15" color="#B3B3B3" class="flex-ct"></uni-icons>
        </view>
      </picker>
    </view>

    <view class="container-card">
      <view class="title bold text-28 color-base">签署流程</view>

      <view class="group">
        <text class="text-26 color-grey-minor">发起方</text>
        <view class="row block-card flex" @click="showIdentityCheck">
          <!-- 企业 -->
          <view v-if="form.signers[0].companyId" class="flex flex-1">
            <image class="img-avatar" :src="'../../static/ImgDefEnterprise.png'"></image>
            <view class="flex-wrap">
              <view class="text-28 color-base bold width-full">
                {{ form.signers[0].nickname || '未认证用户' }}
                
                <text class="sealCount">套餐<text class="color-primary">{{userInfo.companyMealCount || 0}}</text>份</text>
              </view>
              <view
                v-if="form.signers[0].authentication"
                class="tag-auth tag-auth__enterauth flex-ct text-20"
              >
                <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
                企业认证
              </view>
              <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
                未认证
              </view>

              <view class="text-enterprise text-26 color-base">
                {{ form.signers[0].companyName || '' }}
              </view>
            </view>
          </view>
          <!-- 个人 -->
          <view v-else class="flex flex-1">
            <image
              class="img-avatar"
              :src="form.signers[0].avatarUrl || '../../static/ImgDefAvatar.png'"
            ></image>
            <view class="flex-wrap">
              <view class="flex-fs width-full">
                <text class="text-30 color-base bold">{{ form.signers[0].nickname || '未认证用户' }}</text>
                
                <text class="sealCount">套餐<text class="color-primary">{{userInfo.individualMealCount || 0}}</text>份</text>
              </view>
              <view
                v-if="form.signers[0].authentication"
                class="tag-auth tag-auth__auth flex-ct text-20"
              >
                <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
                已实名
              </view>
              <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
                未实名
              </view>
            </view>
          </view>
          <view class="flex-col">
            <image class="icon-change" src="@/static/IconCheckout.png"></image>
            <view class="text-24 color-base-minor">更改</view>
          </view>
        </view>
      </view>

      <view class="group">
        <text class="text-26 color-grey-minor">签署方</text>
        <view class="row block-card flex">
          <view
            v-if="!form.signers[1].companyId && !form.signers[1].userId"
            class="flex-ct width-full"
          >
            <navigator
              class="flex-fs add-item"
              hover-class="none"
              url="/pages/sign/pickObject?type=1"
            >
              <image class="icon-add" src="@/static/IconMan.png"></image>
              <text class="text-26 color-base">添加个人</text>
            </navigator>
            <view class="line-vertical"></view>
            <navigator
              class="flex-fs add-item"
              hover-class="none"
              url="/pages/sign/pickObject?type=2"
            >
              <image class="icon-add" src="@/static/IconEnterprise2.png"></image>
              <text class="text-26 color-base">添加企业</text>
            </navigator>
          </view>
          <template v-else>
            <!-- 企业 -->
            <view v-if="form.signers[1].companyId" class="flex flex-1">
              <image class="img-avatar" :src="'../../static/ImgDefEnterprise.png'"></image>
              <view class="flex-wrap">
                <view class="text-28 color-base bold width-full">
                  {{ form.signers[1].nickname || '未认证用户' }}
                </view>
                <view v-if="false" class="tag-auth tag-auth__unauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
                  未认证
                </view>
                <view v-else class="tag-auth tag-auth__enterauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
                  企业认证
                </view>
                <view class="text-enterprise text-26 color-base">
                  {{ form.signers[1].companyName || '' }}
                </view>
              </view>
            </view>
            <!-- 个人 -->
            <view v-else class="flex flex-1">
              <image class="img-avatar" :src="'../../static/ImgDefAvatar.png'"></image>
              <view class="flex-wrap">
                <view class="text-28 color-base bold width-full">
                  {{ form.signers[1].nickname || '未认证用户' }}
                </view>
                <view
                  v-if="form.signers[1].authentication"
                  class="tag-auth tag-auth__auth flex-ct text-20"
                >
                  <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
                  已实名
                </view>
                <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
                  未实名
                </view>
              </view>
            </view>
            <view @click="del" class="flex-col">
              <image class="icon-change" src="@/static/IconDelete.png"></image>
              <view class="text-24 color-base-minor">删除</view>
            </view>
          </template>
        </view>
      </view>
    </view>

    <view class="btn-next btn-primary" :class="{ disabled: isFormDisabled }" @click="submit">
      下一步
    </view>

    <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
      <view class="identity padding-safe">
        <view class="flex-sb text-32">
          <view class="color-base-minor" @click="$refs.popupRef.close()">取消</view>
          <view class="color-base bold">切换身份</view>
          <view class="color-primary" @click="comfirmIdentity">确定</view>
        </view>
        <view class="list">
          <view class="item flex flex-1" @click="identitySwitching(userInfo, -1)">
            <image
              class="img-avatar"
              :src="userInfo.avatarUrl || '../../static/ImgDefAvatar.png'"
            ></image>
            <view class="flex-wrap">
              <view class="width-full flex-fs">
                <text class="text-30 color-base bold">{{ userInfo.nickname || '未认证用户' }}</text>
                <text class="sealCount">套餐<text class="color-primary">{{userInfo.individualMealCount || 0}}</text>份</text>
              </view>

              <view v-if="userInfo.authentication" class="tag-auth tag-auth__auth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
                已实名
              </view>
              <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
                未实名
              </view>
            </view>

            <uni-icons
              v-if="contractCheckedIndex === -1"
              class="icon-checkbox flex-ct"
              type="checkbox-filled"
              size="24"
              color="#3277FF"
            ></uni-icons>
          </view>
          <view
            v-for="(item, index) in contract"
            :key="index"
            class="item flex flex-1"
            @click="identitySwitching(item, index)"
          >
            <image class="img-avatar" :src="'../../static/ImgDefEnterprise.png'"></image>
            <view class="flex-wrap">
              <view class="text-28 color-base bold width-full">
                {{ userInfo.nickname || '未认证用户' }}
                <text class="sealCount">套餐<text class="color-primary">{{item.companyMealCount || 0}}</text>份</text>
              </view>

              <view v-if="item.authentication" class="tag-auth tag-auth__enterauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
                企业认证
              </view>
              <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
                未认证
              </view>

              <view class="text-enterprise text-26 color-base">
                {{ item.alias || '' }}
              </view>
            </view>

            <uni-icons
              v-if="contractCheckedIndex === index"
              class="icon-checkbox flex-ct"
              type="checkbox-filled"
              size="24"
              color="#3277FF"
            ></uni-icons>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
var that;
import { sign, recent } from '@/api/company.js';
import userInfoApi from '@/api/api.js';
import { info } from '@/api/login.js';
export default {
  data() {
    return {
      start: '',
      file: '',
      form: {
        endTime: '',
        name: '',
        url: '',
        signers: [
          {
            // 发起方
            userId: '',
            companyId: '',
            nickname: '',
            phone: '',
          },
          {
            // 签署方
            userId: '',
            companyId: '',
            nickname: '',
            phone: '',
          },
        ],
      },

      userInfo: '',
      showReadeMe: false,
      contract: [],
      contractCheckedIndex: 0,
      reloading: true,
      fastClick: true
    };
  },
  computed: {
    isFormDisabled() {
      return !this.form.name || !this.form.signers.every(item => item.id);
    },
  },
  onShow() {
    this.init();
  },
  onLoad() {
    uni.$on('getSignatory', signatory => {
      this.form.signers[1] = signatory;
    });
    this.form.endTime = this.GetDateStr(1)
    setTimeout(()=>{
      this.start = this.form.endTime.replace(' 23:59:59', '');
      this.reloading = false;
      this.$forceUpdate()
    },100)
  },
  beforeDestroy() {
    this.hide();
  },
  destroyed() {
    this.hide();
  },
  methods: {
    hide() {
      uni.hideLoading();
      uni.setStorageSync('file_name', this.form.name);
    },
    GetDateStr(AddDayCount) {//获取AddDayCount天后的日期
      var dd = new Date();
      dd.setDate(dd.getDate()+AddDayCount);
      var y = dd.getFullYear();
      var m = dd.getMonth()+1;
      m = m < 10 ? '0' + m : m;
      var d = dd.getDate();
      d = d < 10 ? '0' + d : d;
      return y + "-" + m + "-" + d + ' 23:59:59';
    },
    init() {
      that = this;
      uni.getStorage({
        key: 'readeMe',
        success: function (state) {
          that.showReadeMe = !state.data;
        },
        fail(err) {
          that.showReadeMe = true;
        },
      });
      uni.getStorage({
        key: 'file',
        success: function (res) {
          if (res.data) {
            that.file = res.data;
            that.form.url = res.data.url;
            uni.getStorage({
              key: 'file_name',
              success: function (name) {
                if (name.data) {
                  that.form.name = name.data;
                } else {
                  let index = res.data.name.lastIndexOf('.');
                  index = index > 20 ? 20 : index;
                  that.form.name = res.data.name.slice(0, index);
                  uni.setStorageSync('file_name', that.form.name);
                }
              },
              fail(err) {
                let index = res.data.name.lastIndexOf('.');
                index = index > 20 ? 20 : index;
                that.form.name = res.data.name.slice(0, index);
                uni.setStorageSync('file_name', that.form.name);
              },
            });
          }
        },
      });
      if (!uni.getStorageSync('userInfo')) {
        this.loading = false;
        return;
      }
      info().then(data => {
        if (data) {
          data.userId = data.id;
          that.form.signers[0] = data;
          that.form.signers = [].concat(that.form.signers);
          that.userInfo = data;
        }
        this.getContract();
      });
    },

    getContract() {
      userInfoApi
        .enterpriseList({
          pageNum: 1,
          pageSize: 999,
        })
        .then(data => {
          this.contract = data.rows;

          const contractCheckedIndex = this.contract.findIndex(item => {
            return item.companyId === that.form.signers[0].companyId;
          });

          this.contractCheckedIndex = contractCheckedIndex || -1;
        });
    },
    identitySwitching(item, index) {
      if (item.authentication == 1 || item.authentication === true) {
        this.contractCheckedIndex = index;
      } else {
        uni.showToast({
          icon: 'none',
          title: '个人或企业实名认证未完成，请先实名认证',
        });
      }
    },
    comfirmIdentity() {
      const person = {
        ...this.userInfo,
        companyId: '',
        companyName: '',
      };
      const identity = [person, ...this.contract][this.contractCheckedIndex + 1];

      userInfoApi
        .IdentitySwitching(identity.companyId || '')
        .then(res => {
          this.$set(this.form.signers, 0, res);
          this.$refs.popupRef.close();
        })
        .catch(() => {
          uni.showToast({
            icon: 'none',
            title: '更改失败',
          });
        });
    },
    showIdentityCheck() {
      this.contractCheckedIndex =
        this.contract.findIndex(item => {
          return item.companyId === that.form.signers[0].companyId;
        }) || -1;

      this.$refs.popupRef.open();
    },

    iknow() {
      uni.setStorageSync('readeMe', true);
      this.showReadeMe = false;
    },
    navigateTo(url) {
      if (that.form.signers[0].id) {
        this.hide();
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
                that.common.navigateTo('/pages/user/Certification');
              }
            },
          });
          return;
        }
        that.common.navigateTo(url);
      } else {
        that.showModel();
      }
    },

    del() {
      uni.showModal({
        content: '确认删除当前所添加签署方吗?',
        confirmText: '确认',
        cancelText: '取消',
        confirmColor: '#3277FF',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            that.form.signers[1] = {
              userId: '',
              companyId: '',
              nickname: '',
              phone: '',
            };
            that.form.signers = [].concat(that.form.signers);
          }
        },
      });
    },

    showModel() {
      uni.showModal({
        title: '请先登录/注册',
        content: '签署前需要登录，方可进行下一步操作',
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
    },
    getRecentPerson() {
      recent({
        role: 0,
      }).then(res => {
        that.list = res.rows || [];
        that.showPickPerson = true;
      });
    },
    getRecentCompany() {
      recent({
        role: 1,
      }).then(res => {
        that.companyList = res.rows || [];
        that.showPickCompany = true;
      });
    },
    handlePickShow(type) {
      if (!that.form.signers[0].id) {
        // 未登录
        that.showModel();
        return;
      }
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
              that.common.navigateTo('/pages/user/Certification');
            }
          },
        });
        return;
      }

      uni.navigateTo({
        url: '/pages/pickObject?type=' + type,
      });
    },
    change(e) {
      that.form.endTime = e.detail.value+ ' 23:59:59';
    },
    submit() {
      if (!that.fastClick) return;
      if (!that.form.signers[0].id) {
        // 未登录
        that.showModel();
        return;
      }
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
              that.common.navigateTo('/pages/user/Certification');
            }
          },
        });
        return;
      }
      // 合同数不足
      if((that.form.signers[0].companyId && that.form.signers[0].companyMealCount < 1) || (!that.form.signers[0].companyId && that.form.signers[0].individualMealCount < 1)){
        uni.showModal({
          title: '',
          content: '剩余合同份数为0，请先购买套餐',
          confirmText: '购买',
          cancelText: '取消',
          confirmColor: '#3277FF',
          cancelColor: '#999999',
          success: function (res) {
            if (res.confirm) {
              that.common.navigateTo('/pages/combo/buy');
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

      if (!that.form.signers[1].userId) {
        uni.showToast({ title: '请添加签署方', icon: 'none' });
        return;
      }
      // return
      that.fastClick = false;
      uni.showLoading({
        title: '发起中...',
      });
      let form = JSON.parse(JSON.stringify(this.form))
      form.endTime = form.endTime
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
                  that.$emit('tab', 1);
                  uni.removeStorageSync('file');
                  uni.removeStorageSync('file_name');
                  that.file = '';
                  that.form.name = '';
                  that.form.url = '';
                  that.form.signers[1] = {
                    userId: '',
                    companyId: '',
                    nickname: '',
                    phone: '',
                  };
                  if (res) {
                    uni.redirectTo({
                      url: '/pages/company/authorize?path=' + encodeURIComponent(res),
                    })
                    return
                  }
                }
                that.fastClick = true;
                uni.switchTab({
                  url: '/pages/tabbar/home',
                })
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
  },
};
</script>

<style lang="scss" scoped>
.container-card {
  margin-top: 32rpx;
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  background-color: #fff;
  border-radius: 12rpx;
}
.sealCount{
  font-size: 20rpx;
  font-weight: normal;
  margin-left: 12rpx;
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
  height: 42rpx;
}

.line-horizontal {
  width: 100%;
  height: 1px;
  margin: 32rpx 0;
  background: #e6e6e6;
}

.group {
  margin-top: 20rpx;
}

.row {
  margin-top: 16rpx;

  .line-vertical {
    margin: 0 94rpx;
    width: 1px;
    height: 24rpx;
    background: #e6e6e6;
  }
}

.block-card {
  box-sizing: border-box;
  padding: 24rpx;
  width: 100%;
  min-height: 128rpx;
  background: #fafafa;
  border-radius: 8rpx;
}

.img-avatar {
  flex-shrink: 0;
  margin-right: 16rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
}

.tag-auth {
  box-sizing: border-box;
  margin-top: 8rpx;
  padding: 0 10rpx;
  height: 36rpx;
  border-radius: 18rpx;
  border: 1px solid currentColor;
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

.icon-change {
  margin-top: 8rpx;
  width: 32rpx;
  height: 32rpx;
}

.icon-auth {
  width: 24rpx;
  height: 24rpx;
}

.icon-add {
  margin-right: 4rpx;
  width: 48rpx;
  height: 48rpx;
}

.text-enterprise {
  flex-basis: 100%;
  margin-top: 16rpx;
  width: 110%;
}

.icon-doc {
  flex-shrink: 0;
  margin-right: 16rpx;
  width: 70rpx;
  height: 70rpx;
}

.text-name {
  margin-bottom: 4rpx;
  word-break: break-word;
}

.text-26 {
  line-height: 37rpx;
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

.identity {
  box-sizing: border-box;
  overflow: hidden;
  padding: 32rpx;
  padding-bottom: 0;
  width: 100%;
  background: #ffffff;
  border-radius: 12rpx 12rpx 0px 0px;

  .list {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 40vh;
  }

  .item {
    position: relative;
    padding: 32rpx 0;
    border-bottom: 1px solid #e6e6e6;

    &:last-child {
      border: 0;
    }

    .icon-checkbox {
      position: absolute;
      top: 54rpx;
      right: 0;
      width: 36rpx;
      height: 36rpx;
    }
  }
}
</style>
