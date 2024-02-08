<!--
 * @Description: 文件管理页面
 * @LastEditTime: 2023-12-14 16:09:43
 * @LastEditors: wudi
 * @Author: 刘仁秀
 * @Date: 2022-09-02 15:21:16
-->
<template>
  <view class="page-base">
    <view class="container-card flex-col">
      <view class="text-26 color-base">从聊天记录中导入</view>
      <view class="tip text-24 color-grey-minor">
        签署文件最大5M，支持格式为pdf、doc、docx、png、jpg、jpeg
      </view>

      <!-- <view class="btn-primary text-30" @click="uploadFile">本地文件</view> -->
      <view class="btn-primary text-30" @click="openAction">选择文件</view>
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

      <view style="margin-left: -32rpx; margin-right: -32rpx; margin-bottom: -32rpx">
        <FileItem
          v-for="(item, i) in list"
          :file="item"
          :key="i"
          bg="#ffffff"
          border
          @click.native="openFile(item)"
        >
          <uni-icons
            type="checkbox-filled"
            size="24"
            color="#3277FF"
            v-if="pick == 1 && id == item.id"
          ></uni-icons>
          <view @click.stop="del(item.id, i)" v-if="!pick">
            <uni-icons type="trash" size="20" color="#dd524d"></uni-icons>
          </view>
        </FileItem>
      </view>
      <Images ref="image" @success="onSuccess" />
      <loadMore v-if="loading"></loadMore>
      <baseline v-if="showBaseline"></baseline>
      <BaseEmpty v-if="noData" massage="暂无相关文件" style="padding-top: 32rpx"></BaseEmpty>
      <backTop ref="top" />
    </view>
  </view>
</template>

<script>
import { list, create, remove } from '@/api/file.js';
import { upload } from '@/api/oss.js';
import { info } from '@/api/login.js';
import Images from './components/Images';
var that,
  fastClick = true;
export default {
  components: { Images },
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
    that.clear();
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
    openAction() {
      uni.showActionSheet({
        title: '选择上传文件',
        itemList: ['微信文件', '手机图片'],
        success: function (res) {
          if (res.tapIndex === 0) {
            that.uploadFile();
          } else if (res.tapIndex === 1) {
            that.$refs.image.pickImg();
          }
        },
      });
    },
    onSuccess(file) {
      console.log(file);
      create(file).then(callbackFile => {
        console.log(callbackFile);
        if (that.pick == 1) {
          uni.$emit('file', callbackFile);
          uni.navigateBack();
        } else {
          that.list.unshift(callbackFile);
        }
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
            // 跳过图片压缩的大小限制
            let size = res.tempFiles[0].size;
            res.tempFiles[0].size = 10485760 - 1;
            upload([res.tempFiles[0]]).then(urls => {
              if (urls) {
                let obj = urls[0];
                obj.size = size;
                create(obj).then(file => {
                  if (file) {
                    if (that.pick == 1) {
                      uni.$emit('file', file);
                      uni.navigateBack();
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
              // 跳过图片压缩的大小限制
              let size = res.tempFiles[0].size;
              res.tempFiles[0].size = 10485760 - 1;
              upload([res.tempFiles[0]]).then(urls => {
                if (urls) {
                  let obj = urls[0];
                  obj.size = size;
                  create(obj).then(file => {
                    uni.hideLoading();
                    console.log(file);
                    if (file) {
                      if (that.pick == 1) {
                        uni.$emit('file', file);
                        uni.navigateBack();
                      } else {
                        console.log('--------');
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
    handleDel(id, i) {
      if (that.pick != 1) {
        uni.showActionSheet({
          itemList: ['删除'],
          itemColor: '#e63c3c',
          success: function (res) {
            if (res.tapIndex === 0) {
              that.del(id, i);
            }
          },
        });
      }
    },
    openFile(item) {
      if (that.pick == 1) {
        uni.$emit('file', item);
        uni.navigateBack();
        return;
      }
      // #ifndef H5
      if (!fastClick) return;
      uni.showLoading({
        title: '请稍等',
      });
      fastClick = false;
      uni.downloadFile({
        url: item.url,
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
        confirmColor: '#e63c3c',
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
  margin: 32rpx 0;

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
  text-align: center;
}

.btn-primary {
  width: 360rpx;
  height: 82rpx;
}
</style>
