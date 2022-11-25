<!--
 * @Description:
 * @LastEditTime: 2022-09-16 14:31:53
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <!-- 合同名 -->
    <view class="contai-head flex-fs">
      <image class="icon-file" src="@/static/IconFile.png"></image>
      <view class="text-26 color-base flex-1 text-elps">{{ data.name || '无合同' }}</view>
      <view
        v-if="data.state == 0"
        class="tag-status text-26 flex-ct"
        style="color: #ee6a15; background: #ffefe6"
      >
        待签署
      </view>
      <view
        v-if="data.state == 1"
        class="tag-status text-26 flex-ct"
        style="color: #00cf15; background: #e6ffe8"
      >
        已完成
      </view>
      <view
        v-if="data.state == 2"
        class="tag-status text-26 flex-ct"
        style="color: #ff0000; background: #ffe8e8"
      >
        已拒签
      </view>
      <view
        v-if="data.state == 3"
        class="tag-status text-26 flex-ct"
        style="color: #ff0000; background: #ffe8e8"
      >
        已撤销
      </view>
      <view
        v-if="data.state == 4"
        class="tag-status text-26 flex-ct"
        style="color: #666666; background: #e6e6e6"
      >
        已逾期
      </view>
    </view>

    <!-- 签署文件 -->
    <view class="contai-file color-base">
      <view class="row text-28 bold">签署合同</view>

      <view class="row head-docx flex" @click="listImg(data.url)">
        <image class="icon-doc" src="@/static/IconPdf.png"></image>
        <view>
          <view class="text-26 color-base" style="margin-bottom: 4rpx">
            {{ data.url ? data.name : '正在生成中' }}
          </view>
          <view class="text-24 color-grey-minor">{{ data.fileSize | size }}</view>
        </view>
      </view>
      <view class="row flex-fs text-26">
        <text class="key color-grey-minor">发起方</text>
        <text class="color-base">{{ data.initiatorName || '' }}</text>
      </view>
      <view class="row flex-fs text-26">
        <text class="key color-grey-minor">签署方</text>
        <text class="color-base">{{ data.signers[1].userName || '' }}</text>
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
    <!-- v-if="data && data.signers" -->
    <view class="contai-file color-base">
      <view class="text-28 bold">签署流程</view>
      <view class="container flex-col">
        <view class="container-person width-full">
          <view v-for="(item, index) in data.signers" :key="index" class="item">
            <view class="text-26 flex-sb">
              <view class="color-grey-minor">{{ index ? '签署方' : '发起方' }}</view>
              <view>
                <text v-if="item.state === 0" style="color: #ee6a15">待签署</text>
                <text v-else-if="item.state === 1" style="color: #00cf15">已签署</text>
                <text v-else-if="item.state === 2" style="color: #ff0000">已拒签</text>
                <template v-else-if="item.state === 5">
                  <template v-if="data.state === 3">
                    <view v-if="index === 0" style="color: #ff0000">已撤销</view>
                    <view v-else style="color: #666666">合同终止</view>
                  </template>
                  <template v-if="data.state === 4">
                    <view v-if="data.signers[index - 1].state !== 5" style="color: #666666">
                      已逾期
                    </view>
                    <view v-else style="color: #666666">合同终止</view>
                  </template>
                </template>
                <text v-else style="color: #ee6a15">合同不存在</text>
              </view>
            </view>

            <view v-if="item.companyId" class="info-box flex flex-1">
              <image class="img-avatar" :src="'../../static/ImgDefEnterprise.png'"></image>
              <view class="flex-wrap">
                <view class="text-28 color-base bold width-full">
                  {{ item.userName || '未认证用户' }}
                </view>

                <view v-if="item.companyId" class="tag-auth tag-auth__enterauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
                  企业认证
                </view>

                <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
                  未认证
                </view>

                <view v-if="item.state === 1" class="text-enterprise text-26 color-base-minor">
                  签署时间：{{ item.gmtSign || '' }}
                </view>
                <view v-if="item.state === 2" class="text-enterprise text-26 color-base-minor">
                  拒签时间：{{ item.gmtSign || '' }}
                </view>
                <view
                  v-if="item.state === 5 && data.state === 4"
                  class="text-enterprise text-26 color-base-minor"
                >
                  截止时间：{{ data.endTime || '' }}
                </view>
              </view>
            </view>
            <!-- 个人 -->
            <view v-else class="info-box flex flex-1">
              <image
                class="img-avatar"
                :src="item.avatarUrl || '../../static/ImgDefAvatar.png'"
              ></image>
              <view class="flex-wrap">
                <view class="text-28 color-base bold width-full">
                  {{ item.userName || '未认证用户' }}
                </view>
                <view v-if="item.userName" class="tag-auth tag-auth__auth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
                  已实名
                </view>
                <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                  <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
                  未实名
                </view>

                <view v-if="item.state === 1" class="text-enterprise text-26 color-base-minor">
                  签署时间：{{ item.gmtSign || '' }}
                </view>
                <view v-if="item.state === 2" class="text-enterprise text-26 color-base-minor">
                  拒签时间：{{ item.gmtSign || '' }}
                </view>
                <view
                  v-if="item.state === 5 && data.state === 4"
                  class="text-enterprise text-26 color-base-minor"
                >
                  截止时间：{{ data.endTime || '' }}
                </view>
              </view>
            </view>

            <view
              v-if="(data.state == 2 && index === 1) || (data.state == 3 && index === 0)"
              class="row-mark flex-fs"
            >
              <uni-icons
                class="flex-ct icon-help-filled"
                type="help-filled"
                size="16"
                color="#FF731D"
              ></uni-icons>
              <view v-if="index === 0" class="text-24">撤销原因: {{ data.result }}</view>
              <view v-if="index === 1" class="text-24">拒签原因: {{ item.result }}</view>
            </view>

            <view v-if="index === 0" class="line-horizontal"></view>
          </view>
        </view>
      </view>
    </view>

    <view
      v-if="data.state === 0 && data.initiatorName === userInfo.nickname"
      class="btn-primary"
      @click.stop="navigateTo('/pages/switchIdentity/revoke?id=' + data.id)"
    >
      撤销合同
    </view>

    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" @change="change">
      <view class="popup-window">
        <!-- 弹出头部 -->
        <view class="window-head">
          <view class="head1">
            {{ num }}
          </view>
          <view class="head2">
            <text class="iconfont icon-guanbi head3" @click="change1()"></text>
          </view>
        </view>

        <!-- 弹窗内容 -->
        <view class="window-content">
          <view class="text1">
            {{ data.result || '系统繁忙,请稍后再试' }}
          </view>
        </view>

        <view class="window-button">
          <button type="default" @click="change1()">取消</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import { imageUrl } from '@/filters/filters.js';
