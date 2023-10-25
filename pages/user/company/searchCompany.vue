<!--
 * @Description:
 * @LastEditTime: 2023-10-10 16:37:42
 * @LastEditors: wudi
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="search-box flex-ct">
        <view class="search flex-fs">
          <uni-icons
            type="search"
            size="24"
            class="icon-search flex-ct"
            color="#3277FF"
          ></uni-icons>
          <input
            class="flex-1 text-28 color-base"
            placeholder="请输入公司名称搜索"
            v-model="params.companyName"
            @confirm="confirm"
          />
          <uni-icons
            v-if="params.companyName"
            type="clear"
            size="22"
            class="flex-ct"
            color="#E6E6E6"
            @click="clear"
          ></uni-icons>
        </view>
      </view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="item" @click="handleEnterprise(item)">
        <view class="text-26 color-base">{{ item.companyName || '' }}</view>
        <view class="line-horizontal"></view>
        <view class="flex-fs">
          <view
            v-if="item.authState === 2"
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
          <!-- <navigator v-else :url="'/pages/user/company/Certification?id=' + item.id" hover-class="none">
            <text class="text-primary">去认证</text>
            <text class="iconfont icon-xiangyou text-primary"></text>
          </navigator> -->
        </view>
      </view>
      <loadMore v-if="loading"></loadMore>
      <BaseEmpty v-if="noData" massage="暂无数据">
        <view class="btn-box" v-if="params.companyName && noSearchData">
          <button open-type="share" class="send-btn" type="primary">邀请企业用户注册</button>
        </view>
      </BaseEmpty>
      <baseline v-if="showBaseline"></baseline>
    </view>

  </view>
</template>

<script>
import { getAuthCompanyList } from '@/api/company.js';
import { info } from '@/api/login.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      list: [],
      loading: true,
      checkedEnterprise: null,
      params: {
        companyName: '',
        pageNum: 1,
        pageSize: 10,
      },
      noMore: false,
      originType:null,
      // 搜索时没有数据的时候展示
      noSearchData:false
    };
  },
  computed: {
    noData() {
      return !this.loading && !this.list.length;
    },
    showBaseline() {
      return !this.noMore && !this.loading && this.params.pageNum > 1;
    },
    ...mapState(['userInfo']),
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
  onLoad(e) {
    this.getList();
    console.log('e :', e)
    if(e.originType) {
      this.originType = e.originType;
    }
  },
  methods: {

    /**
     * @description: 管理企业弹窗
     * @param {object} item
     * @return {*}
     */
    handleEnterprise(item) {
      console.log('item :', item)
      this.checkedEnterprise = item;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
      let object={
          companyName:item.companyName,
      }
      prevPage.onShow(object);
      uni.navigateBack();
      // uni.redirectTo({
      //   url:'/pages/contract/sign/index?companyName='+ item.companyName
      // })
    },
    getList(type) {
      this.noMore = false;
      getAuthCompanyList(this.params).then(data => {
        if(type && type === 'confirm' && !data.rows.length) {
          this.noSearchData = true;
        } else {
          this.noSearchData = false;
        }
        this.list = this.list.concat(data.rows);
        if (data.rows.length == this.params.pageSize) this.noMore = true;
        this.loading = false;
        uni.stopPullDownRefresh();
      });
    },
    confirm() {
      this.params.pageNum = 1;
      this.loading = true;
      this.list = [];
      this.getList('confirm');
    },
    clear() {
      this.params.companyName = '';
      this.params.pageNum = 1;
      this.loading = true;
      this.list = [];
      this.getList();
    },
  },
  onShareAppMessage() {
    return {
      title: '邀您注册一合通小程序，签署合同>',
      desc: '',
      // path: '/pages/index/index?id=' + this.contractId + '&uid=' + this.userInfo.id,
      // path: '/pages/user/company/Certification',
      path: '/pages/index/index',
      imageUrl: 'https://resource.yi-types.com/eSign/esign.png',
    };
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
  margin: 32rpx 0 0 0;
  .search {
    box-sizing: border-box;
    padding: 0 21rpx;
    width: 686rpx;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 8rpx;
  }

  .icon-search {
    width: 39rpx;
    margin-right: 20rpx;
  }
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
.btn-box {
  .send-btn {
      width: 598rpx;
      height: 88rpx;
      /* height: 84rpx;
      width: 260rpx; */
      line-height: 88rpx;
      margin-top: 100rpx;
      font-size: $uni-font-size-base;
      background-color: $uni-color-primary;
      white-space: nowrap;
    }
}
</style>
