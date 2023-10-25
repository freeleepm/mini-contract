<!--
 * @Description:
 * @LastEditTime: 2023-09-26 11:32:58
 * @LastEditors: wudi
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view v-if="data">
      <!-- 合同名 -->
      <view class="contai-head flex">
        <view class="text-28 bold color-base flex-1">{{ data.name || '合同不存在' }}</view>
        <view class="tag-status text-26 flex-ct" :class="'status-color-' + data.state">
          {{ data.state | stateHandle }}
        </view>
      </view>

      <!-- 签署文件 -->
      <view class="contai-file color-base" style="border-radius: 0 0 12rpx 12rpx">
        <view class="row text-28 bold">签署合同</view>

        <view class="row">
          <FileItem
            :file="{
              size: data.fileSize,
              name: data.name,
            }"
            @click.native="openFile(data.url)"
          ></FileItem>
        </view>

        <view class="row flex-fs text-26">
          <text class="key color-grey-minor">发起方</text>
          <text class="color-base">
            {{
              initiatorList.length
                ? initiatorList
                    .map(i => {
                      return i.userName;
                    })
                    .join(',')
                : '--'
            }}
          </text>
        </view>
        <view class="row flex-fs text-26">
          <text class="key color-grey-minor">签署方</text>
          <text class="color-base">
            {{
              data.signers.length
                ? data.signers
                    .map(i => {
                      return i.userName;
                    })
                    .join(',')
                : '--'
            }}
          </text>
        </view>
        <view class="row flex-fs text-26">
          <text class="key color-grey-minor">发起时间</text>
          <text class="color-base">{{ data.startTime || '' }}</text>
        </view>
        <view class="row flex-fs text-26">
          <text class="key color-grey-minor">截止时间</text>
          <text class="color-base">{{ data.endTime || '' }}</text>
        </view>
      </view>

      <!-- 签署流程 -->
      <view class="contai-file color-base">
        <view class="flex-sb">
          <view class="text-28 bold">签署流程</view>
          <!-- #ifdef MP -->
          <!-- 由于多方签署多个签署链接不分享 -->
          <button
            open-type="share"
            class="flex-fs wx-share"
            v-if="mySignInfo && mySignInfo.asInitiator && data.state < 1"
          >
            <image src="/static/icon-share.png"></image>
            <text class="text-24 color-primary">分享给签署方</text>
          </button>
          <!-- #endif -->
        </view>
        <view class="container flex-col">
          <view class="container-person width-full">
            <view class="item">
              <view class="color-grey-minor text-28">发起方</view>
              <signerInfo :item="item" v-for="(item, index) in initiatorList" :key="index" />
            </view>
            <view class="line-horizontal"></view>
            <view class="item">
              <view class="color-grey-minor text-28">签署方</view>
              <signerInfo :item="item" v-for="(item, index) in signersList" :key="index" />
            </view>
          </view>
        </view>
      </view>

      <!-- 合同状态为未签署 -->
      <template v-if="data.state === 0">
        <!-- 我的签署状态为未签署才可以签署合同，不管是发起方还是签署方 -->
        <view v-if="mySignInfo && mySignInfo.state === 0" class="btn-primary" @click.stop="toSign">
          签署合同
        </view>

        <!-- 发起人才可撤销 -->
        <view
          v-if="mySignInfo && mySignInfo.asInitiator"
          class="btn-primary btn-cancel"
          @click.stop="common.navigateTo('/pages/contract/revoke/index?id=' + data.id)"
        >
          撤销合同
        </view>
      </template>
      <template v-if="mySignInfo.state === 1">
        <view class="btn-primary" @click.stop="toDetail">
          查看详情
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import { getCompanyState } from '@/api/company.js';
import { mapState, mapActions } from 'vuex';
import signerInfo from './components/signerInfo.vue';