export default {
  data() {
    return {
      list: false,
      type: 'bottom',
      data: {
        signers: ['', ''],
      },
      userInfo: {},
      num: '',
      contractId: '',
    };
  },
  onLoad(options) {
    // console.log(options,'asdasd');
    this.contractId = options?.id;
  },
  onShow() {
    userInfoApi.contractDetails(this.contractId).then(data => {
      this.data = data;
    });
    userInfoApi.personalInformation().then(data => {
      this.userInfo = data;
    });
  },
  methods: {
    navigateTo(url) {
      this.common.navigateTo(url);
    },
    toggle(type, num) {
      this.type = type;
      this.num = num;
      // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
      this.$refs.popup.open(type);
    },
    change(e) {
      console.log('当前模式：' + e.type + ',状态：' + e.show);
    },
    change1() {
      this.$refs.popup.close();
    },
    listImg(img) {
      if (img) {
        // #ifndef H5
        uni.showLoading({
          title: '请稍等',
        });
        uni.downloadFile({
          url: imageUrl(img),
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

  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
};
</script>

<style lang="scss" scoped>
.popup-window {
  width: 100%;
  .window-content {
    width: 100%;
    height: 400rpx;
    .text1 {
      width: 90%;
      margin-left: 5%;
      font-size: 36rpx;
      line-height: 60rpx;
    }
  }
  .window-head {
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head1 {
      margin-left: 20rpx;
      font-weight: 900;
    }
    .head2 {
      margin-right: 20rpx;
      .head3 {
        font-size: 24rpx;
      }
    }
  }
}

.line-horizontal {
  margin: 28rpx 0;
  height: 0;
  border-bottom: 1px dashed #e6e6e6;
}

.contai-file {
  box-sizing: border-box;
  padding: 32rpx;
  margin-top: 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .head-docx {
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 8rpx;

    .icon-doc {
      flex-shrink: 0;
      margin-right: 16rpx;
      width: 74rpx;
      height: 74rpx;
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

    .info-box {
      margin-top: 16rpx;
    }
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
    margin-top: 4rpx;
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

  .text-enterprise {
    flex-basis: 100%;
    margin-top: 16rpx;
    width: 110%;
  }

  .row-mark {
    margin-top: 20rpx;
    padding: 16rpx;
    background: #f5f5f5;
    border-radius: 8rpx;

    .icon-help-filled {
      width: 24rpx;
      margin-right: 12rpx;
    }

    .text-24 {
      color: #ff731d;
    }
  }
}

.contai-head {
  box-sizing: border-box;
  padding: 0 32rpx;
  width: 100%;
  height: 104rpx;
  background: #ffffff;
  border-top: 1px solid $uni-border-color;

  .icon-file {
    margin-right: 10rpx;
    width: 32rpx;
    height: 32rpx;
  }

  .tag-status {
    padding: 0 20rpx;
    height: 40rpx;
    border-radius: 22rpx;
  }
}

.btn-primary {
  margin-top: 60rpx;
  margin-bottom: 158rpx;
  width: 598rpx;
  height: 88rpx;
  border-radius: 8rpx;
}
</style>
