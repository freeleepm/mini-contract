<!--
 * @Description: 文件管理页面
 * @LastEditTime: 2022-09-15 18:00:49
 * @LastEditors: 刘仁秀
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="container-card flex-col">
      <view class="text-26 color-base">从聊天记录中导入</view>
      <view class="tip text-24 color-grey-minor">支持doc、docx、pdf等格式且小于5M的文件</view>

      <view class="btn-primary text-30" @click="uploadFile">本地文件</view>
    </view>

    <view class="container-card">
      <view class="text-28 color-base bold">签署合同</view>

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
            placeholder="请输入合同名称搜索"
            v-model="params.content"
            @confirm="confirm"
          />
          <uni-icons
            v-if="params.content"
            type="clear"
            size="22"
            class="flex-ct"
            color="#E6E6E6"
            @click="clear"
          ></uni-icons>
        </view>
      </view>

      <view class="item flex-fs" v-for="(item, i) in list" :key="i" @click="openFile(item)">
        <image
          v-if="item.name.split('.')[1] === 'doc' || item.name.split('.')[1] === 'docx'"
          class="icon-doc"
          src="@/static/IconDoc.png"
        ></image>
        <image
          v-if="item.name.split('.')[1] === 'pdf'"
          class="icon-doc"
          src="@/static/IconPdf.png"
        ></image>
        <view class="flex-1" style="overflow: hidden;">
          <view class="text-name text-26 color-base text-elps">{{ item.name }}</view>
          <view class="text-24 color-grey-minor">{{ item.size | size }}</view>
        </view>
        <!-- <text
          class="iconfont icon-checked"
          :class="{ 'text-primary': id == item.id }"
          v-if="pick == 1"
        ></text> -->
        <!-- <text class="iconfont icon-shanchu" v-else @click.stop="del(item.id, i)"></text> -->
      </view>
      <loadMore v-if="loading"></loadMore>
      <baseline v-if="showBaseline"></baseline>
      <BaseEmpty v-if="noData" massage="暂无相关文件" style="margin-top: 30rpx"></BaseEmpty>
    </view>
  </view>
</template>

<script>
import config from '@/common/config.js';
import { list, create, remove } from '@/api/file.js';
import { upload } from '@/api/upload.js';
import { info } from '@/api/login.js';
var that,
  fastClick = true;
