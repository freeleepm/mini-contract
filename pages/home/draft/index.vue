<template>
  <view class="page">
    <view class="list" v-if="contract.length">
      <navigator
        :url="
          item.type === 1
            ? '/pages/contract/sign/signByTemplate?draftId=' + item.id
            : '/pages/contract/sign/index?draftId=' + item.id
        "
        hover-class="none"
        class="item"
        v-for="(item, i) in contract"
        :key="item.id"
      >
        <view class="title flex-sb">
          <image src="/static/icon-file.png" class="icon"></image>
          <view class="name flex-1 text-28 bold">
            {{ item.content ? JSON.parse(item.content).form.name : '--' }}
          </view>
          <image
            @click.stop="onDel(item, i)"
            src="/static/IconDelete.png"
            class="icon"
            style="opacity: 0.6"
          ></image>
        </view>
        <view class="date-box">
          <view class="text-26 flex">
            <view class="key">发起方</view>
            <view class="val">{{ item.initiatorName || '' }}</view>
          </view>
          <view class="text-26 flex">
            <view class="key">签署方</view>
            <view class="val">{{ item.signatoryName }}</view>
          </view>
        </view>
      </navigator>
    </view>
    <loadMore v-if="loading"></loadMore>
    <baseline v-if="showBaseline"></baseline>
    <view v-if="noData" class="contailner-empty flex-col">
      <BaseEmpty massage="暂无数据~"></BaseEmpty>
      <view class="btn-primary" @click="navigateTo('/pages/contract/sign/index')">签署合同</view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import { list, del, edit } from '@/api/draft.js';
export default {
  data() {
    return {
      contract: [],
      params: {
        pageNum: 1,
        pageSize: 20,
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
  },
  onShow() {
    this.init();
  },
  methods: {
    loadMore() {
      if (this.hasMore) {
        this.loading = true;
        this.params.pageNum++;
        this.getData();
      }
    },
    init() {
      if (this.token) {
        this.params.pageNum = 1;
        this.loading = true;
        this.getData();
      }
    },
    getData() {
      this.hasMore = false;
      list(this.params).then(data => {
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
    navigateTo(url) {
      if (this.token) {
        this.common.navigateTo(url);
      } else {
        this.common.toLogin();
      }
    },
    onDel(item, i) {
      const that = this;
      uni.showModal({
        title: '温馨提示',
        content: '草稿删除后将不可恢复，是否继续？',
        confirmColor: '#dd524d',
        confirmText: '确定删除',
        cancelText: '取消',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            del(item.id).then(() => {
              uni.showToast({
                title: '删除成功！',
                icon: 'none',
              });
              that.contract.splice(i, 1);
            });
          }
        },
      });
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
}
.list {
  padding: 32rpx;
  .item {
    overflow: hidden;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 40rpx;
    border-radius: 12rpx;
    .title {
      padding: 28rpx;
      position: relative;
      background-color: #f7f9ff;
      border-bottom: 1px solid rgba(230, 230, 230, 0.5);
      overflow: hidden;
      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
      }
      .name {
        white-space: break-spaces;
        word-break: break-all;
      }
    }

    .date-box {
      padding: 0 28rpx;
      padding-bottom: 28rpx;
      background-color: white;
      border-radius: 0 0 30rpx 30rpx;

      .text-26 {
        margin-top: 29rpx;
        line-height: 37rpx;
      }

      .key {
        flex-shrink: 0;
        width: 146rpx;
        color: #999999;
      }

      .val {
        color: #333333;
        flex: 1;
        word-wrap: break-all;
        text-align: justify;
      }
    }
  }
}

.contailner-empty {
  margin-top: 50rpx;

  .btn-primary {
    margin-top: 100rpx;
    width: 598rpx;
    height: 88rpx;
    border-radius: 8rpx;
  }
}
</style>
