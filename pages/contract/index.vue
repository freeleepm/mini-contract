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
    <view class="list" v-if="contract.length">
      <contractCard :item="item" v-for="(item, i) in contract" :key="item.id" />
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
import { mapState, mapActions } from 'vuex';
import contractCard from '../home/components/contractCard';
import userInfoApi from '@/api/api.js';
export default {
  components: {
    contractCard,
  },
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
    ...mapState(['token']),
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
    switchClick(e) {
      //导航切换
      this.current = e;
      this.contract = [];
      this.params.pageNum = 1;
      this.params.state = this.list[e].state;
      this.params.self = this.list[e].self;
      this.loading = true;
      if (!this.token) {
        this.loading = false;
        return;
      }
      this.getData();
    },
    navigateTo(url) {
      var that = this;
      if (this.token) {
        this.common.navigateTo(url);
      } else {
        this.common.toLogin();
      }
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
  padding: 32rpx;
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