export default {
  data() {
    return {
      loading: true,
      list: [],
      params: {
        content: '',
        pageNum: 1,
        pageSize: 10,
      },
      noMore: false,
      pick: '',
      id: '',
      authentication: false,
    };
  },
  onShareAppMessage() {
    return this.setting.share;
  },
  onShareTimeline() {
    return this.setting.share;
  },
  onLoad(e) {
    that = this;
    if (e.pick) that.pick = e.pick;
    if (e.id) that.id = e.id;
    that.init();
    fastClick = true;
  },
  onUnload() {
    uni.hideLoading();
  },
  computed: {
    noData() {
      return !this.loading && !this.list.length;
    },
    showBaseline() {
      return !this.noMore && !this.loading && this.params.pageNum > 1;
    },
  },
  onPullDownRefresh() {
    that.params.pageNum = 1;
    that.loading = true;
    that.list = [];
    that.getList();
  },
  onReachBottom() {
    if (that.noMore) {
      that.loading = true;
      that.params.pageNum++;
      that.getList();
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 666) that.$refs.top.show();
    else that.$refs.top.hide();
  },
  methods: {
    getUinfo() {
      info().then(data => {
        that.authentication = data.authentication;
      });
    },
    async init() {
      await that.getUinfo();
      that.getList();
    },
    clear() {
      that.params.content = '';
      that.params.pageNum = 1;
      that.loading = true;
      that.list = [];
      that.getList();
    },
    confirm() {
      that.params.pageNum = 1;
      that.loading = true;
      that.list = [];
      that.getList();
    },
    getList() {
      that.noMore = false;
      list(that.params).then(data => {
        that.list = that.list.concat(data.rows);
        if (data.rows.length == that.params.pageSize) that.noMore = true;
        that.loading = false;
        uni.stopPullDownRefresh();
      });
    },
    uploadFile() {
      // #ifdef H5
      uni.chooseFile({
        count: 1,
        extension: ['.doc', '.docx', '.pdf'],
        success: function (res) {
          if (res.tempFiles[0]) {
            if (res.tempFiles[0].size / 1024 / 1024 > 5) {
              that.common.showToast('文件最大5M');
              return;
            }
            uni.showLoading({
              title: '正在上传',
            });
            upload(res.tempFiles[0]).then(path => {
              if (path) {
                create({
                  url: path,
                  name: res.tempFiles[0].name,
                  size: res.tempFiles[0].size,
                }).then(file => {
                  if (file) {
                    if (that.pick == 1) {
                      uni.setStorageSync('file_name', '');
                      uni.setStorage({
                        key: 'file',
                        data: file,
                        success: function () {
                          uni.navigateBack({
                            delta: 1,
                          });
                        },
                      });
                    } else {
                      that.list.unshift(file);
                    }
                  }
                });
              }
            });
          }
        },
      });
      // #endif
      // #ifdef MP-WEIXIN
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: function (res) {
          if (res.tempFiles[0]) {
            console.log(res.tempFiles[0]);
            let index = res.tempFiles[0].name.lastIndexOf('.') + 1;
            let type = res.tempFiles[0].name.slice(index, res.tempFiles[0].name.length);
            if (type == 'docx' || type == 'doc' || type == 'pdf') {
              if (res.tempFiles[0].size / 1024 / 1024 > 5) {
                that.common.showToast('文件最大5M');
                return;
              }
              uni.showLoading({
                title: '正在上传',
              });
              upload(res.tempFiles[0]).then(path => {
                if (path) {
                  create({
                    url: path,
                    name: res.tempFiles[0].name,
                    size: res.tempFiles[0].size,
                  }).then(file => {
                    uni.hideLoading();

                    if (file) {
                      if (that.pick == 1) {
                        uni.setStorageSync('file_name', '');
                        uni.setStorage({
                          key: 'file',
                          data: file,
                          success: function () {
                            uni.navigateBack({
                              delta: 1,
                            });
                          },
                        });
                      } else {
                        that.list.unshift(file);
                      }
                    }
                  });
                }
              });
            } else {
              that.common.showToast('文件格式不支持');
            }
          }
        },
      });
      // #endif
    },
    openFile(item) {
      if (that.pick == 1) {
        uni.setStorageSync('file_name', '');
        uni.setStorage({
          key: 'file',
          data: item,
          success: function () {
            uni.navigateBack({
              delta: 1,
            });
          },
        });
        return;
      }
      // #ifndef H5
      if (!fastClick) return;
      uni.showLoading({
        title: '请稍等',
      });
      fastClick = false;
      uni.downloadFile({
        url: config.imgUrl + item.url,
        success: function (res) {
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              setTimeout(() => {
                fastClick = true;
              }, 666);
              console.log('打开文档成功');
            },
            fail: function (res) {
              fastClick = true;
            },
          });
        },
        complete: function (res) {
          uni.hideLoading();
        },
        fail: function (res) {
          fastClick = true;
        },
      });
      // #endif
      // #ifdef H5
      that.common.showToast('请在小程序端打开');
      // #endif
    },
    del(id, i) {
      uni.showModal({
        title: '删除提醒',
        content: '删除后文件不可恢复，是否继续？',
        confirmText: '删除',
        cancelText: '取消',
        confirmColor: '#3277FF',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            remove({
              id: id,
            }).then(res => {
              that.list.splice(i, 1);
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container-card {
  box-sizing: border-box;
  margin-top: 32rpx;
  padding: 32rpx;
  width: 686rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .text-26 {
    line-height: 37rpx;
  }
}

.search-box {
  margin-top: 20rpx;

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

.tip {
  margin-top: 2rpx;
  margin-bottom: 16rpx;
  height: 33rpx;
}

.item {
  padding: 32rpx 0;
  border-bottom: 1px solid #e6e6e6;

  &:last-child {
    padding-bottom: 0;
    border: none;
  }

  .icon-doc {
    flex-shrink: 0;
    margin-right: 16rpx;
    width: 70rpx;
    height: 70rpx;
  }

  .text-name {
    margin-bottom: 4rpx;
  }
}

.btn-primary {
  width: 360rpx;
  height: 82rpx;
}
</style>
