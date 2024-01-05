<template>
  <view class="page-base">
    <loading ref="loading" />
    <view class="company-box flex-fs" v-if="userInfo && userInfo.companyName">
      <view class="bold color-base text-30">{{ userInfo.companyName }}</view>
      <image class="img-back" src="@/static/ImgBackEnterprise.png"></image>
    </view>
    <view class="list width-full">
      <view class="flex-sb item" v-for="(item, i) in list" :key="i">
        <view>
          <view class="color-base text-28">{{ item.name }} {{ item.account }}</view>
          <!-- <view class="color-grey-minor text-24">角色：{{ item.roleName }}</view> -->
          <view class="sarList text-24" v-if="item.sarList && userInfo.sealManager">
            <text class="label color-grey-minor">印章：</text>
            <view class="sarBox">
              <view class="tagItem" v-for="(sar, index) in item.sarList" :key="index">
                <uni-tag :text="sar.bizType" :type="sarColor[sar.state]" size="mini"></uni-tag>
              </view>
            </view>
          </view>
        </view>
        <view
          class="moreBox"
          @click.stop="showPopup(item)"
          v-if="!item.role || item.role.indexOf('99') == -1"
        >
          <uni-icons type="more-filled" size="16"></uni-icons>
        </view>
      </view>
    </view>
    <baseline v-if="list.length > 6" />
    <BaseEmpty v-if="noData" massage="暂无相关成员数据" />
    <btn-fixed v-if="userInfo && userInfo.companyId">
      <navigator url="./createMember" hover-class="none" class="btn-primary">添加成员</navigator>
    </btn-fixed>

    <uni-popup ref="popupRef" type="bottom" class="color-base" :safe-area="false">
      <view class="popup padding-safe">
        <!-- <view
		      class="row-popup text-28 flex-ct"
		      @click="showSar(1)"
		    >
		      编辑
		    </view> -->
        <view class="row-popup text-28 flex-ct" v-if="userInfo.phone !== checkedSeal.account"  @click="showSar(2)">删除</view>
        <view v-if="userInfo.sealManager" class="row-popup text-28 flex-ct" @click="showSar(0)">印章管理</view>
        <view style="height: 32rpx; background-color: #f5f5f5"></view>
        <view class="row-popup text-28 flex-ct" @click="$refs.popupRef.close()">取消</view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { memberList, memberDel } from '@/api/company.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      list: [],
      checkedSeal: {},
      sarColor: {
        1: 'warning',
        2: 'success',
        3: 'default',
      },
      loading: true,
    };
  },
  computed: {
    noData() {
      return !this.loading && !this.list.length;
    },
    ...mapState(['userInfo']),
  },
  onShow() {
    this.getList();
  },
  methods: {
    getList() {
      if (!this.userInfo || !this.userInfo.companyId) {
        this.loading = false;
        this.$refs.loading.hide();
        uni.stopPullDownRefresh();
        return;
      }
      memberList()
        .then(res => {
          this.list = res || [];
        })
        .finally(() => {
          this.loading = false;
          this.$refs.loading.hide();
          uni.stopPullDownRefresh();
        });
    },
    showSar(e) {
      console.log(e);
      if (e == 0) {
        uni.navigateTo({
          url: './sarManage?id=' + this.checkedSeal.id + '&name=' + this.checkedSeal.name,
        });
      } else if (e == 1) {
        uni.navigateTo({
          url: './createMember?id=' + this.checkedSeal.id,
        });
      } else if (e == 2) {
        this.memberDel();
      }
      this.$refs.popupRef.close();
    },
    memberDel() {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '确定删除成员' + this.checkedSeal.name + '？',
        confirmColor: '#dd524d',
        confirmText: '确定',
        cancelText: '取消',
        cancelColor: '#999999',
        success: function (res) {
          if (res.confirm) {
            memberDel(that.checkedSeal.id).then(() => {
              uni.showToast({
                title: '删除成功！',
                icon: 'none',
              });
              that.getList();
            });
          }
        },
      });
    },
    showPopup(item) {
      this.checkedSeal = item;
      this.$refs.popupRef.open();
    },
    toDetail(item) {
      uni.navigateTo({
        url: './createMember?id=' + item.id,
      });
    },
  },
  onPullDownRefresh() {
    this.getList();
  },
};
</script>

<style lang="scss">
.page-base {
  padding: 32rpx;

  .company-box {
    background-color: #ffffff;
    width: 100%;
    height: 158rpx;
    position: relative;
    border-radius: 12rpx;
    overflow: hidden;
    padding: 32rpx;

    .img-back {
      width: 198rpx;
      height: 158rpx;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .list {
    margin-top: 32rpx;
    background-color: #ffffff;
    border-radius: 12rpx;
    overflow: hidden;

    .item {
      padding: 32rpx;
      border-bottom: 1px solid #f6f6f6;
      align-items: flex-start;

      .color-base {
        padding-bottom: 10rpx;
      }

      .sarList {
        display: flex;
        padding-top: 20rpx;
        .label {
          // width: 100rpx;
        }
        .sarBox {
          flex: 1;
          display: flex;
          flex-flow: row wrap;
        }
        .tagItem {
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
      }
      .moreBox {
        width: 100rpx;
        /* height: 100rpx; */
        text-align: right;
      }
    }
  }

  .btn-primary {
    width: 598rpx;
    height: 88rpx;
    margin: 0 auto;
    border-radius: 8rpx;
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
</style>
