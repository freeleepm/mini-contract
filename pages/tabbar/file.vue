<!--
 * @Description:
 * @LastEditTime: 2022-09-15 10:06:29
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="file">
    <v-tabs
      :tabs="list"
      field="name"
      :fixed="true"
      :value="current"
      bgColor="#fff"
      @change="switchClick"
    ></v-tabs>
    <view class="list flex-col" v-if="contract.length">
      <view
        class="item"
        v-for="(item, i) in contract"
        :key="i"
        @click="navigateTo('/pages/switchIdentity/contractDetails?id=' + item.id)"
      >
        <view class="title flex-sb">
          <view class="text-elps name flex-1 text-28 bold">
            {{ item.name || '' }}
          </view>
          <view
            class="tag-status text-26 flex-ct"
            style="color: #ee6a15; background: #ffefe6"
            v-if="item.state == 0"
          >
            待签署
          </view>
          <view
            class="tag-status text-26 flex-ct"
            style="color: #00cf15; background: #e6ffe8"
            v-if="item.state == 1"
          >
            已完成
          </view>
          <view
            class="tag-status text-26 flex-ct"
            style="color: #ff0000; background: #ffe8e8"
            v-if="item.state == 2"
          >
            已拒签
          </view>
          <view
            class="tag-status text-26 flex-ct"
            style="color: #ff0000; background: #ffe8e8"
            v-if="item.state == 3"
          >
            已撤销
          </view>
          <view
            class="tag-status text-26 flex-ct"
            style="color: #666666; background: #e6e6e6"
            v-if="item.state == 4"
          >
            已逾期
          </view>
        </view>
        <view class="date-box">
          <view class="text-26 flex">
            <view class="key">发起方</view>
            <view class="val">
              <view class="bold">{{ item.initiatorName || '' }}</view>
            </view>
          </view>
          <view class="text-26 flex">
            <view class="key">签署方</view>
            <view class="val">
              <view class="bold">{{ item.signers }}</view>
            </view>
          </view>
          <view class="text-26 flex">
            <view class="key">发起时间</view>
            <view class="val">{{ item.startTime || '' }}</view>
          </view>
          <view class="text-26 flex">
            <view class="key">截止时间</view>
            <view class="val">{{ item.endTime || '' }}</view>
          </view>
          <view
            v-if="item.state === 0 && item.initiatorName === userInfo.nickname"
            class="btn-vice text-26"
            @click.stop="navigateTo('/pages/switchIdentity/revoke?id=' + item.id)"
          >
            撤销
          </view>
        </view>
      </view>
    </view>
    <loadMore v-if="loading"></loadMore>
    <baseline v-if="showBaseline"></baseline>
    <view v-if="noData" class="contailner-empty flex-col">
      <BaseEmpty massage="暂无数据~"></BaseEmpty>
      <view class="btn-primary" @click="navigateTo('/pages/tabbar/sign')">签署合同</view>
    </view>
  </view>
</template>

<script>
import userInfoApi from '@/api/api.js';
export default {
  data() {
    return {
      contract: [],
      current: 0,
      list: [
        {
          id: 0,
          state: '',
          self: '',
          name: '全部',
        },
        {
          id: 1,
          state: 0,
          self: 1,
          name: '待我处理',
        },
        {
          id: 2,
          state: 0,
          self: 0,
          name: '待他人处理',
        },
        {
          id: 3,
          state: 1,
          self: '',
          name: '已完成',
        },
        {
          id: 4,
          state: 2,
          self: '',
          name: '已拒签',
        },
        {
          id: 5,
          state: 3,
          self: '',
          name: '已撤销',
        },
        {
          id: 6,
          state: 4,
          self: '',
          name: '已逾期',
        },
      ],
      userInfo: {},
      params: {
        pageNum: 1,
        pageSize: 10,
        state: '', // 0待处理,1已完成,2已拒签,3已撤销,4已逾期
        self: '', // 0查询他人,1查询自己,不传查询所有
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
  },
  onShow() {
    const type = uni.getStorageSync('contractType');
    if (type) {
      this.current = type;
      uni.removeStorageSync('contractType');
    }
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
      this.loading = true;
      this.params.state = this.list[this.current].state;
      this.params.self = this.list[this.current].self;
      this.params.pageNum = 1;
      if (!uni.getStorageSync('userInfo')) {
        this.loading = false;
        return;
      }
      userInfoApi.personalInformation().then(data => {
        this.userInfo = data;
      });
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
    switchClick(e) {
      //导航切换
      this.current = e;
      this.contract = [];
      this.params.pageNum = 1;
      this.params.state = this.list[e].state;
      this.params.self = this.list[e].self;
      this.loading = true;
      if (!uni.getStorageSync('userInfo')) {
        this.loading = false;
        return;
      }
      this.getData();
    },
    navigateTo(url) {
      var that = this;
      if (uni.getStorageSync('userInfo').token) {
        this.common.navigateTo(url);
      } else {
        uni.showModal({
          title: '温馨提示',
          content: '请先登录/注册，方可进行下一步操作',
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file {
  min-height: 100vh;
  background: #f5f5f5;
}

.add-sign {
  position: fixed;
  right: 20rpx;
  bottom: 382rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: #7a62bb;
  z-index: 4;
  box-shadow: 0px 0px 16rpx 0px rgba(10, 93, 96, 0.72);
  .icon-jiahao1 {
    color: white;
    font-size: 40rpx;
  }
}
.list {
  width: 100%;
  margin-top: 20rpx;
  .item {
    overflow: hidden;
    position: relative;
    margin-bottom: 20rpx;
    width: 686rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    .title {
      padding: 0 28rpx;
      height: 96rpx;
      position: relative;
      background-color: #f7f9ff;
      border-bottom: 1px solid #e6e6e6;
      overflow: hidden;
    }

    .tag-status {
      padding: 0 20rpx;
      height: 40rpx;
      border-radius: 22rpx;
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
        width: 152rpx;
        color: #999999;
      }

      .val {
        color: #333333;
      }

      .btn-vice {
        margin-top: 28rpx;
        width: 112rpx;
        height: 48rpx;
        border-radius: 26rpx;
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