export default {
  components: {
    signerInfo,
  },
  data() {
    return {
      data: '',
      contractId: '',
      companyList:[],
      authObj:{},
      authCompanyObj:{}
    };
  },
  computed: {
    ...mapState(['userInfo']),
    signersList() {
      // 签署方信息
      return this.data ? this.data.signers.filter(i => i.asInitiator === false) : [];
    },
    initiatorList() {
      // 发起方信息
      return this.data ? this.data.signers.filter(i => i.asInitiator === true) : [];
    },
    mySignInfo() {
      // 当前用户的签署信息
      return this.data ? this.data.signers.find(k => k.userId === this.userInfo.id) : {};
    },
  },
  onLoad(options) {
    let that = this;
    that.contractId = options?.id;
    that.getUserInfo();
    that.getCompanyList();
    that.getCurrentState();
    if(that.userInfo.authentication && that.userInfo.companyAccountId) {
      that.getCurrentCompanyState();
    }
    console.log('this.userInfo :', this.userInfo)
    console.log('this.data :', this.data)
    console.log('this.mySignInfo :', this.mySignInfo)
  },
  onShow() {
    let that = this;
    that.getUserInfo();
    that.getCompanyList();
  },
  methods: {
    ...mapActions(['uinfo']),
    toSign() {
      let that = this;
      if (!this.mySignInfo) {
        uni.showToast({
          title: '签署链接获取失败',
          icon: 'none',
        });
        return;
      }
      if (!that.userInfo.authentication) {
        if(Number(that?.authObj?.localAuthState) === 2) {
          uni.showModal({
          content: '用户认证中，请稍后再试',
          confirmText: '继续认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/personal/Certification?id=' +  that.contractId  + '&originType=sign',
              });
            }
          },
        });
          that.getCompanyList();
          that.getCurrentState();
          return;
        }
        uni.showModal({
          content: '签署前需要完成个人认证，方可进行下一步操作',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/personal/Certification?id=' +  that.contractId  + '&originType=sign',
              });
            }
          },
        });
        return;
      }
      // console.log('this.userInfo :', this.userInfo)
      // console.log('this.signersList :', this.signersList)
    const currentSigner = that.signersList.find(item=> item.phone === that.userInfo.phone)
      console.log('currentSigner :', currentSigner)
    // 公司
    if(currentSigner && currentSigner.signType === 2) {
      console.log('that.userInfo :', that.userInfo)
      if(!that.userInfo.companyAccountId) {
        uni.showModal({
          content: '该操作需要企业认证，请切换企业身份或完成企业认证！',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/user/company/Certification?id=' + that.contractId + '&originType=sign',
              });
            }
          },
        });
        return;
      }
    }

    if(Number(that?.authObj?.globalAuthState) === 1 && that?.authObj?.authUrl) {
      uni.showModal({
          content: '由于签署渠道变更，需要重新个人认证',
          confirmText: '去认证',
          confirmColor: '#3277FF',
          success: function (res) {
            if (res.confirm) {
              uni.redirectTo({
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authObj.authUrl),
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
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authObj.authUrl),
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
              that.getCurrentState()
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
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authCompanyObj.authUrl),
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
                url: '/pages/user/company/authorize?path=' + encodeURIComponent(that?.authCompanyObj.authUrl),
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
              that.getCurrentCompanyState()
            }
          },
        });
        return;

      }
    }

      uni.navigateTo({
        url: '/pages/user/company/authorize?path=' + encodeURIComponent(this.mySignInfo.signUrl),
      });
    },
    toDetail(){
      if(this.data.state === 1) {
        this.openFile(this.data.url)
      } else {
        uni.navigateTo({
          url: '/pages/user/company/authorize?path=' + encodeURIComponent(this.mySignInfo.signUrl),
        });
      }
    },
    openFile(url) {
      if (url) {
        // #ifndef H5
        uni.showLoading({
          title: '请稍等',
        });
        uni.downloadFile({
          url: url,
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
      } else {
        // this.common.showToast('合同暂未签署完成');
      }
    },
    getUserInfo() {
      userInfoApi
      .contractDetails({
        contractId: this.contractId,
      })
      .then(res => {
        console.log('res :', res)
        const signersList = res.signers.filter(i => !i.asInitiator);
        const initiatorList = res.signers.filter(i => i.asInitiator);
        res.signers = [...initiatorList, ...signersList]; // 重新排序保证发起方在第一个
        this.data = res;
        uni.stopPullDownRefresh();
      }).catch(()=> {
        uni.stopPullDownRefresh();
      });
    },
    getCompanyList(){
      let that = this;
      userInfoApi
        .enterpriseList({
          pageNum: 1,
          pageSize: 999,
        })
        .then(res => {
          that.companyList = res.rows;
          if(that.companyList.length) {
            let obj = {};
            that.signersList.forEach(signer=> {
              that.companyList.forEach(com=> {
                if(signer.companyId === com.companyId) {
                  obj = com;
                }
              })
            })
            if(JSON.parse(JSON.stringify(obj)) !== '{}' && !that.mySignInfo.asInitiator) {
              that.changeRole(obj);
            }
          }
        })
    },
    changeRole(obj){
      let that = this;
      if(obj.companyId) {
        userInfoApi
        .IdentitySwitching(obj.companyId)
        .then(res => {
          that.uinfo();
        })
        .catch(() => {
        });
      }

    },
    getCurrentState() {
      userInfoApi.getAuthState({type:7, params:this.contractId}).then(res=> {
        this.authObj = res;
      })
    },
    getCurrentCompanyState(){
      getCompanyState({type:7, params:this.contractId}).then(res=> {
        this.authCompanyObj = res;
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '这份合同需要您签署，前往查看>',
      desc: '',
      path: '/pages/index/index?id=' + this.contractId + '&uid=' + this.userInfo.id,
      imageUrl: 'https://resource.yi-types.com/eSign/20230228-145916.png',
    };
  },
  onShareTimeline() {
    return {
      title: '这份合同需要您签署，前往查看>',
      desc: '',
      path: '/pages/index/index?id=' + this.contractId + '&uid=' + this.userInfo.id,
      imageUrl: 'https://resource.yi-types.com/eSign/20230228-145916.png',
    };
  },
  onPullDownRefresh() {
    let that = this;
    that.getUserInfo();
    that.getCompanyList();
    that.getCurrentState();
    if(that.userInfo.authentication && that.userInfo.companyAccountId) {
      that.getCurrentCompanyState();
    }
  },
};
</script>

<style lang="scss" scoped>
.line-horizontal {
  margin: 0 0 30rpx 0;
  border-bottom: 1px dashed #e6e6e6;
}

.contai-file {
  box-sizing: border-box;
  padding: 32rpx;
  margin-bottom: 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;
  .wx-share {
    border-radius: 50rpx;
    image {
      width: 24rpx;
      height: 24rpx;
      margin-right: 10rpx;
    }
  }

  .row {
    margin-bottom: 20rpx;

    &:last-child {
      margin: 0;
    }
  }

  .key {
    width: 152rpx;
  }

  .container {
    box-sizing: border-box;
    margin-top: 40rpx;
    padding-left: 25rpx;
    border-left: 1px solid $uni-border-color;

    .container-person {
      margin-top: -20rpx;
    }

    .item {
      position: relative;
      padding-bottom: 24rpx;
      &::before {
        content: '';
        position: absolute;
        top: 12rpx;
        left: -30rpx;
        width: 12rpx;
        height: 12rpx;
        background: $uni-color-primary;
        border-radius: 50%;
      }
    }
  }
}

.contai-head {
  box-sizing: border-box;
  padding: 32rpx;
  width: 686rpx;
  background: #ffffff;
  margin-top: 32rpx;
  border-radius: 12rpx 12rpx 0 0;
  border-bottom: 1px solid #f5f5f5;
  .color-base {
    word-break: break-all;
  }
  .tag-status {
    padding: 0 20rpx;
    height: 40rpx;
    border-radius: 22rpx;
    margin-left: 30rpx;
  }
}

.btn-primary {
  margin: 60rpx auto;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
  &.btn-cancel {
    background: $uni-color-error !important;
  }
}
</style>
