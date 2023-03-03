<!--
 * @Description:
 * @LastEditTime: 2022-09-22 14:19:25
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="search-box flex-sb">
      <view class="text-28 bold color-base">我的企业</view>
      <view @click="toCreate" class="text-26 color-primary">
      <!-- :class="{
        disabled: !authentication,
      }" -->
        +创建企业
      </view>
    </view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="item" @click="handleEnterprise(item)">
        <view class="text-26 color-base">{{ item.alias || '打非师范生打非师范生' }}</view>
        <view class="line-horizontal"></view>
        <view class="flex-fs">
          <view
            v-if="item.authentication === 1"
            class="tag-auth tag-auth__enterauth flex-ct text-20"
          >
            <image class="icon-auth" src="@/static/IconEnterpriseAuth.png"></image>
            企业认证
          </view>
          <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconEnterpriseUnAuth.png"></image>
            未认证
          </view>
          <!-- <view v-if="item.authentication == 1" class="tag-auth tag-auth__auth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconSeal2.png"></image>
            印章
          </view> -->
        </view>
        <image class="img-back" src="@/static/ImgBackEnterprise.png"></image>
        <view class="vertify flex-fs">
          <!-- <text v-if="item.authentication == 1">已认证</text>
          <text style="color: #fd9e5a" v-else-if="item.authentication == 2">认证中</text> -->

          <!-- <navigator
            v-if="item.authentication == 1"
            :url="'companySeal?companyId=' + item.companyId"
            hover-class="none"
          >
            <text class="text-primary">印章</text>
          </navigator> -->

          <!-- <navigator
            :url="'../company/removeComfirm?id=' + item.id + '&companyId=' + item.companyId"
            hover-class="none"
            class="remove"
          >
            <text class="iconfont icon-shanchu"></text>
            <text>移除</text>
          </navigator> -->
          <!-- <navigator v-else :url="'/pages/company/Certification?id=' + item.id" hover-class="none">
            <text class="text-primary">去认证</text>
            <text class="iconfont icon-xiangyou text-primary"></text>
          </navigator> -->
        </view>
      </view>
      <loadMore v-if="loading"></loadMore>
      <BaseEmpty v-if="noData" massage="暂无数据"></BaseEmpty>
      <baseline v-if="showBaseline"></baseline>
    </view>
    <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
      <view class="popup padding-safe">
        <navigator
          v-if="checkedEnterprise.authentication !== 1"
          class="row-popup text-28 flex-ct"
          hover-class="none"
          :url="'/pages/company/Certification?id=' + checkedEnterprise.id"
          @click="$refs.popupRef.close()"
        >
          去认证
        </navigator>
        <!-- <navigator
          v-if="checkedEnterprise.authentication === 1"
          class="row-popup text-28 flex-ct"
          hover-class="none"
          :url="'companySeal?companyId=' + checkedEnterprise.companyId"
          @click="$refs.popupRef.close()"
        >
          企业印章
        </navigator> -->
        <navigator
          class="row-popup text-28 flex-ct color-error"
          hover-class="none"
          :url="
            '../company/removeComfirm?id=' +
            checkedEnterprise.id +
            '&companyId=' +
            checkedEnterprise.companyId
          "
          @click="$refs.popupRef.close()"
        >
          移除企业
        </navigator>
        <view style="height: 32rpx; background-color: #f5f5f5"></view>
        <view class="row-popup text-28 flex-ct" @click="$refs.popupRef.close()">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { company, remove } from '@/api/company.js';
import { info } from '@/api/login.js';

export default {
  data() {
    return {
      list: [],
      loading: true,
      checkedEnterprise: null,
      params: {
        content: '',
        pageNum: 1,
        pageSize: 10,
      },
      authentication: false,
      noMore: false,
    };
  },
  computed: {
    noData() {
      return !this.loading && !this.list.length;
    },
    showBaseline() {
      return !this.noMore && !this.loading && this.params.pageNum > 1;
    },
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
  onShow() {
    if (uni.getStorageSync('refresh')) {
      uni.removeStorageSync('refresh');
      this.params.pageNum = 1;
      this.loading = true;
      this.list = [];
      this.getList();
    }
  },
  onLoad() {
    this.init();
  },
  methods: {
    getUinfo() {
      info().then(data => {
        this.authentication = data.authentication;
      });
    },
    async init() {
      await this.getUinfo();
      this.getList();
    },
    toCreate() {
      if (!this.authentication) {
        this.common.showToast('请先个人认证');
      } else {
        this.common.navigateTo('/pages/company/create');
      }
    },

    /**
     * @description: 管理企业弹窗
     * @param {object} item
     * @return {*}
     */
    handleEnterprise(item) {
      this.checkedEnterprise = item;
      this.$refs.popupRef.open();
    },

    getList() {
      this.noMore = false;
      company(this.params).then(data => {
        this.list = this.list.concat(data.rows);
        if (data.rows.length == this.params.pageSize) this.noMore = true;
        this.loading = false;
        uni.stopPullDownRefresh();
      });
    },
    remove() {
      if (!this.checkedEnterprise.authentication) {
        const baseIndex = this.list.findIndex(data => data.id === this.checkedEnterprise.id);
        remove({ id: this.checkedEnterprise.id }).then(() => {
          this.list.splice(baseIndex, 1);
        });
      } else {
        uni.navigateTo({
          url:
            '../company/removeComfirm?id=' +
            this.checkedEnterprise.id +
            '&companyId=' +
            this.checkedEnterprise.companyId,
        });
      }
    },
  },
  onReachBottom() {
    if (this.noMore) {
      this.params.pageNum++;
      this.getList();
    }
  },
  onPullDownRefresh() {
    this.params.pageNum = 1;
    this.loading = true;
    this.list = [];
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  margin-top: 32rpx;
  width: 686rpx;
}

.list {
  overflow: hidden;
  margin-top: 20rpx;
  width: 686rpx;

  .item {
    position: relative;
    margin-bottom: 32rpx;
    padding: 32rpx;
    background: #ffffff;
    border-radius: 12rpx;

    .line-horizontal {
      margin: 20rpx 0;
      width: 622rpx;
      height: 1px;
      background: #e6e6e6;
    }

    .icon-auth {
      margin-right: 4rpx;
      width: 24rpx;
      height: 24rpx;
    }

    .tag-auth {
      box-sizing: border-box;
      margin-right: 20rpx;
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

    .img-back {
      position: absolute;
      right: 10rpx;
      bottom: 0;
      width: 198rpx;
      height: 157rpx;
    }
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

.container-empty {
  margin-top: 100rpx;
}
</style>
