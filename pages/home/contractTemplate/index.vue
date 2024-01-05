<template>
  <view class="page">
    <loading ref="loading" />
    <template v-if="CategoryList.length">
      <view class="tab-list flex-col">
        <view
          class="tab-item"
          v-for="(item, i) in CategoryList"
          :key="i"
          :class="{
            active: i === current,
            prev: i === current - 1,
            next: i === current + 1,
          }"
          @click="tabChange(item.id, i)"
        >
          {{ item.name }}
        </view>
        <view class="tab-item flex-1" :class="{ next: list.length === current + 1 }"></view>
      </view>
      <view class="right-box">
        <view class="list" v-if="list.length">
          <view class="item" v-for="(item, i) in list" :key="i" @click="toPreview(item)">
            <view class="bold">
              {{ item.name }}
            </view>
            <view class="text-26 color-grey info" v-if="item.description">
              {{ item.description }}
            </view>
          </view>
        </view>
        <BaseEmpty
          v-if="!loading && !list.length"
          style="position: relative; top: 200rpx"
          massage="没有找到相关范本"
        />
        <baseline v-if="baseline" />
        <loadMore class="load-more" v-if="loading"></loadMore>
      </view>
    </template>
    <view style="position: relative; top: 200rpx" v-if="!loading && !CategoryList.length">
      <BaseEmpty massage="没有找到相关范本" />
    </view>
  </view>
</template>

<script>
import { templateList, templateCategory } from '@/api/file.js';
import config from '@/static/config/index.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      CategoryList: [],
      query: {
        pageNum: 1,
        pageSize: 15,
        categoryId: '',
        total: 0,
      },
      list: [],
      current: 0,
      loading: true,
    };
  },
  computed: {
    ...mapState(['token']),
    hasMore() {
      return this.list.length < this.query.total;
    },
    baseline() {
      return !this.loading && this.list.length === this.query.total && this.list.length > 10;
    },
  },
  filters: {
    fileName(txt) {
      return txt.slice(0, txt.lastIndexOf('.'));
    },
  },
  onLoad() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      templateCategory().then(res => {
        this.CategoryList = res || [];
        if (this.CategoryList.length) {
          this.query.categoryId = this.CategoryList[0].id;
          this.getList();
        } else {
          this.loading = false;
          this.$refs.loading.hide();
        }
      });
    },
    tabChange(id, i) {
      this.current = i;
      this.query.categoryId = id;
      this.query.pageNum = 1;
      this.loading = true;
      this.getList();
    },
    getList() {
      templateList(this.query)
        .then(res => {
          if (this.query.pageNum === 1) {
            this.list = res.rows;
          } else {
            this.list = [...this.list, ...res.rows];
          }
          this.query.total = res.total;
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.$refs.loading.hide();
          this.loading = false;
        });
    },
    toPreview(item) {
      if (!this.token) {
        this.common.toLogin();
        return;
      }
      const path = encodeURIComponent(
        config.manageAdminUrl + 'contract?tid=' + item.id + '&token=' + uni.getStorageSync('token')
      );
      uni.navigateTo({
        url: `/pages/user/company/authorize?path=${path}&title=${item.name}`,
      });
    },
    download(item) {
      if (!this.token) {
        this.common.toLogin();
        return;
      }
      uni.showLoading({ title: '正在打开' });
      uni.downloadFile({
        url: item.fileDownloadUrl,
        filePath: wx.env.USER_DATA_PATH + '/' + item.fileName,
        success: res => {
          uni.openDocument({
            filePath: res.filePath,
            fileType: item.fileName.split('.')[1],
            showMenu: true,
          });
        },
        complete(msg) {
          uni.hideLoading();
        },
      });
    },
  },
  onReachBottom() {
    if (this.hasMore) {
      this.query.pageNum += 1;
      this.getList();
    }
  },
  onPullDownRefresh() {
    this.tabChange(this.query.categoryId, this.current);
  },
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  .tab-list {
    height: 100%;
    width: 180rpx;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    z-index: 3;
    .tab-item {
      box-sizing: border-box;
      width: 100%;
      padding: 28rpx 16rpx;
      text-align: center;
      font-size: 28rpx;
      color: #666;
      background-color: #f5f5f5;
      &.active {
        background-color: #fff;
        color: $uni-color-primary;
      }
      &.prev {
        border-bottom-right-radius: 12rpx;
      }
      &.next {
        border-top-right-radius: 12rpx;
      }
    }
  }
  .list {
    padding: 0 32rpx;
    box-sizing: border-box;
    .item {
      border-bottom: 1px solid #f5f5f5;
      color: #333;
      font-size: 28rpx;
      padding: 40rpx 0;
      .info {
        margin-top: 10rpx;
      }
    }
  }
  .right-box {
    position: relative;
    margin-left: 180rpx;
    .load-more {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
    }
  }
}
</style>
