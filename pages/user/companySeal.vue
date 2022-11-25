<!--
 * @Description:
 * @LastEditTime: 2022-09-16 17:27:54
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <template v-if="list.length">
      <view class="title-bar">
        <view class="text-28 color-base-minor">我的企业</view>
        <picker class="picker" mode="selector" :range="list" @change="change" range-key="name">
          <view class="flex-sb">
            <view class="flex-fs text-30 color-base">
              <view class="text-elps" style="max-width: 70%">{{ currentCompany.name }}</view>
              <view
                v-if="currentCompany.authentication"
                class="tag-auth tag-auth__enterauth flex-ct text-20"
              >
                <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
                企业认证
              </view>
              <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
                <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
                未认证
              </view>
            </view>
            <uni-icons
              class="flex-ct icon-forward"
              type="forward"
              size="16"
              color="#B3B3B3"
            ></uni-icons>
          </view>
        </picker>
      </view>

      <view v-show="type === 1" class="list flex-wrap flex-sb">
        <view class="item flex-ct" @click="type = 2">
          <view class="flex-col">
            <image class="icon-camera" src="@/static/IconCamera.png"></image>
            <view class="text-28 color-primary">创建印章</view>
          </view>
        </view>

        <view
          v-for="(item, index) in data"
          :key="index"
          class="item flex-ct"
          @click="(checkedSeal = item), $refs.popupRef.open()"
        >
          <image
            class="img-seal"
            mode="aspectFit"
            :src="(item.sealUrl || '').replace('/home/developer/resources/', '') | imgFilter"
          ></image>
          <!-- <text
            v-if="!item.think && item.state == 1"
            class="iconfont icon-shanchu"
            @click="remove(index, item.sealId)"
          ></text>
          <template v-if="item.state == 1">
            <view class="flex-ct" v-if="item.think">
              <text class="iconfont icon-checked"></text>
              <text class="text-primary">默认</text>
            </view>
            <view class="flex-ct" v-else @click="setDefault(index, item.sealId)">
              <text class="iconfont icon-unCheck"></text>
              <text>默认</text>
            </view>
          </template> -->
          <!-- <view class="flex-ct" v-if="item.state == 2">
            <text style="color: #f79f31">待审核</text>
          </view>
          <view class="flex-ct" v-if="item.state == 3">
            <text style="color: #e60000">已驳回</text>
          </view> -->
        </view>
      </view>
      <!-- <empty msg='没有相关印章' v-if="noSeal"></empty> -->

      <view v-show="type === 2" class="container-upload">
        <view class="group-card flex-col">
          <view @click="pickImg" class="border-upload flex-ct">
            <image v-if="tempFilePath" :src="tempFilePath.path" mode="aspectFit"></image>
            <view v-else class="flex-col">
              <image class="icon-upload" src="@/static/IconUpload.png"></image>
              <view class="text-24 color-grey-minor">上传企业印章需清晰可见</view>
            </view>
          </view>

          <view class="tip text-24 color-base-minor">请在以上区域上传企业印章</view>
          <view class="tip text-24 color-base-minor">支持jpg、jpeg、png格式且小于10M的文件。</view>
        </view>

        <view class="flex-sb">
          <view class="btn-vice" @click="clear">返回</view>
          <view
            class="btn-primary"
            @click="submit"
            :class="{
              disabled: !currentCompany || !tempFilePath,
            }"
          >
            完成
          </view>
        </view>
      </view>
    </template>

    <view v-if="noData" style="margin-top: 200rpx">
      <BaseEmpty massage="你还没绑定企业哦"></BaseEmpty>
    </view>

    <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
      <view class="popup padding-safe">
        <view
          v-if="!checkedSeal.think"
          class="row-popup text-28 flex-ct"
          @click="setDefault(index, checkedSeal.sealId)"
        >
          设为默认印章
        </view>
        <view
          v-if="!checkedSeal.think && checkedSeal.state == 1"
          class="row-popup text-28 flex-ct color-error"
          @click="remove(index, checkedSeal.sealId)"
        >
          删除印章
        </view>
        <view style="height: 32rpx; background-color: #f5f5f5"></view>
        <view class="row-popup text-28 flex-ct" @click="$refs.popupRef.close()">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
var that;
import { upload } from '@/api/upload.js';
import { delegate } from '@/api/company.js';
import { setCache, getCache } from '@/common/cache.js';
import { setDefault, handleDelete, list, getCode, getToken, createImage } from '@/api/seal.js';

