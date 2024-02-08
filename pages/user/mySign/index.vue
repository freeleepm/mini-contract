<template>
  <view class="page">
    <view class="list" v-if="contract.length">
      <!-- TO DO 判断当前使用 签名链接替换-->
      <view
        class="item"
        @click="pick(item)"
        :class="{ active: i === 0 }"
        v-for="(item, i) in contract"
        :key="item.id"
      >
        <image src="https://dummyimage.com/1000x1000?text=img路径" mode="aspectFill"></image>
        <!-- <view class="flex-ct cur">
          <uni-icons type="checkmarkempty"></uni-icons>
          <text>当前使用</text>
        </view> -->
      </view>
    </view>
    <loadMore v-if="loading"></loadMore>
    <baseline v-if="showBaseline"></baseline>
    <view class="flex-col">
      <BaseEmpty v-if="noData" massage="暂无数据~"></BaseEmpty>
    </view>

    <btn-fixed>
      <navigator url="./create" class="btn-primary">添加个人签名</navigator>
    </btn-fixed>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import userInfoApi from '@/api/api.js';
export default {
  data() {
    return {
      contract: [],
      params: {
        pageNum: 1,
        pageSize: 10,
        state: '',
        self: '',
        showStartWithMe: false,
      },
      hasMore: false,
      loading: true,
    };
  },
  computed: {
    noData() {
      return !this.loading && !this.contract.length;
    },
    showBaseline() {
      return !this.hasMore && !this.loading && this.params.pageNum > 1;
    },
    ...mapState(['token']),
    ...mapState(['userInfo']),
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;
      this.params.pageNum = 1;
      if (!this.token) {
        this.loading = false;
        return;
      }
      this.getData();
    },
    getData() {
      this.hasMore = false;
      userInfoApi.contractList(this.params).then(data => {
        if (this.params.pageNum == 1) {
          this.contract = data.rows || [];
        } else {
          this.contract = this.contract.concat(data.rows);
        }
        if (data.rows.length == this.params.pageSize) {
          this.hasMore = true;
        }
        this.loading = false;
        uni.stopPullDownRefresh();
      });
    },
    pick(item) {
      console.log(item);
    },
  },
  onReachBottom() {
    if (this.hasMore) {
      this.loading = true;
      this.params.pageNum++;
      this.getData();
    }
  },
  onPullDownRefresh() {
    this.loading = true;
    this.params.pageNum = 1;
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 32rpx;
  .btn-primary {
    height: 88rpx;
    border-radius: 8rpx;
  }
}
.list {
  display: flex;
  flex-wrap: wrap;
  margin-right: -24rpx;
  .item {
    overflow: hidden;
    height: 248rpx;
    width: calc(50% - 24rpx);
    background-color: #ffffff;
    position: relative;
    margin-bottom: 24rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    position: relative;
    image {
      width: 100%;
      height: 100%;
      display: block;
    }
    .cur {
      display: none;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      height: 60rpx;
      background: #ebf1ff;
      text {
        color: $uni-color-primary;
        font-weight: bold;
        padding-left: 6rpx;
      }
      /deep/ {
        .uni-icons {
          color: $uni-color-primary !important;
          font-weight: bold;
          font-size: 46rpx !important;
          position: relative;
          top: 4rpx;
        }
      }
    }
    &.active {
      border: 1px solid $uni-color-primary;
      .cur {
        display: flex;
      }
    }
  }
}
</style>
