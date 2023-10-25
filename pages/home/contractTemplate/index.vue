<template>
  <view class="page flex-fs">
    <loading ref="loading" />
    <view class="tab-list flex-col" v-if="list.length">
      <view
        class="tab-item"
        v-for="(item, i) in list"
        :key="i"
        :class="{
          active: i === current,
          prev: i === current - 1,
          next: i === current + 1,
        }"
        @click="tabChange(item, i)"
      >
        {{ item.signTemplateName }}
      </view>
      <view class="tab-item flex-1" :class="{ next: list.length === current + 1 }"></view>
    </view>
    <view class="right-box flex-1" style="height: 100%" v-if="list.length">
      <view class="list" v-if="list[current].docTemplates && list[current].docTemplates.length">
        <view
          class="item"
          v-for="(item, i) in list[current].docTemplates"
          :key="i"
          @click="download(item)"
        >
          {{ item.fileName | fileName }}
        </view>
      </view>
      <BaseEmpty
        v-if="!loading && !list[current].docTemplates"
        style="margin-top: 200rpx"
        massage="没有找到相关范本"
      />
      <baseline v-if="list[current].docTemplates && list[current].docTemplates.length > 9" />
        <loadMore class="load-more" v-if="loading"></loadMore>
    </view>

    <view class="flex-1" v-if="!loading && !list.length">
      <BaseEmpty massage="没有找到相关范本" />
    </view>
  </view>
</template>

<script>
import { templateDetail, templateList } from '@/api/file.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      list: [],
      current: 0,
      loading: true,
    };
  },
  computed: {
    ...mapState(['token']),
  },
  filters: {
    fileName(txt) {
      return txt.slice(0, txt.lastIndexOf('.'));
    },
  },
  onLoad() {
    this.getList();
  },
  watch:{
    list(newVal, oldVal){
      if(newVal && newVal.length) {
       this.getDetail(newVal[this.current], this.current)
      }
    }
  },
  methods: {
    tabChange(item, i) {
      this.current = i;
      this.currentObj = item;
      this.getDetail(item, i)
    },
    getDetail(item, i){
      this.loading = true;
      templateDetail(item.signTemplateId).then(ress => {
        this.$nextTick(()=> {
          this.loading = false;
          this.$set(this.list[i], 'docTemplates', ress)
        })
      });
    },
    getList() {
      templateList()
        .then(res => {
          this.list = res || [];
        })
        .finally(() => {
          uni.stopPullDownRefresh();
          this.$refs.loading.hide();
          this.loading = false;
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
            console.log('res :', res)
            // var filePath = res.tempFilePath;
            console.log('item :', item)
            uni.openDocument({
              filePath: res.filePath,
              fileType:item.fileName.split('.')[1],
              showMenu: true,
              success: function (res) {
                console.log('打开文档成功');
              },
            });
          },
          complete(msg) {
            uni.hideLoading();
          },
        });
    },
  },
  onPullDownRefresh() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  .tab-list {
    height: 100%;
    width: 180rpx;
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
    }
  }
  .right-box {
    position: relative;
    .load-more {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
    }
  }
}
</style>