export default {
  data() {
    return {
      type: 1,
      data: [],
      currentCompany: '',
      pageNum: 1,
      list: [],
      loading: true,
      companyId: '',
      handleID: '',
      hanleType: '', // 1删除 2 设置默认
      sealLoading: false,
      checkedSeal: null,
      tempFilePath: '',
      accessToken: '',
    };
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
  computed: {
    noData() {
      return !this.list.length && !this.loading;
    },
    noSeal() {
      return !this.data.length && !this.sealLoading;
    },
  },
  onShow() {},
  onLoad(e) {
    that = this;
    that.hanleType = '';
    if (e.companyId) {
      that.companyId = e.companyId;

      let eToken = getCache('eToken');
      if (eToken) {
        that.accessToken = eToken;
      } else {
        if (e.auth == 1) {
          // e签宝返回的页面
          that.getEToken(e.code);
        } else {
          that.getECode();
        }
      }
    }

    this.getCompanyList();
  },
  methods: {
    getEToken(code) {
      getToken({
        redirectUrl: '/pages/company/addSeal?id=' + that.currentCompany.id + '&auth=1', // 认证完成后跳转页面
        // redirectUrl: encodeURIComponent('https://esign.yi-types.com/seal.html?type=1&companyId='+that.currentCompany.id), // 认证完成后跳转页面
        code: code,
        refreshToken: '',
      }).then(res => {
        setCache('eToken', res.token, 1.9 * 60 * 60);
        if (that.hanleType == 1) {
          that.hanleDel();
        }
        if (that.hanleType == 2) {
          that.hanleSetDefault();
        }
        that.getList();
      });
    },
    getECode() {
      getCode({
        redirectUrl: '/pages/company/addSeal?id=' + that.currentCompany.id + '&auth=1', // 认证完成后跳转页面
        // redirectUrl: encodeURIComponent('https://esign.yi-types.com/seal.html?type=1&companyId='+that.currentCompany.id), // 认证完成后跳转页面
        account: uni.getStorageSync('userInfo').phone, // 账号标识（手机号或者邮箱）
        receiveUrlMobileNo: uni.getStorageSync('userInfo').phone, // 接收认证链接短信通知的手机号
        receiveUrlEmail: 'bestjhh@163.com', // 接收认证链接通知的邮件地址
        subjectName: that.currentCompany.name, // 组织名称
        subjectCertNo: that.currentCompany.creditCode, //统一信用代码
        organizationType: 1, // 组织机构类型 1 - 企业类,2 - 个体工商户,99 - 其他组织
        legalRepName: that.currentCompany.nickname, // 法定代表人姓名
        legalRepCertNo: that.currentCompany.idNumber, //法定代表人证件号
        individualName: '', // 个人姓名
        individualCertNo: '', // 个人证件号
      }).then(url => {
        if (url) {
          if (url.indexOf('code=') > -1) {
            let index = url.indexOf('code=');
            let index2 = url.indexOf('&oid=');
            that.getEToken(url.slice(index + 5, index2));
          } else {
            uni.navigateTo({
              url: '/pages/company/authorize?path=' + encodeURIComponent(url),
            });
          }
        }
      });
    },
    change(e) {
      that.currentCompany = that.list[e.detail.value];
      that.getList();
    },
    getList() {
      if (getCache('eToken')) {
        that.sealLoading = true;
        list({
          companyId: that.currentCompany.id,
          token: getCache('eToken'),
        })
          .then(res => {
            that.data = res.sealVOList || [];
            that.sealLoading = false;
          })
          .catch(() => {
            that.sealLoading = false;
          });
      } else {
        that.getECode();
      }
    },
    getCompanyList() {
      delegate({
        pageNum: that.pageNum,
        pageSize: 10,
      }).then(data => {
        that.list = that.list.concat(data.rows);
        if (that.pageNum == 1 && that.list.length && !that.companyId) {
          if (!that.currentCompany) that.currentCompany = that.list[0];
          that.getList();
        }
        if (data.rows.length && data.rows.length == 10) {
          that.pageNum++;
          that.getCompanyList();
        }
        if (that.companyId && !that.currentCompany) {
          that.currentCompany = that.list.find(i => i.id == that.companyId);
          that.getList();
        }
        that.loading = false;
      });
    },
    hanleSetDefault() {
      setDefault({
        sealId: that.handleID,
        token: getCache('eToken'),
      }).then(() => {
        that.getList();
      });
    },
    hanleDel() {
      handleDelete({
        sealId: that.handleID,
        token: getCache('eToken'),
      }).then(() => {
        that.getList();
      });
    },
    remove(i, id) {
      uni.showModal({
        title: '删除提醒',
        content: '是否确定要删除该印章？',
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#3277FF',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            that.handleID = id;
            that.hanleType = 1;
            if (getCache('eToken')) {
              that.hanleDel();
            } else {
              that.getECode();
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    setDefault(i, id) {
      that.handleID = id;
      that.hanleType = 2;
      if (getCache('eToken')) {
        that.hanleSetDefault();
      } else {
        that.getECode();
      }
    },

    clear() {
      that.tempFilePath = '';
      this.type = 1;
    },
    submit() {
      if (that.accessToken) {
        if (that.tempFilePath) {
          uni.showLoading({
            title: '请稍等',
          });
          upload(that.tempFilePath).then(path => {
            if (path) {
              createImage({
                alias: '印章' + new Date().getTime(),
                imageSize: that.tempFilePath.size,
                height: 159, // that.tempFilePath.height
                width: 159, // that.tempFilePath.width
                sealBizType: 'PUBLIC', // 印章业务类型 PUBLIC - 公章 CONTRACT - 合同专用章 FINANCE - 财务专用章 LEGAL_PERSON - 法定代表人章 COMMON - 其他
                filePath: path,
                creditCode: that.currentCompany.creditCode,
                token: that.accessToken,
                companyId: that.currentCompany.id,
              })
                .then(image => {
                  uni.hideLoading();
                  uni.showModal({
                    title: '印章上传成功',
                    content: '审核通过后即可使用，请您耐心等待！',
                    confirmText: '好的',
                    cancelText: '取消',
                    confirmColor: '#3277FF',
                    cancelColor: '#999999',
                    success: function () {
                      that.getList();
                      that.clear();
                    },
                  });
                })
                .catch(() => {
                  uni.hideLoading();
                });
            } else {
              uni.hideLoading();
            }
          });
        } else {
          uni.showToast({
            title: '请上传印章',
            icon: 'none',
          });
        }
      } else {
        that.getECode();
      }
    },
    pickImg() {
      uni.chooseImage({
        count: 1,
        success: function (res) {
          if (res.tempFiles) {
            uni.getImageInfo({
              src: res.tempFilePaths[0],
              success: function (image) {
                if (image.type == 'png' || image.type == 'jpeg' || image.type == 'jpg') {
                  image.size = parseInt(res.tempFiles[0].size / 1024);
                  that.tempFilePath = image;
                  console.log(that.tempFilePath);
                } else {
                  that.common.showToast('图片格式不支持');
                }
              },
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title-bar {
  box-sizing: border-box;
  padding: 32rpx;
  width: 100%;
  height: 162rpx;
  background: #ffffff;
  .picker {
    margin-top: 16rpx;
  }

  .icon-auth {
    margin-right: 4rpx;
    width: 24rpx;
    height: 24rpx;
  }

  .tag-auth {
    box-sizing: border-box;
    margin-left: 10rpx;
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
}
.list {
  margin-top: 32rpx;
  width: 686rpx;

  .item {
    flex-shrink: 0;
    margin-bottom: 30rpx;
    width: 328rpx;
    height: 328rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .icon-camera {
      margin-bottom: 14rpx;
      width: 44rpx;
      height: 44rpx;
    }

    .img-seal {
      width: 200rpx;
      height: 200rpx;
    }
  }
}

.container-upload {
  margin-top: 32rpx;

  .group-card {
    width: 686rpx;
    height: 546rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .border-upload {
      overflow: hidden;
      margin-top: 100rpx;
      margin-bottom: 40rpx;
      width: 240rpx;
      height: 240rpx;
      border-radius: 12rpx;
      border: 1px solid $uni-color-primary;
    }

    .icon-upload {
      width: 52rpx;
      height: 52rpx;
    }

    .border-upload .text-24 {
      margin-top: 22rpx;
      width: 144rpx;
      text-align: center;
    }
  }

  .btn-primary,
  .btn-vice {
    margin-top: 70rpx;
    width: 324rpx;
    height: 88rpx;
    border-radius: 8rpx;
  }
}

.popup {
  overflow: hidden;
  border-radius: 12rpx 12rpx 0 0;
  background-color: #fff;

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
