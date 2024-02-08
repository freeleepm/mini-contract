<!--
 * @Author: wudi
 * @Date: 2023-10-10 09:57:01
 * @LastEditors: wudi
 * @LastEditTime: 2023-10-27 15:50:32
 * @Description:
-->
<template>
  <view class="page-base">
    <view class="search-box flex-ct">
      <view class="search flex-fs">
        <uni-icons type="search" size="24" class="icon-search flex-ct" color="#3277FF"></uni-icons>
        <input
          class="flex-1 text-28 color-base"
          placeholder="请输入用户全名搜索"
          v-model="params.userName"
          @confirm="confirm"
        />
        <uni-icons
          v-if="params.userName"
          type="clear"
          size="22"
          class="flex-ct"
          color="#E6E6E6"
          @click="clear"
        ></uni-icons>
      </view>
    </view>
    <view class="list">
      <view v-for="(item, index) in list" :key="index" class="item" @click="handlePersonal(item)">
        <view class="text-26 color-base person-info">
          <view>{{ item.authName || '' }}</view>
          <view>{{ item.authAccount || '' }}</view>
        </view>
        <view class="line-horizontal"></view>
        <view class="flex-fs">
          <view v-if="item.authState === 2" class="tag-auth tag-auth__auth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconUserAuth.png"></image>
            已实名
          </view>
          <view v-else class="tag-auth tag-auth__unauth flex-ct text-20">
            <image class="icon-auth" src="@/static/IconUserUnAuth.png"></image>
            未认证
          </view>
        </view>
        <!-- <image class="img-back" src="@/static/ImgBackEnterprise.png"></image> -->
      </view>
      <loadMore v-if="loading"></loadMore>
      <BaseEmpty v-if="noData" massage="暂无数据">
        <view class="btn-box" v-if="params.userName && noSearchData">
          <button open-type="share" class="send-btn" type="primary">邀请用户注册</button>
        </view>
      </BaseEmpty>
      <baseline v-if="showBaseline"></baseline>
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
import { info } from '@/api/login.js';
import { mapState } from 'vuex';
import setting from '@/static/config/setting.js';
export default {
  data() {
    return {
      list: [],
      loading: false,
      params: {
        userName: '',
        pageNum: 1,
        pageSize: 10,
      },
      noMore: false,
      originType: null,
      // 搜索时没有数据的时候展示
      noSearchData: false,
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
      // this.loading = true;
      this.list = [];
      // this.getList();
    }
  },
  onLoad(e) {
    // this.getList();
    console.log('e :', e);
    if (e.originType) {
      this.originType = e.originType;
    }
  },
  methods: {
    /**
     * @description: 个人
     * @param {object} item
     * @return {*}
     */
    handlePersonal(item) {
      console.log('item :', item);
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2]; //上一个页面
      let object = {
        name: item.authName,
        mobile: item?.mobile,
      };
      prevPage.onShow(object);
      uni.navigateBack();
    },
    getList(type) {
      this.noMore = false;
      userInfoApi.getAuthPersonList(this.params).then(data => {
        if (type && type === 'confirm' && !data.rows.length) {
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
      this.params.userName = '';
      this.params.pageNum = 1;
      // this.loading = true;
      this.list = [];
      // this.getList();
    },
  },
  onShareAppMessage() {
    return {
      title: '邀您注册' + setting.appName + '小程序，签署合同>',
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
    // this.params.pageNum = 1;
    // this.loading = true;
    // this.list = [];
    // this.getList();
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
  .person-info {
    display: flex;
    justify-content: space-between;
  }
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
